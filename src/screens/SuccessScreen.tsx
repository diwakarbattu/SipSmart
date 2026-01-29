import { useNavigate, useLocation } from "react-router";
import { CheckCircle2, Home, ArrowRight, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";

export function SuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, deliveryTime } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
          className="relative mx-auto w-32 h-32 bg-success/20 rounded-full flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-success/10 rounded-full animate-ping"></div>
          <CheckCircle2 className="w-20 h-20 text-success" strokeWidth={1.5} />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-black tracking-tight">Order Placed!</h1>
          <p className="text-muted-foreground">
            Sit back and relax, your chilled beer is on the way.
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-3xl p-6 border border-border shadow-xl space-y-4"
        >
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Order ID</span>
            <span className="font-mono font-bold text-accent">{orderId || "#MT78291"}</span>
          </div>
          <div className="h-px bg-border"></div>
          <div className="flex justify-between items-center">
            <div className="text-left">
              <span className="text-muted-foreground text-xs block mb-1">Estimated Arrival</span>
              <span className="text-lg font-bold">{deliveryTime || "30-45 mins"}</span>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-secondary rounded-2xl hover:bg-accent/10 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3 pt-4"
        >
          <Button
            onClick={() => navigate("/home")}
            className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold flex items-center justify-center gap-2 group"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center justify-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors mx-auto"
          >
            View Order Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}