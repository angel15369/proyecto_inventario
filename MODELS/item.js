const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  photo: { type: String, required: false },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Item", itemSchema);
