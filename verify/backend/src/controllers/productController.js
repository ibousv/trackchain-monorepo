const mongoose = require('mongoose');
const Product = require('../models/Product');
const TraceEvent = require('../models/TraceEvent');

exports.createProduct = async (req, res) => {
  try {
    const { name, sku, description, metadata, category } = req.body;
    
    // Déterminer la catégorie basée sur le rôle de l'utilisateur
    let productCategory = category;
    if (!productCategory) {
      const roleCategoryMap = {
        'AGRICULTEUR': 'AGRICULTURE',
        'MEDECIN': 'SANTE', 
        'FONCIER': 'FONCIER',
        'ANAD': 'ANAD',
        'SUPER_ADMIN': 'GENERAL' // SUPER_ADMIN peut créer dans n'importe quelle catégorie
      };
      productCategory = roleCategoryMap[req.user.role] || 'GENERAL';
    }

    const p = new Product({ 
      name, 
      sku, 
      description, 
      metadata, 
      category: productCategory,
      owner: req.user.userId,
      ownerRole: req.user.role
    });
    
    await p.save();
    
    // Créer automatiquement un événement de création
    const traceEvent = new TraceEvent({
      product: p._id,
      actor: req.user.userId,
      type: 'creation',
      data: { 
        action: 'Produit créé',
        details: `Produit ${name} créé par ${req.user.role}` 
      }
    });
    await traceEvent.save();

    res.json(p);
  } catch (err) { 
    console.error(err); 
    res.status(500).send('Server error'); 
  }
};

exports.listProducts = async (req, res) => {
  try {
    console.log("=== DEBUG listProducts ===");
    console.log("User ID from token:", req.user.userId);
    console.log("User role:", req.user.role);
    
    const role = req.user.role;
    let query = {};

    // Filtrage par rôle avec logique spécifique
    switch (role) {
      case 'AGRICULTEUR':
        query.owner = new mongoose.Types.ObjectId(req.user.userId);
        console.log("Filtre AGRICULTEUR - Mes produits seulement");
        break;
        
      case 'MEDECIN':
        query.category = 'SANTE';
        console.log("Filtre MEDECIN - Tous les produits de santé");
        break;
        
      case 'FONCIER':
        query.category = 'FONCIER';
        console.log("Filtre FONCIER - Tous les produits fonciers");
        break;
        
      case 'ANAD':
        // ANAD peut voir tous les produits
        console.log("Filtre ANAD - Accès à tous les produits");
        break;
        
      case 'SUPER_ADMIN':
        // SUPER_ADMIN peut voir tous les produits
        console.log("Filtre SUPER_ADMIN - Accès complet à tous les produits");
        break;
        
      default:
        // Pour les autres rôles, seulement leurs propres produits
        query.owner = new mongoose.Types.ObjectId(req.user.userId);
        console.log("Filtre DEFAULT - Mes produits seulement");
    }

    console.log("Requête finale:", query);

    // Vérifiez TOUS les produits d'abord pour le debug
    const allProducts = await Product.find().populate('owner', 'name email role');
    console.log("Tous les produits dans la base:", allProducts.map(p => ({
      id: p._id,
      name: p.name,
      category: p.category,
      ownerId: p.owner?._id,
      ownerName: p.owner?.name,
      ownerRole: p.ownerRole
    })));

    // Requête filtrée selon le rôle
    const products = await Product.find(query).populate('owner', 'name email role');
    
    console.log("Produits filtrés trouvés:", products.length);
    console.log("Détails produits filtrés:", products.map(p => ({
      id: p._id,
      name: p.name,
      category: p.category,
      owner: p.owner?.name
    })));

    res.json(products);
  } catch (err) {
    console.error("Erreur détaillée:", err);
    res.status(500).send('Server error');
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner', 'name email role');
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Vérification des permissions selon le rôle
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    let hasAccess = false;
    
    switch (userRole) {
      case 'AGRICULTEUR':
        // Agriculteur ne peut voir que ses propres produits
        hasAccess = product.owner && product.owner._id.toString() === userId;
        break;
        
      case 'MEDECIN':
        // Médecin peut voir tous les produits de santé
        hasAccess = product.category === 'SANTE';
        break;
        
      case 'FONCIER':
        // Foncier peut voir tous les produits fonciers
        hasAccess = product.category === 'FONCIER';
        break;
        
      case 'ANAD':
        // ANAD peut voir tous les produits
        hasAccess = true;
        break;
        
      case 'SUPER_ADMIN':
        // SUPER_ADMIN peut voir tous les produits
        hasAccess = true;
        break;
        
      default:
        // Autres rôles : seulement leurs propres produits
        hasAccess = product.owner && product.owner._id.toString() === userId;
    }

    if (!hasAccess) {
      return res.status(403).json({ 
        msg: 'Accès refusé: Vous n\'avez pas la permission de voir ce produit' 
      });
    }

    // Récupérer l'historique des traces
    const traces = await TraceEvent.find({ product: product._id })
      .populate('actor', 'name role email')
      .sort({ timestamp: -1 });

    res.json({ product, traces });
  } catch (err) { 
    console.error(err); 
    res.status(500).send('Server error'); 
  }
};

