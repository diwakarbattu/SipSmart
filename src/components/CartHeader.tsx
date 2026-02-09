import { useNavigate } from "react-router";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../state/CartContext";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface CartHeaderProps {
  title?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
  subtitle?: string;
  logo?: string;
}

export function CartHeader({
  title = "MT Beer Order",
  showMenu = false,
  onMenuClick,
  subtitle = "Quick & Easy",
  logo,
}: CartHeaderProps) {
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-gradient-to-b from-card to-background border-b border-border/50 px-6 py-4">
        <div className="flex justify-between items-center mb-0">
          {/* Left - Logo & Title */}
          <div className="flex items-center gap-3 flex-1">
            {logo && (
              <div className="w-10 h-10 rounded-xl bg-accent/10 p-1.5 flex items-center justify-center border border-accent/20">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              {subtitle && (
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  {subtitle}
                </p>
              )}
              <h1 className="text-lg font-bold tracking-tight">{title}</h1>
            </div>
          </div>

          {/* Right - Cart Icon & Menu */}
          <div className="flex items-center gap-3">
            {/* Cart Icon with Badge */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 bg-secondary rounded-xl hover:bg-accent/20 transition-colors active:scale-95"
              title={`Cart: ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
            >
              <ShoppingCart className="w-6 h-6" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-background shadow-lg"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Menu Button (if needed) */}
            {showMenu && (
              <button
                onClick={handleMenuClick}
                className="p-2 bg-secondary rounded-xl hover:bg-accent/20 transition-colors active:scale-95"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Cart Summary Bar (Optional) */}
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 pt-3 border-t border-border/30 flex justify-between items-center text-sm"
          >
            <span className="text-muted-foreground">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
            </span>
            <span className="font-bold text-accent">
              ₹{totalPrice.toFixed(2)}
            </span>
          </motion.div>
        )}
      </div>
    </>
  );
}
