"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mt-beer-order';
async function createUser() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        const email = 'demo@bottlemart.com';
        // Check if exists
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            console.log('User already exists. Deleting...');
            await User_1.default.deleteOne({ email });
        }
        const user = new User_1.default({
            name: 'Demo User',
            mobile: '9876543210',
            email: email,
            password: 'password123', // Will be hashed by pre-save hook
            address: '123 Demo St, Tech City',
            role: 'user',
            isApproved: true
        });
        await user.save();
        console.log('✅ Created User:');
        console.log(`Email: ${email}`);
        console.log(`Password: password123`);
        await mongoose_1.default.connection.close();
    }
    catch (err) {
        console.error('Error:', err);
    }
}
createUser();
