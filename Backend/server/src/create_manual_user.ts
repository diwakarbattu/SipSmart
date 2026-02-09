import mongoose from 'mongoose';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mt-beer-order';

async function createUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'demo@bottlemart.com';

        // Check if exists
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('User already exists. Deleting...');
            await User.deleteOne({ email });
        }

        const user = new User({
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

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

createUser();
