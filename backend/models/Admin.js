const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

// Define Admin Schema
const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save middleware to hash the password before saving
AdminSchema.pre('save', async function (next) {
    const admin = this;

    // If the password is not modified, skip hashing
    if (!admin.isModified('password')) return next();

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password
        admin.password = await bcrypt.hash(admin.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords for login
AdminSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

// Create Joi validation schema for admin
const validateAdmin = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .trim()
            .required()
            .messages({
                'string.base': 'Username must be a string',
                'string.empty': 'Username cannot be empty',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username cannot exceed 30 characters',
                'any.required': 'Username is required',
            }),
        password: Joi.string()
            .min(8)
            .max(50)
            .required()
            .messages({
                'string.base': 'Password must be a string',
                'string.empty': 'Password cannot be empty',
                'string.min': 'Password must be at least 8 characters long',
                'string.max': 'Password cannot exceed 50 characters',
                'any.required': 'Password is required',
            }),
    });

    return schema.validate(data, { abortEarly: false });
};

// Create Admin model
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = { Admin, validateAdmin };
