const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { User } = require('../models/User');
const ExpressError = require('../middleware/ExpressError');
const wrapAsync = require('../middleware/WrapAsync');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this folder exists or create it dynamically
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new ExpressError(400, 'Only image files (jpeg, jpg, png, gif) are allowed!'), false);
        }
    },

});

// Middleware to ensure the "uploads" directory exists
const ensureUploadsDirectory = (req, res, next) => {
    const fs = require('fs');
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    next();
};

// POST route to handle user submissions
router.post(
    '/submit',
    ensureUploadsDirectory,
    upload.array('images', 10), // Limit to 10 files
    wrapAsync(async (req, res, next) => {
        const { name, socialMediaHandle } = req.body;

        // Check for missing required fields
        if (!name || !socialMediaHandle || !req.files || req.files.length === 0) {
            throw new ExpressError(400, 'Name, social media handle, and at least one image are required!');
        }

        // Map uploaded file paths
        const imagePaths = req.files.map((file) => file.path);

        // Save user data to the database
        const user = new User({ name, socialMediaHandle, images: imagePaths });
        await user.save();

        res.status(201).json({
            message: 'User information and images submitted successfully!',
            user,
        });
    })
);

// GET route to retrieve all user submissions
router.get(
    '/submissions',
    wrapAsync(async (req, res) => {
        const users = await User.find();
        res.status(200).json(users);
    })
);

// GET route to retrieve a specific user by ID
router.get(
    '/:id',
    wrapAsync(async (req, res, next) => {
        const { id } = req.params;

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ExpressError(400, 'Invalid User ID format');
        }

        // Find user by ID
        const user = await User.findById(id);
        if (!user) {
            throw new ExpressError(404, 'User not found');
        }

        res.status(200).json(user);
    })
);

// Global error handling for file upload and other errors
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        return res.status(400).json({ message: `Multer Error: ${err.message}` });
    } else if (err instanceof ExpressError) {
        // Handle custom Express errors
        return res.status(err.status).json({ message: err.message });
    } else {
        // Handle other errors
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
