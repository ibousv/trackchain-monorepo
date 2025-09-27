const TraceEvent = require('../models/TraceEvent');
const Product = require('../models/Product');
const hederaService = require('../services/hederaService');
const crypto = require('crypto');

exports.addTrace = async (req, res) => {
  try {
    const { product: productId, type, data } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    const payload = JSON.stringify({ product: productId, type, data, actor: req.user.userId, ts: new Date().toISOString() });
    const hash = crypto.createHash('sha256').update(payload).digest('hex');

    const hederaResult = await hederaService.recordHashOnHedera(hash);

    const trace = new TraceEvent({ product: productId, type, actor: req.user.userId, data, hashOnChain: hash, hederaTxId: hederaResult.txId || '' });
    await trace.save();

    res.json({ trace, hedera: hederaResult });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};

exports.listTraces = async (req, res) => {
  try {
    const { product } = req.query;
    const filter = {};
    if (product) filter.product = product;
    const traces = await TraceEvent.find(filter).populate('actor', 'name role email').sort({ timestamp: -1 });
    res.json(traces);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};
