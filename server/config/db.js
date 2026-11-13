const mongoose = require('mongoose');

// Connect to MongoDB database
const connectDB = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/freelance-app';
    try {
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('\n===============================================================');
        console.error(`[MongoDB Connection Notice]: ${error.message}`);
        console.error(`URI attempted: ${uri}`);
        console.error('If MongoDB is installed locally, start it via:');
        console.error('  net start MongoDB  (or run mongod.exe)');
        console.error('Or use a free cloud MongoDB Atlas cluster URI in server/.env:');
        console.error('  MONGO_URI=mongodb+srv://<user>:<pwd>@cluster.mongodb.net/freelance-app');
        console.error('===============================================================\n');
    }
};

module.exports = connectDB;
