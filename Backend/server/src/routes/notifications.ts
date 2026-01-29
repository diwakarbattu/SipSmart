import express from 'express';
import Notification from '../models/Notification';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get all notifications (Admin Only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Mark notification as read
router.patch('/:id/read', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json(notification);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Mark all as read
router.post('/read-all', authenticate, authorize(['admin']), async (req, res) => {
    try {
        await Notification.updateMany({ isRead: false }, { isRead: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
