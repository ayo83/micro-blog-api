const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },

    body: {
        type: String,
        required: [true, 'Please add to body'],
    },

    tag: {
        type: String,
    },

    category: {
        type: String,
        required: [true, 'Please add a category'],
    },

    dateCreated: {
        type: String
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;