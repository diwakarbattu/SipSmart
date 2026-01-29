import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, LogOut, Edit3, Home, ShoppingCart, ShoppingBag, MapPin, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";
import { useOrders } from "../state/OrderContext";
import { useCart } from "../state/CartContext";
import { userService, UserProfile } from "../services/userService";

export function ProfileScreen() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { orders } = useOrders();
  const activeTab = "profile";

  const [user, setUser] = useState<UserProfile>({
    name: "Amit Kumar",
    phone: "+91 98765 43210",
    hostel: "Boys Hostel A",
    room: "302"
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await userService.getProfile();
        if (data) {
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch profile, using local data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      {/* Header Profile Section */}
      <div className="px-6 pt-4 py-4 bg-gradient-to-b from-card to-background">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent to-yellow-500 p-0.5 shadow-xl animate-float">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                <User className="w-8 h-8 text-accent" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">{user.name}</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Prime Member</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/profile/edit")}
            className="bg-accent/10 text-accent p-3 rounded-2xl shadow-sm border border-accent/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="bg-secondary/30 p-2 flex items-center hover-lift">
          <div className="bg-accent/10 p-2">
            <Phone className="w-4 h-4 text-accent" />
          </div>
          <div>
            {/* <p className="text-[10px] text-muted-foreground font-bold uppercase">Phone</p> */}
            <p className="text-xs font-bold">{user.phone}</p>
          </div>
        </div>
        <div className="bg-secondary/30 p-1 flex items-center hover-lift">
          <div className="bg-accent/10 p-2 ">
            <MapPin className="w-4 h-4 text-accent" />
          </div>
          <div>
            {/* <p className="text-[10px] text-muted-foreground font-bold uppercase">Address</p> */}
            <p className="text-xs font-bold">Room {user.room}, {user.hostel}</p>
          </div>
        </div>
      </motion.div>
      <div className="flex-1 px-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/orders")}
            className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-colors hover:bg-secondary/30"
          >
            <div className="bg-accent/10 p-3 rounded-2xl">
              <ShoppingBag className="w-6 h-6 text-accent" />
            </div>
            <p className="text-2xl font-black">{orders.length}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Orders</p>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/cart")}
            className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-colors hover:bg-secondary/30"
          >
            <div className="bg-yellow-500/10 p-3 rounded-2xl">
              <ShoppingCart className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-black">{totalItems}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">In Cart</p>
          </motion.div>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            onClick={() => navigate("/profile/edit")}
            variant="secondary"
            className="w-full h-14 rounded-2xl bg-card border border-border hover:bg-secondary transition-all font-bold"
          >
            Settings & Privacy
          </Button>

          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="w-full h-14 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10 font-bold"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

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
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-accent transition-colors"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-[10px] font-medium">Orders</span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "profile" ? "text-accent" : "text-muted-foreground"
              }`}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div >
  );
}
