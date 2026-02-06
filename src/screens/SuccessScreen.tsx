import { useNavigate, useLocation } from "react-router";
import { CheckCircle2, Home, ArrowRight, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";

export function SuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, pickupDate, pickupTime } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Success Animation - Beer Clink */}
        <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
          {/* Left Beer */}
          <motion.div
            initial={{ x: -50, rotate: -45, opacity: 0 }}
            animate={{ x: -10, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 12,
              delay: 0.2
            }}
            className="text-amber-500 relative z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-500 fill-amber-500/20"
            >
              <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
              <path d="M9 12v6" />
              <path d="M13 12v6" />
              <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5v17c1.76 0 3 .5 3 .5s1.24-.5 3-.5V7.5Z" />
              <path d="M5 11v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-8" />
            </svg>
          </motion.div>

          {/* Right Beer */}
          <motion.div
            initial={{ x: 50, rotate: 45, opacity: 0 }}
            animate={{ x: 10, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 12,
              delay: 0.2
            }}
            className="text-amber-500 relative z-10 -ml-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-500 fill-amber-500/20 -scale-x-100"
            >
              <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
              <path d="M9 12v6" />
              <path d="M13 12v6" />
              <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5v17c1.76 0 3 .5 3 .5s1.24-.5 3-.5V7.5Z" />
              <path d="M5 11v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-8" />
            </svg>
          </motion.div>

          {/* Clink Effect (Star/Burst) */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400 rounded-full blur-lg opacity-50"
          />
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-black tracking-tight">Order Placed!</h1>
          <p className="text-muted-foreground">
            Sit back and relax, your pickup is scheduled.
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
              <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Scheduled Pickup</span>
              <span className="text-sm font-bold">{pickupDate} at {pickupTime}</span>
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