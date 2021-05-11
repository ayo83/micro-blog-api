const express = require('express');
const authGuard = require('../middleware/authGuard');
const User = require('../model/User');

const router = new express.Router();

/** Register user Route */
router.post('/user/register', async (req, res) => {
    try {
        /** Validate User */
        const validateUser = await User.findOne({ email: req.body.email });
        if (validateUser) return res.status(404).json({ error: 'User already exist with this  email' });

        const userObject = req.body;
        userObject.dateReg = new Date();
        
        const newUser = new User(userObject);
        await newUser.save();

        res.status(201).json({
            message: "User Registered ",
            data: newUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});


/** Login User */
router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.comparePassword(email, password, res);

        const token = await user.generateAuthToken();

        res.status(200).json({
            message: "Logged in successful",
            token,
            user
        });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

/**Get my profile */
router.get('/user/profile', authGuard, (req, res) => {
    try {
        const profile = req.user;
        res.status(200).json({
            message: "success",
            profile
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

/** Logout */
router.patch('/user/logout', authGuard, async (req, res) =>{
    try {
        const user = req.user;
        user.token = '';
        await user.save();

        res.status(200).json({
            message: "Logout successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;