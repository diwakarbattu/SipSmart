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
async function checkUsers() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        const users = await User_1.default.find({}, { name: 1, email: 1, mobile: 1, role: 1, isApproved: 1 });
        console.log('Current Users in DB:', JSON.stringify(users, null, 2));
        await mongoose_1.default.connection.close();
    }
    catch (err) {
        console.error('Error checking users:', err);
    }
}
checkUsers();
