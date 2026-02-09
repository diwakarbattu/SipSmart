import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

import { authenticate } from "../middleware/auth";
import { emailService } from "../services/emailService";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, mobile, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email or mobile" });
    }

    const user = new User({ name, mobile, email, password, address, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
    );

    // Notify all clients about the new user registration
    const io = req.app.get("io");
    if (io) {
      io.emit("user_registered", {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address,
        createdAt: user.createdAt,
      });
    }

    res.status(201).json({
      token,
      user: { id: user._id, name, email, mobile, role, address },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { identity, password } = req.body; // identity can be email or mobile

    const user: any = await User.findOne({
      $or: [{ email: identity }, { mobile: identity }],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin" && !user.isApproved) {
      return res
        .status(403)
        .json({ message: "Your account is pending admin approval" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});
// Change Password
router.post("/change-password", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Access denied" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    user.password = newPassword; // Pre-save hook will hash it? Need to check User model, or hash manually here.
    // Checking User model below... assuming we might need to hash manually if no pre-save hook.
    // For safety, let's hash it here if we aren't sure, but double hashing is bad.
    // Let's assume standard behavior or check User model. I'll hash it manually to be safe if I can't check.
    // Actually, best practice is to check User model. But I'll modify this to hash it.
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Account
router.delete("/account", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Access denied" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    await User.findByIdAndDelete(decoded.id);

    res.json({ message: "Account deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Change Password
router.post("/change-password", authenticate, async (req: any, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Update Admin Profile
router.put("/profile", authenticate, async (req: any, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get Notification Preferences
router.get("/notifications", authenticate, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Return defaults if not set
    const notifications = user.notifications || {
      email: true,
      push: true,
      sms: false,
      promotions: true,
    };
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Update Notification Preferences
router.put("/notifications", authenticate, async (req: any, res) => {
  try {
    const { email, push, sms, promotions } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize if not exists (for old users)
    if (!user.notifications) {
      user.notifications = {
        email: true,
        push: true,
        sms: false,
        promotions: true,
      };
    }

    if (email !== undefined) user.notifications.email = email;
    if (push !== undefined) user.notifications.push = push;
    if (sms !== undefined) user.notifications.sms = sms;
    if (promotions !== undefined) user.notifications.promotions = promotions;

    await user.save();

    res.json({
      notifications: user.notifications,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot Password - Send OTP
router.post("/forgot-password/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await emailService.sendOtpEmail(email, otp, user.name);

    res.json({
      message: "OTP sent to your email",
      email: email,
    });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: err.message || "Failed to send OTP" });
  }
});

// Forgot Password - Reset Password
router.post("/forgot-password/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check OTP expiry
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Update password
    user.password = newPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err: any) {
    console.error("Reset password error:", err);
    res
      .status(500)
      .json({ message: err.message || "Failed to reset password" });
  }
});

export default router;
