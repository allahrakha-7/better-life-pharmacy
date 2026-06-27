import express from 'express';
import { uploadPrescription, getPendingPrescriptions, verifyPrescription } from '../controllers/prescriptionController.js';
import { protect, admin, optionalProtect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();

router.post('/upload', upload.single('prescription'), optionalProtect, async (req, res, next) => {
    if (req.file) {
        try {
            const cloudinaryUrl = await uploadToCloudinary(req.file.path);
            if (cloudinaryUrl) {
                req.body.fileUrl = cloudinaryUrl;
            } else {
                // Fallback to local storage URL
                req.body.fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            }
        } catch (error) {
            return res.status(500).json({ message: 'Failed to upload prescription image: ' + error.message });
        }
    }
    next();
}, uploadPrescription);

router.get('/', protect, admin, getPendingPrescriptions);
router.put('/:id/verify', protect, admin, verifyPrescription);

export default router;