// Nouvelle méthode pour les statistiques par rôle
exports.getDashboardStats = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    let statsQuery = {};
    
    // Filtrage des statistiques selon le rôle
    switch (userRole) {
      case 'AGRICULTEUR':
        statsQuery.owner = new mongoose.Types.ObjectId(userId);
        break;
      case 'MEDECIN':
        statsQuery.category = 'SANTE';
        break;
      case 'FONCIER':
        statsQuery.category = 'FONCIER';
        break;
      // ANAD, SUPER_ADMIN et autres voient tout
    }

    const totalProducts = await Product.countDocuments(statsQuery);
    
    // Produits par catégorie selon les permissions
    let productsByCategory = {};
    if (userRole === 'ANAD' || userRole === 'SUPER_ADMIN') {
      // ANAD et SUPER_ADMIN voient toutes les catégories
      productsByCategory = await Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
    } else {
      // Autres rôles voient seulement les catégories autorisées
      productsByCategory = await Product.aggregate([
        { $match: statsQuery },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
    }

    // Produits récents (7 derniers jours)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentProductsQuery = { ...statsQuery, createdAt: { $gte: oneWeekAgo } };
    const recentProductsCount = await Product.countDocuments(recentProductsQuery);

    res.json({
      total: totalProducts,
      recent: recentProductsCount,
      byCategory: productsByCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Méthode pour mettre à jour un produit avec vérification des permissions
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Vérification des permissions
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    let canUpdate = false;
    
    switch (userRole) {
      case 'AGRICULTEUR':
        // Agriculteur ne peut modifier que ses propres produits
        canUpdate = product.owner && product.owner.toString() === userId;
        break;
        
      case 'MEDECIN':
        // Médecin peut modifier les produits de santé
        canUpdate = product.category === 'SANTE';
        break;
        
      case 'FONCIER':
        // Foncier peut modifier les produits fonciers
        canUpdate = product.category === 'FONCIER';
        break;
        
      case 'ANAD':
        // ANAD peut modifier tous les produits
        canUpdate = true;
        break;
        
      case 'SUPER_ADMIN':
        // SUPER_ADMIN peut modifier tous les produits
        canUpdate = true;
        break;
        
      default:
        canUpdate = product.owner && product.owner.toString() === userId;
    }

    if (!canUpdate) {
      return res.status(403).json({ 
        msg: 'Accès refusé: Vous n\'avez pas la permission de modifier ce produit' 
      });
    }

    // Mise à jour du produit
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('owner', 'name email role');

    // Créer un événement de trace pour la modification
    const traceEvent = new TraceEvent({
      product: product._id,
      actor: req.user.userId,
      type: 'update',
      data: { 
        action: 'Produit modifié',
        details: `Modifications apportées par ${req.user.role}`,
        updatedFields: Object.keys(req.body)
      }
    });
    await traceEvent.save();

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Méthode pour supprimer un produit avec vérification des permissions
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Vérification des permissions (plus restrictive)
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    let canDelete = false;
    
    switch (userRole) {
      case 'AGRICULTEUR':
        // Agriculteur ne peut supprimer que ses propres produits
        canDelete = product.owner && product.owner.toString() === userId;
        break;
        
      case 'MEDECIN':
        // Médecin peut supprimer les produits de santé qu'il a créés
        canDelete = product.category === 'SANTE' && 
                   product.owner && product.owner.toString() === userId;
        break;
        
      case 'FONCIER':
        // Foncier peut supprimer les produits fonciers qu'il a créés
        canDelete = product.category === 'FONCIER' && 
                   product.owner && product.owner.toString() === userId;
        break;
        
      case 'ANAD':
        // ANAD peut supprimer tous les produits (administration)
        canDelete = true;
        break;
        
      case 'SUPER_ADMIN':
        // SUPER_ADMIN peut supprimer tous les produits
        canDelete = true;
        break;
        
      default:
        canDelete = product.owner && product.owner.toString() === userId;
    }

    if (!canDelete) {
      return res.status(403).json({ 
        msg: 'Accès refusé: Vous n\'avez pas la permission de supprimer ce produit' 
      });
    }

    // Supprimer aussi les traces associées
    await TraceEvent.deleteMany({ product: product._id });
    
    // Supprimer le produit
    await Product.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Produit et ses traces supprimés avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};