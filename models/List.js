const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  responseCodes: [{ code: String, imageUrl: String }],
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('List', listSchema);
