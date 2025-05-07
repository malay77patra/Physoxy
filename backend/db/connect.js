const mongoose = require("mongoose");

const connectDB = async () => {
    console.log("Connecting to database...");
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected.");
    } catch (error) {
        console.log(error);
        throw new Error("❌ MongoDB connection failed");
    }
};

module.exports = connectDB;