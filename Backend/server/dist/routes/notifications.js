"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Notification_1 = __importDefault(require("../models/Notification"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all notifications (Admin Only)
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    try {
        const notifications = await Notification_1.default.find().sort({ createdAt: -1 });
        res.json(notifications);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Mark notification as read
router.patch('/:id/read', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    try {
        const notification = await Notification_1.default.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!notification)
            return res.status(404).json({ message: 'Notification not found' });
        res.json(notification);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Mark all as read
router.post('/read-all', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    try {
        await Notification_1.default.updateMany({ isRead: false }, { isRead: true });
        res.json({ message: 'All notifications marked as read' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
