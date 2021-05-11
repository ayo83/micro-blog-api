const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });

        console.log('Database connected');
    } catch (error) {
        console.log(error.message);

    /** Exit process with failure */
        process.exit(1);
    }
}

module.exports = connectDB;