// Import mongoose to connect to MongoDB
const mongoose = require('mongoose');

// This function connects our app to the database
// Database se connect karne ke liye function
const connectDB = async () => {
    try {
        // Mongoose ko MongoDB URI pass karte hain connect karne ke liye
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Agar connection fail ho jaye toh error dikhao
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
