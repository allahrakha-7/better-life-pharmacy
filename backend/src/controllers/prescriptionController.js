import Prescription from '../models/prescriptionModel.js';

// Helper to generate custom RX tracking number (e.g. BLP-RX-123456)
const generateRxTrackingNumber = () => {
    return `BLP-RX-${Math.floor(100000 + Math.random() * 900000)}`;
};

// @desc    Submit a doctor prescription for review
// @route   POST /api/prescriptions/upload
// @access  Public
export const uploadPrescription = async (req, res) => {
    try {
        const { patientName, phone, notes, fileUrl } = req.body;

        if (!patientName || !phone) {
            return res.status(400).json({ message: 'Patient name and phone number are required' });
        }

        const trackingNumber = generateRxTrackingNumber();
        const prescription = await Prescription.create({
            user: req.user ? req.user._id : undefined,
            trackingNumber,
            patientName,
            phone,
            notes: notes || '',
            fileUrl: fileUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80', // Default mock file url if not uploaded
            status: 'Pending Verification'
        });

        res.status(201).json(prescription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all prescriptions (for pharmacist dashboard)
// @route   GET /api/prescriptions
// @access  Private/Admin
export const getPendingPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({}).sort({ createdAt: -1 });
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve/Reject prescription review status
// @route   PUT /api/prescriptions/:id/verify
// @access  Private/Admin
export const verifyPrescription = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['Pending Verification', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid validation status' });
        }

        const prescription = await Prescription.findById(req.params.id);

        if (prescription) {
            prescription.status = status;
            const updatedPrescription = await prescription.save();
            res.json(updatedPrescription);
        } else {
            res.status(404).json({ message: 'Prescription not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
