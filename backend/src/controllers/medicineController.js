import Medicine from '../models/medicineModel.js';

// @desc    Get all medicines with search & filter options
// @route   GET /api/medicines
// @access  Public
export const getMedicines = async (req, res) => {
    try {
        const { category, search, maxPrice } = req.query;
        let query = {};

        if (category && category !== 'All Categories') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        if (maxPrice) {
            query.price = { $lte: Number(maxPrice) };
        }

        const medicines = await Medicine.find(query);
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single medicine details by ID
// @route   GET /api/medicines/:id
// @access  Public
export const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (medicine) {
            res.json(medicine);
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new medicine product
// @route   POST /api/medicines
// @access  Private/Admin
export const createMedicine = async (req, res) => {
    try {
        const { name, category, price, image, description, type, brand, stock } = req.body;

        const medicine = await Medicine.create({
            name,
            category,
            price,
            image,
            description,
            type,
            brand,
            stock
        });

        res.status(201).json(medicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update medicine stock inventory
// @route   PUT /api/medicines/:id/stock
// @access  Private/Admin
export const updateMedicineStock = async (req, res) => {
    try {
        const { stock } = req.body;
        const medicine = await Medicine.findById(req.params.id);

        if (medicine) {
            medicine.stock = stock;
            const updatedMedicine = await medicine.save();
            res.json(updatedMedicine);
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete medicine product
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
export const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (medicine) {
            await medicine.deleteOne();
            res.json({ message: 'Medicine deleted successfully' });
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload medicine product image
// @route   POST /api/medicines/upload-image
// @access  Private/Admin
export const uploadMedicineImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        
        // Dynamic import to avoid circular dependencies if any
        const { uploadToCloudinary } = await import('../utils/cloudinary.js');
        const cloudinaryUrl = await uploadToCloudinary(req.file.path);

        if (cloudinaryUrl) {
            res.json({ imageUrl: cloudinaryUrl });
        } else {
            const localUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            res.json({ imageUrl: localUrl });
        }
    } catch (error) {
        res.status(500).json({ message: 'Image upload failed: ' + error.message });
    }
};
