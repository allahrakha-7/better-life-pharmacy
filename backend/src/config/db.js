import mongoose from 'mongoose';
import { seedDatabase } from './seed.js';

export const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log("MongoDB connected successfully!");
        // Seed catalog
        await seedDatabase();
    } catch (error) {
        console.error("Error in connecting to MongoDB:", error);
        process.exit(1);
    }
};