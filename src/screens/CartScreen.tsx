import { useNavigate } from 'react-router';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../state/CartContext';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export function CartScreen() {
    const navigate = useNavigate();
    const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

    const handleProceed = () => {
        if (items.length === 0) return;
        navigate('/order');
    };

    return (
        <div className="min-h-screen flex flex-col bg-background pb-24">
            {/* Header */}
            <div className="px-6 pt-8 pb-4 bg-card border-b border-border sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold">My Cart</h1>
                </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="bg-secondary p-8 rounded-full">
                            <ShoppingCart className="w-16 h-16 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                            <p className="text-muted-foreground">Add some bottles to your cart to start ordering!</p>
                        </div>
                        <Button
                            onClick={() => navigate('/home')}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl h-12 px-8"
                        >
                            Browse Bottles
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={item.bottle.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-card rounded-3xl p-4 border border-border shadow-sm flex gap-4"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-secondary/50 overflow-hidden flex-shrink-0" style={{ width: "80px", height: "80px", padding: "5px", background: "rgba(255, 255, 255, 1)" }}>
                                    <img
                                        src={item.bottle.image}
                                        alt={item.bottle.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{item.bottle.name}</h3>
                                            <div className="flex flex-wrap gap-1">
                                                {item.bottle.size && <span className="text-[10px] font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded">{item.bottle.size}</span>}
                                                <p className="text-muted-foreground text-xs line-clamp-1">{item.bottle.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.bottle.id)}
                                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-accent font-bold">₹{item.bottle.price}</p>

                                        <div className="flex items-center gap-3 bg-secondary rounded-xl p-1">
                                            <button
                                                onClick={() => updateQuantity(item.bottle.id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-lg bg-card flex items-center justify-center hover:bg-accent/20 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-bold min-w-[20px] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.bottle.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-lg bg-card flex items-center justify-center hover:bg-accent/20 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary & Proceed */}
            {items.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-6 shadow-2xl space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <div>
                            <p className="text-muted-foreground text-sm">Total Amount</p>
                            <p className="text-2xl font-bold text-accent">₹{totalPrice}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-muted-foreground text-sm">{totalItems} Items</p>
                        </div>
                    </div>

                    <Button
                        onClick={handleProceed}
                        className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg font-bold text-lg"
                    >
                        Proceed to Order
                    </Button>
                </div>
            )}
        </div>
    );
}
