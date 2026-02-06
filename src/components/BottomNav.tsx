
import { useNavigate, useLocation } from "react-router";
import { Home, ShoppingCart, ShoppingBag, User } from "lucide-react";
import { useCart } from "../state/CartContext";
import { useUI } from "../state/UIContext";

export function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalItems } = useCart();
    const { toggleProfile } = useUI();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border px-6 py-4 shadow-2xl z-20">
            <div className="flex justify-around items-center max-w-md mx-auto">
                <button
                    onClick={() => navigate("/home")}
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive("/home") ? "text-accent" : "text-muted-foreground"}`}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </button>

                <button
                    onClick={() => navigate("/cart")}
                    className={`flex flex-col items-center gap-1 transition-colors relative ${isActive("/cart") ? "text-accent" : "text-muted-foreground"}`}
                >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Cart</span>
                    {totalItems > 0 && <span className="absolute top-0 right-1 w-2 h-2 bg-accent rounded-full border border-card" />}
                </button>

                <button
                    onClick={() => navigate("/orders")}
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive("/orders") ? "text-accent" : "text-muted-foreground"}`}
                >
                    <ShoppingBag className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Orders</span>
                </button>

                <button
                    onClick={toggleProfile}
                    className="flex flex-col items-center gap-1 text-muted-foreground hover:text-accent transition-colors"
                >
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Profile</span>
                </button>
            </div>
        </div>
    );
}
