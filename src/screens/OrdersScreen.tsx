import { useNavigate } from "react-router";
import { Package, Pencil, X, Home, ShoppingCart, ShoppingBag, User } from "lucide-react";
import { motion } from "motion/react";
import { useOrders } from "../state/OrderContext";
import { Button } from "../components/ui/button";
import { useCart } from "../state/CartContext";

export function OrdersScreen() {
  const navigate = useNavigate();
  const { orders, cancelOrder } = useOrders();
  const { totalItems } = useCart();
  const activeTab = "orders";

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-muted-foreground text-sm">
          Track your chilled deliveries
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 px-6 space-y-4 overflow-y-auto"
      >
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <Package className="w-16 h-16 mb-4" strokeWidth={1} />
            <p>No orders yet. Start shopping!</p>
          </div>
        ) : (
          orders.map((o, index) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-3xl p-5 border border-border shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center overflow-hidden">
                    <img src={o.bottle.image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      {o.bottle.name}
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{o.id}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {o.quantity} {o.quantity === 1 ? 'bottle' : 'bottles'} • Chilled
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-accent text-lg">₹{o.totalPrice}</p>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${o.status === 'delivered' ? 'bg-success/20 text-success' :
                      o.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                        'bg-yellow-500/20 text-yellow-500'
                    }`}>
                    {o.status}
                  </span>
                </div>
              </div>

              {o.status === "pending" && (
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
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border px-6 py-4 shadow-2xl z-20">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => navigate("/home")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-accent transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-accent transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="text-[10px] font-medium">Cart</span>
            {totalItems > 0 && <span className="absolute top-0 right-1 w-2 h-2 bg-accent rounded-full border border-card" />}
          </button>
          <button
            onClick={() => navigate("/orders")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "orders" ? "text-accent" : "text-muted-foreground"
              }`}
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-[10px] font-medium">Orders</span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-accent transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
