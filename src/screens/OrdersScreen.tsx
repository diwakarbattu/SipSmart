import { useState } from "react";
import { useNavigate } from "react-router";
import { Package, Pencil, X } from "lucide-react";
import { motion } from "motion/react";
import { useOrders } from "../state/OrderContext";
import { Button } from "../components/ui/button";
import { useCart } from "../state/CartContext";
import { BottomNav } from "../components/BottomNav";

export function OrdersScreen() {
  const navigate = useNavigate();
  const { orders, cancelOrder } = useOrders();
  const { totalItems } = useCart();
  const [orderTab, setOrderTab] = useState<"active" | "history">("active");

  const filteredOrders = orders.filter(o => {
    if (orderTab === "active") return ["Pending", "Accepted"].includes(o.status);
    return ["Delivered", "Cancelled"].includes(o.status);
  });

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-muted-foreground text-sm">
          Track your chilled deliveries
        </p>
      </div>

      {/* Custom Tabs */}
      <div className="px-6 pb-6">
        <div className="flex bg-secondary/50 p-1 rounded-2xl relative">
          <motion.div
            layoutId="activeTab"
            className="absolute bg-card rounded-xl shadow-sm top-1 bottom-1 left-1 w-[calc(50%-4px)]"
            initial={false}
            animate={{
              x: orderTab === "history" ? "100%" : "0%"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setOrderTab("active")}
            className={`flex-1 relative z-10 py-3 text-sm font-bold text-center transition-colors ${orderTab === "active" ? "text-foreground" : "text-muted-foreground"}`}
          >
            Active Orders
          </button>
          <button
            onClick={() => setOrderTab("history")}
            className={`flex-1 relative z-10 py-3 text-sm font-bold text-center transition-colors ${orderTab === "history" ? "text-foreground" : "text-muted-foreground"}`}
          >
            Order History
          </button>
        </div>
      </div>

      <motion.div
        key={orderTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 px-6 space-y-4 overflow-y-auto"
      >
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <Package className="w-16 h-16 mb-4" strokeWidth={1} />
            <p>No {orderTab} orders found.</p>
          </div>
        ) : (
          filteredOrders.map((o, index) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-3xl p-5 border border-border shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 space-y-3">
                  {o.productList.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                        <Package className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <p className="text-[10px] text-muted-foreground">{item.quantity} x ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Pickup Date/Time</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{o.pickupDate} • {o.pickupTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-accent text-lg">₹{o.totalPrice}</p>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${o.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-500' :
                    o.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-500' :
                      o.status === 'Accepted' ? 'bg-sky-500/20 text-sky-500' :
                        'bg-amber-500/20 text-amber-500'
                    }`}>
                    {o.status}
                  </span>
                  {o.rewardPointsEarned > 0 && (
                    <div className="mt-2 text-[10px] font-black text-amber-600 uppercase flex items-center justify-end gap-1">
                      <span>+{o.rewardPointsEarned}</span>
                      <span>Pts</span>
                    </div>
                  )}
                </div>
              </div>

              {o.status === "Pending" && (
                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <Button
                    onClick={() => navigate("/order", { state: { order: o, edit: true } })}
                    className="flex-1 h-12 rounded-2xl bg-accent text-accent-foreground font-bold flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Modify
                  </Button>

                  <Button
                    onClick={() => cancelOrder(o.id)}
                    variant="outline"
                    className="flex-1 h-12 rounded-2xl border-border text-destructive hover:bg-destructive/10 font-bold flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
