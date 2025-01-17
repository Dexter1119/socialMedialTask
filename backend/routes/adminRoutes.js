const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, validateAdmin } = require('../models/Admin');
const ExpressError = require('../middleware/ExpressError');
const wrapAsync = require('../middleware/WrapAsync');

// Secret key for JWT token (use environment variables for better security)
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key'; // Fallback for development

// Register Admin
router.post(
    '/register',
    wrapAsync(async (req, res) => {
        const { username, password } = req.body;

        // Validate input using Joi schema
        const { error } = validateAdmin({ username, password });
        if (error) {
            throw new ExpressError(400, error.details.map(e => e.message).join(', '));
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            throw new ExpressError(400, 'An admin with this username already exists');
        }

        // Create and save new admin
        const newAdmin = new Admin({ username, password });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully!' });
    })
);

// Admin Login
router.post(
    '/login',
    wrapAsync(async (req, res) => {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            throw new ExpressError(400, 'Username and password are required');
        }

        // Find admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            throw new ExpressError(401, 'Invalid username or password');
        }

        // Compare provided password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            throw new ExpressError(401, 'Invalid username or password');
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                id: admin._id,
                username: admin.username,
                role: 'Admin',
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time
        );

        // Send response with token
        res.status(200).json({
            message: 'Login successful',
            token,
        });
    })
);

module.exports = router;
