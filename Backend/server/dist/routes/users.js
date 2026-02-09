"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all users (Admin Only) - with pagination
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const total = await User_1.default.countDocuments({ role: 'user' });
        const users = await User_1.default.find({ role: 'user' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json({
            data: users,
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
// Get user by ID (Admin or Self)
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const user = await User_1.default.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Update user (Admin or Self)
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        // Only allow admin or the user themselves to update
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        // Dynamically build update object to avoid overwriting with undefined
        const updates = {};
        const allowedUpdates = ['name', 'mobile', 'email', 'address', 'isApproved', 'rewardPoints', 'profilePic'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });
        // Prevent non-admins from updating restricted fields
        if (req.user.role !== 'admin') {
            delete updates.isApproved;
            delete updates.rewardPoints;
        }
        const user = await User_1.default.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Delete user (Admin Only)
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
