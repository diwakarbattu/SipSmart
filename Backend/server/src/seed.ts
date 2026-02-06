import mongoose from 'mongoose';
import User from './models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mt-beer-order';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding');

        // Clean up any existing users with these emails to ensure clean state
        await User.deleteMany({ email: { $in: ['admin@bottlemart.com', 'user@bottlemart.com'] } });

        const admin = new User({
            name: 'System Admin',
            mobile: '9999999991',
            email: 'admin@bottlemart.com',
            password: 'adminpassword123',
            address: 'BottleMart HQ',
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Default Admin created: admin@bottlemart.com / adminpassword123');

        const user = new User({
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

        await mongoose.connection.close();
        console.log('Seeding completed');
    } catch (err) {
        console.error('Seeding error:', err);
    }
}

seed();
