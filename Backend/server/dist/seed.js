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
async function seed() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding');
        // Clean up any existing users with these emails to ensure clean state
        await User_1.default.deleteMany({ email: { $in: ['admin@bottlemart.com', 'user@bottlemart.com'] } });
        const admin = new User_1.default({
            name: 'System Admin',
            mobile: '9999999991',
            email: 'admin@bottlemart.com',
            password: 'adminpassword123',
            address: 'BottleMart HQ',
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Default Admin created: admin@bottlemart.com / adminpassword123');
        const user = new User_1.default({
            name: 'Test User',
            mobile: '8888888881',
            email: 'user@bottlemart.com',
            password: 'userpassword123',
            address: 'User Apartment 101',
            role: 'user',
            isApproved: true
        });
        await user.save();
        console.log('✅ Default User created: user@bottlemart.com / userpassword123');
        await mongoose_1.default.connection.close();
        console.log('Seeding completed');
    }
    catch (err) {
        console.error('Seeding error:', err);
    }
}
seed();
