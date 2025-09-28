
const mongoose = require('mongoose');
const Product = require('../models/Product');
const TraceEvent = require('../models/TraceEvent');

exports.createProduct = async (req, res) => {
  try {
    const { name, sku, description, metadata } = req.body;
    const p = new Product({ name, sku, description, metadata, owner: req.user.userId });
    await p.save();
    res.json(p);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};

exports.listProducts = async (req, res) => {
  try {
    console.log("les données de req: ", req.user);

    const role = req.user.role;
    let query = {};

    // 🔥 Conversion string -> ObjectId pour MongoDB
    if (role === 'AGRICULTEUR') {
      query.owner = new mongoose.Types.ObjectId(req.user.userId);
    }
    // const allProducts = await Product.find();
    // console.log("Tous les produits dans la base : ", allProducts);

    // console.log("les donné que contient query.owner: ",query.owner);
    const products = await Product.find(query).populate('owner', 'name email role');

    // console.log("Produits trouvés :", products);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


exports.getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).populate('owner', 'name email role');
    if (!p) return res.status(404).json({ msg: 'Product not found' });
    const traces = await TraceEvent.find({ product: p._id }).populate('actor', 'name role email').sort({ timestamp: -1 });
    res.json({ product: p, traces });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};
