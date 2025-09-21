import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectionStr = process.env.MONGO_URI || "";

async function connectDB() {
    console.log("🔍 Loaded MONGO_URI:", connectionStr);

    if (!connectionStr) {
        throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(connectionStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,           // disabling autoIndex in production to avoid performance
    });

    console.log("✅ MongoDB connected");
}

export default connectDB;