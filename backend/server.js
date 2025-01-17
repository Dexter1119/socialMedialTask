const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Create app
const app = express();

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Allow cross-origin requests from your frontend
const allowedOrigins = ['http://localhost:5174', 'http://localhost:5175'];  // Correct CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Database connection
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SocialMedia'; // Replace with your actual URI
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
const userRoutes = require("./routes/UserRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
