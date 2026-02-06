import express from 'express';
import User from '../models/User';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get all users (Admin Only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Get user by ID (Admin or Self)
router.get('/:id', authenticate, async (req: any, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Update user (Admin or Self)
router.put('/:id', authenticate, async (req: any, res) => {
    try {
        // Only allow admin or the user themselves to update
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Dynamically build update object to avoid overwriting with undefined
        const updates: any = {};
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

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete user (Admin Only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
