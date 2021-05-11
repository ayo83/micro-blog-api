const jwt = require('jsonwebtoken');
const User = require('../model/User');
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        // if(req.header)res.status(401).send({ error: 'Please Add Token to header' });
        const token = req.header('Authorization');

        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({ _id: decoded._id, token: token });
        if (!user) throw new Error();
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Please Authenticate' });
    }
};

module.exports = auth;