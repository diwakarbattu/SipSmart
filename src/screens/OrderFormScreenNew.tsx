import { useNavigate } from "react-router";
import { ArrowLeft, Pencil, X } from "lucide-react";
import { useCart } from "../state/CartContext";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";

export function OrderFormScreenNew() {
  const navigate = useNavigate();
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    navigate("/home");
    return null;
  }

  const handleProceed = () => {
    navigate("/address");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="px-6 pt-8 pb-4 bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Order Summary</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/cart')}
              className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:text-accent transition-colors"
              title="Edit Order"
            >
              <Pencil className="w-5 h-5 text-accent" />
            </button>
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:text-destructive transition-colors"
              title="Cancel Order"
            >
              <X className="w-5 h-5 text-destructive" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">
        {/* Cart Items Summary */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Selected Items</h2>
          {items.map((item, index) => (
            <motion.div
              key={item.bottle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-4 border border-border flex gap-4 items-center"
            >
              <div className="w-16 h-16 rounded-xl bg-secondary/30 overflow-hidden flex-shrink-0">
                <img
                  src={item.bottle.image}
                  alt={item.bottle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{item.bottle.name}</h3>
                <p className="text-muted-foreground text-xs">{item.quantity} x ₹{item.bottle.price}</p>
              </div>
              <p className="font-bold text-accent">₹{item.bottle.price * item.quantity}</p>
            </motion.div>
          ))}
        </div>

        {/* Total Price Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl p-6 border border-accent/20 shadow-inner"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Bill</p>
              <p className="text-4xl font-black text-accent tracking-tight">₹{totalPrice}</p>
            </div>
            <div className="bg-accent/20 p-4 rounded-2xl">
              <ShoppingBag className="w-8 h-8 text-accent" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-8 bg-card border-t border-border">
        <Button
          onClick={handleProceed}
          className="w-full h-16 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-2xl shadow-accent/20 text-lg font-bold transition-all active:scale-95"
        >
          Proceed to Address
        </Button>
      </div>
    </div>
  );
}

import { ShoppingBag } from "lucide-react";
