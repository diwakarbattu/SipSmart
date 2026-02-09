"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isApproved: {
        type: Boolean,
        default: function () {
            return this.role === "admin";
        },
    },
    profilePic: { type: String, default: "" },
    rewardPoints: { type: Number, default: 0 },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        promotions: { type: Boolean, default: true },
    },
    createdAt: { type: Date, default: Date.now },
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.otp;
            delete ret.otpExpiry;
            return ret;
        },
    },
    toObject: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.otp;
            delete ret.otpExpiry;
            return ret;
        },
    },
});
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    this.password = await bcryptjs_1.default.hash(this.password, 10);
});
exports.default = mongoose_1.default.model("User", userSchema);
