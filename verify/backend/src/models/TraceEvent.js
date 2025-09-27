const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TraceEventSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['production','transport','storage','health_check','sale','inspection'], required: true },
  actor: { type: Schema.Types.ObjectId, ref: 'User' },
  data: Schema.Types.Mixed,
  hashOnChain: String,
  hederaTxId: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TraceEvent', TraceEventSchema);
