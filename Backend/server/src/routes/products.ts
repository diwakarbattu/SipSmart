import express from 'express';
import Product from '../models/Product';
import { authenticate, authorize } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Add Product (Admin Only)
router.post('/', authenticate, authorize(['admin']), upload.single('image'), async (req: any, res) => {
    try {
        const productData = { ...req.body };
        if (req.file) {
            productData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const product = new Product(productData);
        await product.save();

        // Notify all clients about the new product
        const io = req.app.get('io');
        io.emit('product_added', product);

        res.status(201).json(product);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Update Product (Admin Only)
router.put('/:id', authenticate, authorize(['admin']), upload.single('image'), async (req: any, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Notify all clients about the update
        const io = req.app.get('io');
        io.emit('product_updated', product);

        res.json(product);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Product (Admin Only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Notify all clients about the deletion
        const io = req.app.get('io');
        io.emit('product_deleted', req.params.id);

        res.json({ message: 'Product deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
