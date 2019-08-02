const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, index: true, required: true },
    tags: [{ type: String }],
    address: { type: String, default: '' },
    phoneNumber: { type: Number }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);