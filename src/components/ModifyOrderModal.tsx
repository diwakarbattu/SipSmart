
import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface ModifyOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    onSave: (updates: any) => Promise<void>;
}

export function ModifyOrderModal({ isOpen, onClose, order, onSave }: ModifyOrderModalProps) {
    const [productList, setProductList] = useState(order.productList || []);
    const [pickupDate, setPickupDate] = useState(order.pickupDate || '');
    const [pickupTime, setPickupTime] = useState(order.pickupTime || '');
    const [address, setAddress] = useState(order.address || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setProductList(order.productList || []);
            setPickupDate(order.pickupDate || '');
            setPickupTime(order.pickupTime || '');
            setAddress(order.address || '');
        }
    }, [isOpen, order]);

    const updateQuantity = (index: number, change: number) => {
        const updated = [...productList];
        updated[index].quantity = Math.max(1, updated[index].quantity + change);
        setProductList(updated);
    };

    const totalPrice = productList.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    const handleSave = async () => {
        if (!pickupDate || !pickupTime || !address) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                productList,
                pickupDate,
                pickupTime,
                address
            });
            toast.success('Order modified successfully');
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to modify order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-background rounded-3xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h2 className="text-xl font-bold">Modify Order</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-secondary hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {/* Products */}
                            <div className="space-y-3">
                                <Label>Products</Label>
                                {productList.map((item: any, index: number) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                                        </div>
                                        <div className="flex items-center bg-secondary rounded-lg p-1 gap-2">
                                            <button
                                                onClick={() => updateQuantity(index, -1)}
                                                className="w-7 h-7 rounded-md bg-card flex items-center justify-center hover:bg-accent/20 transition-colors"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(index, 1)}
                                                className="w-7 h-7 rounded-md bg-card flex items-center justify-center hover:bg-accent/20 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="font-bold text-accent w-16 text-right">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Pickup Date & Time */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="pickupDate">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Pickup Date
                                    </Label>
                                    <Input
                                        id="pickupDate"
                                        type="date"
                                        value={pickupDate}
                                        onChange={(e) => setPickupDate(e.target.value)}
                                        className="h-10 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pickupTime">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Pickup Time
                                    </Label>
                                    <Input
                                        id="pickupTime"
                                        type="time"
                                        value={pickupTime}
                                        onChange={(e) => setPickupTime(e.target.value)}
                                        className="h-10 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address">Delivery Address</Label>
                                <textarea
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full h-20 px-4 py-3 rounded-xl bg-secondary border border-border resize-none focus:ring-2 focus:ring-accent"
                                    placeholder="Enter delivery address"
                                />
                            </div>

                            {/* Total Price */}
                            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-xl border border-accent/20">
                                <span className="font-semibold">Updated Total:</span>
                                <span className="text-2xl font-bold text-accent">₹{totalPrice}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-border flex gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 h-12 rounded-xl"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="flex-1 h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
