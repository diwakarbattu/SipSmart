"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// Multer Configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({ storage });
// Get all products - with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const total = await Product_1.default.countDocuments();
        const products = await Product_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json({
            data: products,
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
// Add Product (Admin Only)
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(['admin']), upload.single('image'), async (req, res) => {
    try {
        const productData = { ...req.body };
        if (req.file) {
            productData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        const product = new Product_1.default(productData);
        await product.save();
        // Notify all clients about the new product
        const io = req.app.get('io');
        io.emit('product_added', product);
        res.status(201).json(product);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Update Product (Admin Only)
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        // Notify all clients about the update
        const io = req.app.get('io');
        io.emit('product_updated', product);
        res.json(product);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Delete Product (Admin Only)
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        // Notify all clients about the deletion
        const io = req.app.get('io');
        io.emit('product_deleted', req.params.id);
        res.json({ message: 'Product deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
