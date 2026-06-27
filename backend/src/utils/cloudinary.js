import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.warn("Cloudinary is not configured. Falling back to local storage.");
            return null; // Signals fallback to local URL
        }

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        // Upload local file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: 'better-life-pharmacy',
        });

        // Delete the local file to save disk space
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response.secure_url;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        
        // Clean up the local file anyway on error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        throw error;
    }
};
