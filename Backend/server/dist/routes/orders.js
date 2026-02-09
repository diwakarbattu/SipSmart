"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const Notification_1 = __importDefault(require("../models/Notification"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Create Order
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const { productList, totalPrice, address, pickupDate, pickupTime } = req.body;
        // Check stock for each product
        for (const item of productList) {
            const product = await Product_1.default.findById(item.productId);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
            }
        }
        // Create order
        const order = new Order_1.default({
            userId: req.user.id,
            userName: req.body.userName || 'Guest',
            mobile: req.body.mobile || 'N/A',
            productList,
            totalPrice,
            address,
            pickupDate,
            pickupTime,
            status: 'Pending'
        });
        await order.save();
        // Update stock
        for (const item of productList) {
            await Product_1.default.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }
        // Create notification for admin
        const notification = new Notification_1.default({
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
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Update Order Status (Admin Only)
router.patch('/:id/status', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order_1.default.findById(req.params.id);
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        const oldStatus = order.status;
        order.status = status;
        // If order marked as Delivered, award flat 10 reward points
        if (status === 'Delivered' && oldStatus !== 'Delivered') {
            const points = 10;
            order.rewardPointsEarned = points;
            await User_1.default.findByIdAndUpdate(order.userId, {
                $inc: { rewardPoints: points }
            });
        }
        await order.save();
        // Socket.io: Notify User
        const io = req.app.get('io');
        io.to(order.userId.toString()).emit('order_status_updated', order);
        res.json(order);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Get User Orders
router.get('/my-orders', auth_1.authenticate, async (req, res) => {
    try {
        const orders = await Order_1.default.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Get All Orders (Admin Only) - with pagination and filters
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        // Build filter object
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.userId) {
            filter.userId = req.query.userId;
        }
        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate) {
                filter.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                filter.createdAt.$lte = new Date(req.query.endDate);
            }
        }
        const total = await Order_1.default.countDocuments(filter);
        const orders = await Order_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json({
            data: orders,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Modify Order (User - Pending orders only)
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        // Validate ownership
        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // Only allow modification if order is Pending
        if (order.status !== 'Pending') {
            return res.status(400).json({
                message: `Cannot modify order with status: ${order.status}. Only Pending orders can be modified.`
            });
        }
        const { productList, pickupDate, pickupTime, address } = req.body;
        // Restore old stock (reverse old quantities)
        for (const item of order.productList) {
            await Product_1.default.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.quantity }
            });
        }
        // Validate and reserve new stock
        if (productList) {
            for (const item of productList) {
                const product = await Product_1.default.findById(item.productId);
                if (!product || product.stock < item.quantity) {
                    // Roll back old stock restoration
                    for (const oldItem of order.productList) {
                        await Product_1.default.findByIdAndUpdate(oldItem.productId, {
                            $inc: { stock: -oldItem.quantity }
                        });
                    }
                    return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
                }
            }
            // Update stock for new quantities
            for (const item of productList) {
                await Product_1.default.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity }
                });
            }
            order.productList = productList;
            order.totalPrice = productList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        if (pickupDate)
            order.pickupDate = pickupDate;
        if (pickupTime)
            order.pickupTime = pickupTime;
        if (address)
            order.address = address;
        order.modifiedAt = new Date();
        await order.save();
        // Notify admin via socket
        const io = req.app.get('io');
        if (io) {
            io.emit('order_modified', {
                orderId: order._id,
                userName: order.userName,
                message: `Order #${order._id} was modified by ${order.userName}`
            });
        }
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Cancel Order (User - Pending or Accepted)
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        // Validate ownership
        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // Only allow cancellation if order is Pending or Accepted
        if (!['Pending', 'Accepted'].includes(order.status)) {
            return res.status(400).json({
                message: `Cannot cancel order with status: ${order.status}`
            });
        }
        const { cancelReason } = req.body;
        // Restore stock
        for (const item of order.productList) {
            await Product_1.default.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.quantity }
            });
        }
        order.status = 'Cancelled';
        if (cancelReason)
            order.cancelReason = cancelReason;
        await order.save();
        // Notify admin via socket
        const io = req.app.get('io');
        if (io) {
            io.emit('order_cancelled', {
                orderId: order._id,
                userName: order.userName,
                reason: cancelReason || 'No reason provided',
                message: `Order #${order._id} was cancelled by ${order.userName}`
            });
        }
        res.json({ message: 'Order cancelled successfully', order });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
