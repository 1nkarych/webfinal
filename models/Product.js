const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false } // Change to false
});
module.exports = mongoose.model('Product', ProductSchema);