import mongoose from 'mongoose';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mt-beer-order';

async function checkUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        const users = await User.find({}, { name: 1, email: 1, mobile: 1, role: 1, isApproved: 1 });
        console.log('Current Users in DB:', JSON.stringify(users, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error checking users:', err);
    }
}

checkUsers();
