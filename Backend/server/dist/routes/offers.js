"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Offer_1 = __importDefault(require("../models/Offer"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all offers
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const offers = await Offer_1.default.find().sort({ createdAt: -1 });
        res.json(offers);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Create offer (Admin Only)
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    try {
        const offer = new Offer_1.default(req.body);
        await offer.save();
        res.status(201).json(offer);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Update offer (Admin Only)
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    try {
        const offer = await Offer_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!offer)
            return res.status(404).json({ message: 'Offer not found' });
        res.json(offer);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Delete offer (Admin Only)
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    try {
        const offer = await Offer_1.default.findByIdAndDelete(req.params.id);
        if (!offer)
            return res.status(404).json({ message: 'Offer not found' });
        res.json({ message: 'Offer deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
