import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    userName: { type: String },
    mobile: { type: String },
    productName: { type: String },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);
