const User = require('../models/User');
const Product = require('../models/Product');
const TraceEvent = require('../models/TraceEvent');
const bcrypt = require('bcryptjs');

module.exports = async function seed() {
  try {
    // --- USERS ---
    let users = await User.find();
    if (users.length === 0) {
      const defaultUsers = [
        { name: 'Super Admin', email: 'admin@trackchain.test', password: 'Admin@123', role: 'SUPER_ADMIN' },
        { name: 'Agriculteur A', email: 'agri@trackchain.test', password: 'Agri@123', role: 'AGRICULTEUR' },
        { name: 'Médecin M', email: 'med@trackchain.test', password: 'Med@123', role: 'MEDECIN' },
        { name: 'Foncier F', email: 'foncier@trackchain.test', password: 'Foncier@123', role: 'FONCIER' },
        { name: 'ANAD', email: 'anad@trackchain.test', password: 'Anad@123', role: 'ANAD' }
      ];

      for (const u of defaultUsers) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(u.password, salt);
        const saved = await new User({ name: u.name, email: u.email, password: hashed, role: u.role }).save();
        u._id = saved._id;
      }
      console.log('✅ Seeded default users');
      users = await User.find(); // recharger avec _id
    }

    // --- PRODUCTS ---
    let products = await Product.find();
    if (products.length === 0) {
      const productsData = [
        { name: 'Maïs Bio', category: 'AGRICULTURE', ownerRole: 'AGRICULTEUR', owner: users.find(u => u.role==='AGRICULTEUR')._id, sku: 'SKU-MAIS-001' },
        { name: 'Riz Local', category: 'AGRICULTURE', ownerRole: 'AGRICULTEUR', owner: users.find(u => u.role==='AGRICULTEUR')._id, sku: 'SKU-RIZ-001' },
        { name: 'Vaccin BCG', category: 'SANTE', ownerRole: 'MEDECIN', owner: users.find(u => u.role==='MEDECIN')._id, sku: 'SKU-BCG-001' },
        { name: 'Paracétamol 500mg', category: 'SANTE', ownerRole: 'MEDECIN', owner: users.find(u => u.role==='MEDECIN')._id, sku: 'SKU-PARA-500' },
        { name: 'Titre Foncier TF-001', category: 'FONCIER', ownerRole: 'FONCIER', owner: users.find(u => u.role==='FONCIER')._id, sku: 'SKU-TF-001' },
        { name: 'Rapport Sanitaire RS-001', category: 'ANAD', ownerRole: 'ANAD', owner: users.find(u => u.role==='ANAD')._id, sku: 'SKU-RS-001' }
      ];
      

      products = await Product.insertMany(productsData);
      console.log('✅ Seeded default products');
    }

    // --- TRACES ---
    const traces = await TraceEvent.find();
    if (traces.length === 0) {
      const tracesData = [];

      products.forEach(p => {
        tracesData.push({
          product: p._id,
          description: 'Produit créé',
          actor: p.owner,   // ✅ ici
          timestamp: new Date(),
          type: 'production'
        });

        if (p.category === 'SANTE' || p.category === 'ANAD') {
          tracesData.push({
            product: p._id,
            description: 'Contrôle sanitaire effectué',
            actor: users.find(u => u.role==='ANAD')._id,  // ✅ ici
            timestamp: new Date(),
            type: 'inspection'
          });
        }

        tracesData.push({
          product: p._id,
          description: 'Produit expédié',
          actor: p.owner,   // ✅ ici
          timestamp: new Date(),
          type: 'transport'
        });
      });

      await TraceEvent.insertMany(tracesData);
      console.log('✅ Seeded default traces/events');
    }


  } catch (err) {
    console.error('❌ Seeding error', err);
  }
};

