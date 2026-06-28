import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import medicineRoutes from './src/routes/medicine.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import prescriptionRoutes from './src/routes/prescription.routes.js';
import { notFound, errorHandler } from './src/middlewares/errorMiddleware.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.get('/', (req, res) => {
    res.json({ message: 'Better Life Pharmacy API is running...' });
});

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Fallback middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
