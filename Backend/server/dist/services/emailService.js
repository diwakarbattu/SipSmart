"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configure your email service here
const transporter = nodemailer_1.default.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
exports.emailService = {
    sendOtpEmail: async (email, otp, name) => {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset OTP - MT Beer Order",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                        <h2 style="color: #333;">Password Reset Request</h2>
                        <p>Hi ${name},</p>
                        <p>You requested to reset your password. Use the following OTP to proceed:</p>
                        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                            <h1 style="color: #ffd700; letter-spacing: 5px; margin: 0;">${otp}</h1>
                        </div>
                        <p style="color: #666;">This OTP is valid for 10 minutes.</p>
                        <p style="color: #666;">If you did not request this, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px;">MT Beer Order Team</p>
                    </div>
                `,
            };
            await transporter.sendMail(mailOptions);
            return true;
        }
        catch (error) {
            console.error("Email sending error:", error);
            throw new Error("Failed to send OTP email");
        }
    },
    sendWelcomeEmail: async (email, name) => {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Welcome to MT Beer Order",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                        <h2 style="color: #333;">Welcome to MT Beer Order!</h2>
                        <p>Hi ${name},</p>
                        <p>Your account has been created successfully. You can now login and start ordering your favorite beers.</p>
                        <p>Happy ordering!</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px;">MT Beer Order Team</p>
                    </div>
                `,
            };
            await transporter.sendMail(mailOptions);
            return true;
        }
        catch (error) {
            console.error("Email sending error:", error);
            // Don't throw error for welcome email, it shouldn't block registration
            return false;
        }
    },
};
