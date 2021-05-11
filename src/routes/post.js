const express = require('express');
const authGuard = require('../middleware/authGuard');
const Post = require('../model/Post');

const router = new express.Router();

/** Create Post */
router.post('/post/add', authGuard, async (req, res) => {
    try {
        const incomingData = req.body;
        incomingData.dateCreated = new Date();
        incomingData.postedBy = req.user._id;

        const newPost = new Post(incomingData);
        await newPost.save();

        res.status(201).json({
            message: 'Posted Successfully',
            data: newPost
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

/** Get all my posts */
router.get('/post/all', authGuard, async (req, res) => {
    try {
        const { _id } = req.user;
        const postCount = await Post.countDocuments({ postedBy: _id });
        const posts = await Post.find({ postedBy: _id });

        res.status(200).json({
            message: 'Successfully',
            postCount,
            data: posts
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});




module.exports = router;