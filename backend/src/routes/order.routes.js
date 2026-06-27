import express from 'express';
import { createOrder, getOrderById, trackOrder, updateOrderStatus, getRecentOrders } from '../controllers/orderController.js';
import { protect, admin, optionalProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(optionalProtect, createOrder)
    .get(protect, admin, getRecentOrders);

router.get('/track/:orderId', trackOrder);

router.route('/:id')
    .get(getOrderById);

router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
