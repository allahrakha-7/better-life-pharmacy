import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add the medicine name'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    type: {
        type: String,
        required: [true, 'Please specify the drug type (e.g. Tablet, Capsule, Syrup)']
    },
    brand: {
        type: String,
        required: [true, 'Please add the manufacturer brand']
    },
    stock: {
        type: Number,
        required: [true, 'Please specify stock quantity'],
        default: 100
    }
}, {
    timestamps: true
});

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
