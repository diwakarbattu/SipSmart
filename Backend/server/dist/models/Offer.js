"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const offerSchema = new mongoose_1.default.Schema({
    discountType: { type: String, enum: ['Percentage', 'Flat'], required: true },
    discountValue: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
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
exports.default = mongoose_1.default.model('Offer', offerSchema);
