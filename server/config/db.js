const mongoose = require('mongoose');
const dns = require('dns');

// Fix Windows Node.js c-ares DNS resolution bug for MongoDB Atlas SRV records
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
    // fallback if custom DNS cannot be set
}

// Connect to MongoDB database
const connectDB = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/freelance-app';
    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000
        });
        console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error('\n===============================================================');
        console.error(`[MongoDB Connection Notice]: ${error.message}`);
        console.error(`URI attempted: ${uri}`);
        console.error('If using MongoDB Atlas:');
        console.error('  1. Check Atlas console -> Network Access -> Add IP Address -> 0.0.0.0/0');
        console.error('  2. Verify database username and password in server/.env');
        console.error('Or if running local MongoDB:');
        console.error('  net start MongoDB  (or run mongod.exe)');
        console.error('===============================================================\n');
    }
};

module.exports = connectDB;
