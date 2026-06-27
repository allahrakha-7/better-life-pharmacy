import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow guest checkouts
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please add patient/buyer name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email address']
    },
    phone: {
        type: String,
        required: [true, 'Please add contact phone number']
    },
    address: {
        type: String,
        required: [true, 'Please add shipping address']
    },
    city: {
        type: String,
        required: [true, 'Please specify the city']
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'card'],
        default: 'cod'
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        required: true,
        default: 150
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending Review', 'Processing', 'In Transit', 'Completed', 'Cancelled'],
        default: 'Pending Review'
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
