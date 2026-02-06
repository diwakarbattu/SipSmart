import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, Home, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { motion } from "motion/react";
import { useOrders } from "../state/OrderContext";
import { useCart } from "../state/CartContext";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

export function AddressScreen() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [address, setAddress] = useState(() => {
    const user = authService.getCurrentUser();
    return user?.address || "";
  });
  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [isLoading, setIsLoading] = useState(false);

  if (items.length === 0) {
    navigate("/home");
    return null;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          const profile = await userService.getProfile(user.id);
          setAddress(profile.address || "");
        }
      } catch (err) {
        console.error("Failed to fetch profile address", err);
      }
    };
    fetchProfile();
  }, []);

  const handleConfirmOrder = async () => {
    if (!address || !pickupDate || !pickupTime) {
      toast.error("Please fill in all address and pickup details");
      return;
    }

    setIsLoading(true);
    try {
      const user = authService.getCurrentUser();
      const orderData = {
        userName: user?.name || "Guest",
        mobile: user?.mobile || "N/A",
        productList: items.map(item => ({
          productId: item.bottle.id,
          name: item.bottle.name,
          price: item.bottle.price,
          quantity: item.quantity
        })),
        totalPrice,
        address,
        pickupDate,
        pickupTime
      };

      const orderId = await addOrder(orderData);

      toast.success("Order Placed Successfully!");
      clearCart();
      navigate("/success", {
        state: {
          orderId,
          items,
          totalPrice,
          pickupDate,
          pickupTime
        },
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Delivery Address</h1>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">
        {/* Address Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="w-4 h-4" />
              Delivery Address
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="e.g. Landmark, Hostel name, Room"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-14 rounded-2xl bg-card border-border focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-muted-foreground mb-1">Pickup Date</Label>
              <Input
                id="date"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="h-14 rounded-2xl bg-card border-border focus:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                Pickup Time
              </Label>
              <Input
                id="time"
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="h-14 rounded-2xl bg-card border-border focus:ring-accent"
              />
            </div>
          </div>
        </motion.div>

        {/* Order Summary Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl p-5 border border-dashed border-border flex justify-between items-center"
        >
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Payable Amount</p>
            <p className="text-2xl font-black text-accent">₹{totalPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Cash on Delivery</p>
            <p className="text-sm font-bold">{items.length} {items.length === 1 ? 'Product' : 'Products'}</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 py-8 bg-card border-t border-border">
        <Button
          onClick={handleConfirmOrder}
          disabled={isLoading}
          className="w-full h-16 rounded-2xl bg-success hover:bg-success/90 text-success-foreground shadow-2xl shadow-success/20 text-lg font-bold transition-all active:scale-95"
        >
          {isLoading ? "Placing Order..." : "Confirm Order"}
        </Button>
      </div>
    </div>
  );
}
