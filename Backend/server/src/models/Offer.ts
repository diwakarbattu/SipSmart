import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
    discountType: { type: String, enum: ['Percentage', 'Flat'], required: true },
    discountValue: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
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

export default mongoose.model('Offer', offerSchema);
