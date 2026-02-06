import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String },
    size: { type: String, enum: ['180ml', '375ml', '750ml'], default: '750ml' },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    toJSON: {
        transform: (doc, ret: any) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        transform: (doc, ret: any) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

export default mongoose.model('Product', productSchema);
