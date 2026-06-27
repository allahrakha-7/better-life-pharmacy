import Order from '../models/orderModel.js';
import Medicine from '../models/medicineModel.js';

// Helper to generate custom order ID (e.g. BLP-ORD-123456)
const generateOrderId = () => {
    return `BLP-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
};

// @desc    Create a new medicine order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
    try {
        const { name, email, phone, address, city, paymentMethod, items, subtotal, shipping, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // 1. Validate and decrement stocks
        for (const item of items) {
            const medicine = await Medicine.findById(item.medicine);
            if (!medicine) {
                return res.status(404).json({ message: `Medicine not found: ${item.name}` });
            }
            if (medicine.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
            }
            // Decrement
            medicine.stock -= item.quantity;
            await medicine.save();
        }

        // 2. Save order
        const orderId = generateOrderId();
        const order = await Order.create({
            user: req.user ? req.user._id : undefined,
            orderId,
            name,
            email,
            phone,
            address,
            city,
            paymentMethod,
            items,
            subtotal,
            shipping,
            total,
            status: 'Pending Review'
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by database ID
// @route   GET /api/orders/:id
// @access  Private/Public
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Track order by custom Order ID (e.g. BLP-ORD-123456)
// @route   GET /api/orders/track/:orderId
// @access  Public
export const trackOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order tracking ID not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders for admin logs
// @route   GET /api/orders
// @access  Private/Admin
export const getRecentOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
