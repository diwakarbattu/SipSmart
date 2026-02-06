import express from 'express';
import Offer from '../models/Offer';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get all offers
router.get('/', authenticate, async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json(offers);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Create offer (Admin Only)
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const offer = new Offer(req.body);
        await offer.save();
        res.status(201).json(offer);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Update offer (Admin Only)
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        res.json(offer);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete offer (Admin Only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        res.json({ message: 'Offer deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
