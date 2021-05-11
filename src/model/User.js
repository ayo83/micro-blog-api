const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    username: {
        type: String
    },

    dateReg: {
        type: String
    },

    token: {
        type: String
    }

});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.token;

    return userObject;
 }

/** Hashing password before saving to DB */
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next()
});

/**Generate User Token */
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET);

    user.token = token;
    await user.save();
    return token;
}


/** Compare password */
userSchema.statics.comparePassword = async (email, plainPassword, res) => {
    const findUser = await User.findOne({ email });
    if (!findUser) return res.status(404).json({error: 'Wrong Email or Password'});

    const isMatch = await bcrypt.compare(plainPassword, findUser.password);
    if (!isMatch) return res.status(404).json({ error: 'Wrong Email or Password' });
    
    return findUser;
}



const User = mongoose.model('User', userSchema);

module.exports = User;