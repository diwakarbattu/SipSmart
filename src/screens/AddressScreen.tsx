import { useState } from "react";
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

export function AddressScreen() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [hostelName, setHostelName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [landmark, setLandmark] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  if (items.length === 0) {
    navigate("/home");
    return null;
  }

  const handleConfirmOrder = () => {
    if (!hostelName || !roomNumber || !deliveryTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare orders (in a real app, one order might contain multiple items)
    // Here, we'll follow the existing Order structure which seems to be one bottle per order object, 
    // or we can just mock the first one for the success screen summary.

    // For simplicity in this prototype, let's just record the order history for the whole cart.
    // If the Order type only supports one bottle, we'll pick the first one for the record, 
    // or we can update the Order type in OrderContext.

    // Let's assume we want to show the order placed successfully.
    const firstItem = items[0];
    const orderId = addOrder({
      bottle: firstItem.bottle,
      quantity: firstItem.quantity,
      name: "User", // Mock name
      phone: "1234567890", // Mock phone
      hostel: hostelName,
      room: roomNumber,
      landmark,
      deliveryTime,
      totalPrice,
    });

    toast.success("Order Placed Successfully!");
    clearCart();
    navigate("/success", {
      state: {
        orderId,
        items,
        totalPrice,
        deliveryTime: deliveryTime === '30min' ? '30 mins' : deliveryTime.replace('hour', ' hr').replace('hours', ' hrs')
      },
    });
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
            <Label htmlFor="hostel" className="flex items-center gap-2 text-muted-foreground mb-1">
              <Home className="w-4 h-4" />
              Hostel Name
            </Label>
            <Input
              id="hostel"
              type="text"
              placeholder="e.g. Boys Hostel 1"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
              className="h-14 rounded-2xl bg-card border-border focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room" className="text-muted-foreground mb-1">Room Number</Label>
              <Input
                id="room"
                type="text"
                placeholder="e.g. 302"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="h-14 rounded-2xl bg-card border-border focus:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                Delivery
              </Label>
              <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                <SelectTrigger className="h-14 rounded-2xl bg-card border-border">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="As soon as possible">As soon as possible</SelectItem>
                  <SelectItem value="30min">30 Mins</SelectItem>
                  <SelectItem value="1hour">1 Hour</SelectItem>
                  <SelectItem value="2hours">2 Hours</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="landmark" className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="w-4 h-4" />
              Landmark (Optional)
            </Label>
            <Input
              id="landmark"
              type="text"
              placeholder="e.g. Near Canteen"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="h-14 rounded-2xl bg-card border-border focus:ring-accent"
            />
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
          className="w-full h-16 rounded-2xl bg-success hover:bg-success/90 text-success-foreground shadow-2xl shadow-success/20 text-lg font-bold"
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
}
