import { useState } from "react";
import { useNavigate } from "react-router";
import { Beer, Mail, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { motion } from "motion/react";
import { authService } from "../services/authService";
import { toast } from "sonner";

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "reset">("email"); // email step or reset step
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email");

    setIsLoading(true);
    try {
      await authService.sendForgotPasswordOtp(email);
      toast.success("OTP sent to your email");
      setStep("reset");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setIsLoading(true);
    try {
      await authService.resetPasswordWithOtp(email, otp, newPassword);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-12"
      >
        <div className="bg-accent p-3 rounded-2xl">
          <Beer className="w-8 h-8 text-accent-foreground" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">MT Beer Order</h1>
          <p className="text-muted-foreground text-sm">Quick & Easy</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {step === "email" ? "Forgot Password?" : "Reset Password"}
          </h2>
          <p className="text-muted-foreground">
            {step === "email"
              ? "Enter your email to receive an OTP"
              : "Enter the OTP and set a new password"}
          </p>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="w-32 h-40 bg-gradient-to-b from-yellow-600/20 to-yellow-800/20 rounded-3xl border-2 border-accent/30 flex items-center justify-center">
              {step === "email" ? (
                <Mail className="w-16 h-16 text-accent" strokeWidth={1.5} />
              ) : (
                <KeyRound className="w-16 h-16 text-accent" strokeWidth={1.5} />
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full border-2 border-background"></div>
          </motion.div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {step === "email" ? (
            <>
              {/* Email Step */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-card border-border"
                  />
                </div>
              </div>

              <Button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              {/* Reset Step */}
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="pl-12 h-14 rounded-2xl bg-card border-border tracking-widest text-center font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-12 pr-12 h-14 rounded-2xl bg-card border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 pr-12 h-14 rounded-2xl bg-card border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="w-full h-14 rounded-2xl hover:bg-card"
              >
                Use Different Email
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Back to Login
          </Button>
        </div>

        <div className="mt-auto pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
