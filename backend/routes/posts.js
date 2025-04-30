const express = require('express');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.userId = decoded.id;
        next();
    });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

const upload = multer({ storage: storage });

// Create a post
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const newPost = new Post({
            title,
            content,
            author: req.userId, // Author from verified token
            image: `/uploads/${req.file.filename}`
        });

        await newPost.save();

        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create post', error: err });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
      const posts = await Post.find().populate('author', 'username');
  
      const postsWithImageUrl = posts.map(post => {
        if (post.image) {
          // Replace backslashes with slashes
          const imagePath = post.image.replace(/\\/g, '/');
          
          // Remove leading slash if it exists
          const cleanedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
          post.image = `http://localhost:5000/${cleanedPath}`;
        }
        return post;
      });
  
      res.json(postsWithImageUrl);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  


// Get a single post

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        
        if (post.image) {
            post.image = `http://localhost:5000${post.image}`;
        }

        res.json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});


// Update post
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Prepare updated fields
        const updatedFields = {
            title: req.body.title,
            content: req.body.content,
        };

        if (req.file) {
            updatedFields.image = `/uploads/${req.file.filename}`;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true }
        );

        res.json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update post', error: err });
    }
});

// Delete post
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;