import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, mobile, email, password, address, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or mobile' });
        }

        const user = new User({ name, mobile, email, password, address, role });
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret'
        );

        res.status(201).json({
            token,
            user: { id: user._id, name, email, mobile, role, address }
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { identity, password } = req.body; // identity can be email or mobile

        const user: any = await User.findOne({
            $or: [{ email: identity }, { mobile: identity }]
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret'
        );

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role, address: user.address }
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
