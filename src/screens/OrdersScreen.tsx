import { useState } from "react";
import { useNavigate } from "react-router";
import { Package, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useOrders } from "../state/OrderContext";
import { Button } from "../components/ui/button";
import { useCart } from "../state/CartContext";
import { BottomNav } from "../components/BottomNav";
import { toast } from "sonner";
import { ModifyOrderModal } from "../components/ModifyOrderModal";
import { orderService } from "../services/orderService";

export function OrdersScreen() {
  const navigate = useNavigate();
  const { orders, cancelOrder, updateOrder } = useOrders();
  const { totalItems } = useCart();
  const [orderTab, setOrderTab] = useState<"active" | "history">("active");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [modifyingOrder, setModifyingOrder] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState<any>(null);

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

              {/* Action Buttons - Status Based */}
              {o.status === "Pending" && (
                <div className="flex gap-2 pt-3 border-t border-border/50">
                  <Button
                    onClick={() => setModifyingOrder(o)}
                    className="flex-1 h-8 rounded-xl bg-accent text-accent-foreground font-semibold flex items-center justify-center gap-1.5 text-xs hover:bg-accent/90 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Modify
                  </Button>

                  <Button
                    onClick={() => setShowCancelDialog(o)}
                    disabled={cancellingOrderId === o.id}
                    variant="outline"
                    className="flex-1 h-8 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 font-semibold flex items-center justify-center gap-1.5 text-xs transition-all disabled:opacity-50"
                  >
                    {cancellingOrderId === o.id ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <X className="w-3.5 h-3.5" />
                        </motion.div>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Accepted orders - Cancel only with warning */}
              {o.status === "Accepted" && (
                <div className="pt-3 border-t border-border/50">
                  <Button
                    onClick={() => setShowCancelDialog(o)}
                    disabled={cancellingOrderId === o.id}
                    variant="outline"
                    className="w-full h-8 rounded-xl border-amber-500/30 text-amber-600 hover:bg-amber-500/10 font-semibold flex items-center justify-center gap-1.5 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                    Request Cancellation
                  </Button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>


      {/* Bottom Navigation */}
      <BottomNav />

      {/* Modify Order Modal */}
      {modifyingOrder && (
        <ModifyOrderModal
          isOpen={!!modifyingOrder}
          onClose={() => setModifyingOrder(null)}
          order={modifyingOrder}
          onSave={async (updates) => {
            await updateOrder(modifyingOrder.id, updates);
            setModifyingOrder(null);
          }}
        />
      )}

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <CancelOrderDialog
          order={showCancelDialog}
          onClose={() => setShowCancelDialog(null)}
          onConfirm={async (cancelReason) => {
            setCancellingOrderId(showCancelDialog.id);
            try {
              await cancelOrder(showCancelDialog.id, cancelReason);
              toast.success("Order cancelled successfully");
              setShowCancelDialog(null);
            } catch (error: any) {
              toast.error(error.response?.data?.message || "Failed to cancel order");
            } finally {
              setTimeout(() => setCancellingOrderId(null), 500);
            }
          }}
        />
      )}
    </div>
  );
}

// Cancel Order Dialog Component
function CancelOrderDialog({ order, onClose, onConfirm }: { order: any, onClose: () => void, onConfirm: (reason: string) => void }) {
  const [cancelReason, setCancelReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");

  const reasons = [
    "Changed my mind",
    "Found better price elsewhere",
    "Ordered by mistake",
    "Delivery time too long",
    "Other"
  ];

  const handleConfirm = () => {
    const reason = selectedReason === "Other" ? cancelReason : selectedReason;
    onConfirm(reason);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Cancel Order</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary hover:bg-destructive/10 hover:text-destructive flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>

          {order.status === "Accepted" && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-xs text-amber-600 font-semibold">⚠️ This order has been accepted by the admin. Cancellation will require admin approval.</p>
            </div>
          )}

          <div className="p-4 bg-secondary/30 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Total:</span>
              <span className="font-bold">₹{order.totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items:</span>
              <span className="font-bold">{order.productList.length}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Reason for cancellation (optional):</label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-secondary border border-border"
            >
              <option value="">Select a reason...</option>
              {reasons.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {selectedReason === "Other" && (
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please specify..."
                className="w-full h-20 px-3 py-2 rounded-xl bg-secondary border border-border resize-none"
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl"
            >
              Keep Order
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 h-10 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold"
            >
              Yes, Cancel
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
