const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/profilePics', express.static(path.join(__dirname, 'uploads/profilePics')));

// Routes
app.use('/api', authRoutes);
app.use('/api/posts', postRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(5000, () => {
            console.log('Server running on port 5000');
        });
    })
    .catch(err => console.log(err));
