"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const Product_1 = __importDefault(require("./models/Product"));
const Order_1 = __importDefault(require("./models/Order"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const inspect = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mt-beer-order');
        console.log('✅ Connected to Database\n');
        // Users
        const users = await User_1.default.find().sort({ createdAt: -1 }).limit(5);
        const userCount = await User_1.default.countDocuments();
        console.log(`--- USERS (${userCount} total) ---`);
        users.forEach(u => console.log(`- ${u.name} (${u.email || u.mobile}) [${u.role}]`));
        console.log('');
        // Products
        const products = await Product_1.default.find().sort({ createdAt: -1 }).limit(5);
        const productCount = await Product_1.default.countDocuments();
        console.log(`--- PRODUCTS (${productCount} total) ---`);
        products.forEach(p => console.log(`- ${p.name}: ₹${p.price} (Stock: ${p.stock}) ${p.size ? '[' + p.size + ']' : ''}`));
        console.log('');
        // Orders
        const orders = await Order_1.default.find().sort({ createdAt: -1 }).limit(5);
        const orderCount = await Order_1.default.countDocuments();
        console.log(`--- RECENT ORDERS (${orderCount} total) ---`);
        orders.forEach(o => console.log(`- Order #${o._id.toString().slice(-6)} | ₹${o.totalPrice} | Status: ${o.status}`));
        console.log('');
    }
    catch (err) {
        console.error('Error:', err);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Done.');
        process.exit(0);
    }
};
inspect();
