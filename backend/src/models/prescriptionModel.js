import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    trackingNumber: {
        type: String,
        required: true,
        unique: true
    },
    patientName: {
        type: String,
        required: [true, 'Please add patient name']
    },
    phone: {
        type: String,
        required: [true, 'Please add a contact phone number']
    },
    notes: {
        type: String,
        default: ''
    },
    fileUrl: {
        type: String,
        required: [true, 'Please provide the uploaded prescription file URL']
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending Verification', 'Approved', 'Rejected'],
        default: 'Pending Verification'
    }
}, {
    timestamps: true
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
