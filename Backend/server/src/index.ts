import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import notificationRoutes from './routes/notifications';
import userRoutes from './routes/users';
import offerRoutes from './routes/offers';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mt-beer-order';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Socket.io
io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    socket.on('join', (room) => {
        socket.join(room);
        console.log(`👤 User joined room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('👋 Client disconnected');
    });
});

// Make io accessible to routes
app.set('io', io);

// Basic Route
app.get('/', (req, res) => {
    res.send('MT Beer Order API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/offers', offerRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
