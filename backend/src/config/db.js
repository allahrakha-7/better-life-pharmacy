import mongoose from 'mongoose';
import { seedDatabase } from './seed.js';

export const connectDB = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            console.log("Connecting to MongoDB...");
            await mongoose.connect(process.env.MONGO_URI, { family: 4 });
            console.log("MongoDB connected successfully!");
            // Seed catalog
            await seedDatabase();
            break;
        } catch (error) {
            console.error(`Error in connecting to MongoDB (${retries} retries left):`, error.message || error);
            retries -= 1;
            if (retries === 0) {
                console.error("All connection attempts failed. Exiting.");
                process.exit(1);
            }
            console.log("Waiting 5 seconds before retrying...");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};