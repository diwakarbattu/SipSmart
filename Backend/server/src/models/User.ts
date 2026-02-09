import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isApproved: {
      type: Boolean,
      default: function (this: any) {
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
  },
  {
    toJSON: {
      transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.otp;
        delete ret.otpExpiry;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.otp;
        delete ret.otpExpiry;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
