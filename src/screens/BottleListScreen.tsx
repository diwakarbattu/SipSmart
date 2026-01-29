import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Home, ShoppingCart, ShoppingBag, User, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../state/CartContext";
import { Bottle } from "../state/OrderContext";
import { toast } from "sonner";
import logo from "../components/logo.png";
import { bottleService } from "../services/bottleService";
import { socketService } from "../services/socketService";

export function BottleListScreen() {
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const activeTab = "home";

  useEffect(() => {
    const fetchBottles = async () => {
      setIsLoading(true);
      try {
        const data = await bottleService.getBottles();
        setBottles(data);
      } catch (err) {
        toast.error("Offline: Showing cached menu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBottles();

    // Setup Socket.io listeners
    const socket = socketService.connect('guest'); // Use actual user ID if logged in

    socket.on('product_added', (newProduct: Bottle) => {
      setBottles(prev => [newProduct, ...prev]);
      toast.info(`New Arrival: ${newProduct.name}!`);
    });

    socket.on('product_updated', (updatedProduct: Bottle) => {
      setBottles(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    });

    socket.on('product_deleted', (productId: string) => {
      setBottles(prev => prev.filter(p => p.id !== productId));
    });

    return () => {
      socket.off('product_added');
      socket.off('product_updated');
      socket.off('product_deleted');
    };
  }, []);

  const filteredBottles = bottles.filter((bottle) =>
    bottle.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const updateQuantity = (id: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change),
    }));
  };

  const handleAddToCart = (bottle: Bottle) => {
    const qty = quantities[bottle.id] || 1;
    if (bottle.stock !== undefined && bottle.stock < qty) {
      toast.error(`Only ${bottle.stock} items left in stock`);
      return;
    }
    addItem(bottle, qty);
    toast.success(`${qty} x ${bottle.name} added to cart`);
    setQuantities(prev => ({ ...prev, [bottle.id]: 0 }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-gradient-to-b from-card to-background sticky top-0 z-10 border-b border-border/50">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 p-2 flex items-center justify-center border border-accent/20 animate-pulse-subtle">
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Welcome back</p>
                <h1 className="text-xl font-black tracking-tight">Hello, Friend!</h1>
              </div>
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 bg-secondary rounded-xl hover:bg-accent/20 transition-colors hover-lift"
            >
              <ShoppingCart className="w-6 h-6" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-background"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative hover-lift">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search bottles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-2xl bg-secondary border-border focus:ring-accent"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottle List */}
      <div className="flex-1 px-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredBottles.map((bottle, index) => (
            <motion.div
              key={bottle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="bg-card rounded-3xl p-4 border border-border shadow-lg flex flex-col hover-lift"
            >
              {/* Bottle Image */}
              <div className="aspect-square rounded-2xl bg-secondary/50 mb-3 overflow-hidden relative group">
                <img
                  src={bottle.image}
                  alt={bottle.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg">
                  <p className="text-accent text-xs font-bold">₹{bottle.price}</p>
                </div>
              </div>

              {/* Bottle Info */}
              <div className="space-y-1 mb-3 flex-1">
                <h3 className="font-bold text-sm leading-tight h-10 line-clamp-2">{bottle.name}</h3>
                <p className="text-muted-foreground text-[10px]">
                  {bottle.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-3 bg-secondary/50 rounded-xl p-1.5">
                <button
                  onClick={() => updateQuantity(bottle.id.toString(), -1)}
                  className="w-8 h-8 rounded-lg bg-card flex items-center justify-center hover:bg-accent/20 transition-colors border border-border/50"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-sm">
                  {quantities[bottle.id.toString()] || 0}
                </span>
                <button
                  onClick={() => updateQuantity(bottle.id.toString(), 1)}
                  className="w-8 h-8 rounded-lg bg-card flex items-center justify-center hover:bg-accent/20 transition-colors border border-border/50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={() => handleAddToCart(bottle)}
                className="w-full h-10 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs"
                disabled={bottle.stock === 0}
              >
                {bottle.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border px-6 py-4 shadow-2xl z-20">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => navigate("/home")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "home" ? "text-accent" : "text-muted-foreground"
              }`}
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
