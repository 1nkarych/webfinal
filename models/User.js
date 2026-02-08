// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String } // <--- Add this line!
});

module.exports = mongoose.model('User', UserSchema);
