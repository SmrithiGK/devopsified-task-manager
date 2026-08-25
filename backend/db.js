const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURL =
            process.env.MONGO_URL || "mongodb://127.0.0.1:27017/taskmanager";

        await mongoose.connect(mongoURL);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;