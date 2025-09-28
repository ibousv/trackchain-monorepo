const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  description: String,
  category: { type: String },          // 🔥 ajouté
  ownerRole: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  metadata: Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
