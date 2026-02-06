
import mongoose from 'mongoose';
import User from './models/User';
import Product from './models/Product';
import Order from './models/Order';
import dotenv from 'dotenv';

dotenv.config();

const inspect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mt-beer-order');
        console.log('✅ Connected to Database\n');

        // Users
        const users = await User.find().sort({ createdAt: -1 }).limit(5);
        const userCount = await User.countDocuments();
        console.log(`--- USERS (${userCount} total) ---`);
        users.forEach(u => console.log(`- ${u.name} (${u.email || u.mobile}) [${u.role}]`));
        console.log('');

        // Products
        const products = await Product.find().sort({ createdAt: -1 }).limit(5);
        const productCount = await Product.countDocuments();
        console.log(`--- PRODUCTS (${productCount} total) ---`);
        products.forEach(p => console.log(`- ${p.name}: ₹${p.price} (Stock: ${p.stock}) ${p.size ? '[' + p.size + ']' : ''}`));
        console.log('');

        // Orders
        const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
        const orderCount = await Order.countDocuments();
        console.log(`--- RECENT ORDERS (${orderCount} total) ---`);
        orders.forEach(o => console.log(`- Order #${o._id.toString().slice(-6)} | ₹${o.totalPrice} | Status: ${o.status}`));
        console.log('');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Done.');
        process.exit(0);
    }
};

inspect();
