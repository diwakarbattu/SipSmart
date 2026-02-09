"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    mobile: { type: String, required: true },
    productList: [
        {
            productId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product' },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        }
    ],
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    pickupDate: { type: String },
    pickupTime: { type: String },
    rewardPointsEarned: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    cancelReason: { type: String },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date },
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
exports.default = mongoose_1.default.model('Order', orderSchema);
