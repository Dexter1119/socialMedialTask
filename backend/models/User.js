const mongoose = require('mongoose');

// Define a schema for user submissions
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    socialMediaHandle: { type: String, required: true },
    images: { type: [String], required: true },
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = { User };
