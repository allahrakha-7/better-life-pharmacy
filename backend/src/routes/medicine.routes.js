import express from 'express';
import { getMedicines, getMedicineById, createMedicine, updateMedicineStock, deleteMedicine, uploadMedicineImage } from '../controllers/medicineController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getMedicines)
    .post(protect, admin, createMedicine);

router.post('/upload-image', protect, admin, upload.single('image'), uploadMedicineImage);

router.route('/:id')
    .get(getMedicineById)
    .delete(protect, admin, deleteMedicine);

router.put('/:id/stock', protect, admin, updateMedicineStock);

export default router;
