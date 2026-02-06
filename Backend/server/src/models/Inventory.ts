import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    currentStock: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
}, {
    toJSON: {
        transform: (doc, ret: any) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

export default mongoose.model('Inventory', inventorySchema);
