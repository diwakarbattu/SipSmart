import express from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Notification from '../models/Notification';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Create Order
router.post('/', authenticate, async (req: any, res) => {
    try {
        const { productList, totalPrice, address } = req.body;

        // Check stock for each product
        for (const item of productList) {
            const product = await Product.findById(item.productId);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
            }
        }

        // Create order
        const order = new Order({
            userId: req.user.id,
            userName: req.body.userName || 'Guest',
            mobile: req.body.mobile || 'N/A',
            productList,
            totalPrice,
            address,
            status: 'In Progress'
        });
        await order.save();

        // Update stock
        for (const item of productList) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

        // Create notification for admin
        const notification = new Notification({
            orderId: order._id,
            userName: order.userName,
            mobile: order.mobile,
            productName: productList[0].name,
            message: `New order from ${order.userName}`
        });
        await notification.save();

        // Socket.io: Notify Admin
        const io = req.app.get('io');
        io.emit('new_order', { order, notification });

        res.status(201).json(order);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Update Order Status (Admin Only)
router.patch('/:id/status', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Socket.io: Notify User
        const io = req.app.get('io');
        io.to(order.userId.toString()).emit('order_status_updated', order);

        res.json(order);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get User Orders
router.get('/my-orders', authenticate, async (req: any, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Orders (Admin Only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
