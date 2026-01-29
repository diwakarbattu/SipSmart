import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useOrders } from '../state/OrderContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { motion } from 'motion/react';

export function OrderFormScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bottle, quantity: initialQuantity, order, edit } = location.state || {};
  const { cancelOrder } = useOrders();

  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!bottle && !order) {
      navigate('/home');
    }
    if (order) {
      setQuantity(order.quantity || 1);
      setName(order.name || '');
      setPhone(order.phone || '');
    }
  }, [bottle, order, navigate]);

  if (!bottle && !order) return null;

  const activeBottle = bottle || order?.bottle;
  const totalPrice = (activeBottle?.price || 0) * quantity;

  const handleProceed = () => {
    if (!name || !phone) {
      alert('Please fill in all fields');
      return;
    }

    const payload = { bottle: activeBottle, quantity, name, phone, totalPrice };
    if (edit && order?.id) {
      navigate('/address', { state: { ...payload, edit: true, orderId: order.id } });
      return;
    }
    navigate('/address', { state: payload });
  };

  const handleCancelOrder = () => {
    if (order?.id) {
      cancelOrder(order.id);
      navigate('/orders');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="px-6 pt-8 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-card rounded-3xl p-5 border border-border shadow-lg">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-2xl bg-secondary/50 overflow-hidden flex-shrink-0">
              <img src={activeBottle.image} alt={activeBottle.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{activeBottle.name}</h3>
              <p className="text-muted-foreground text-sm mb-2">{activeBottle.description}</p>
              <p className="text-accent font-bold text-lg">₹{activeBottle.price}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="space-y-2">
          <Label>Quantity</Label>
          <div className="flex items-center gap-4 bg-card rounded-2xl p-4 border border-border">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"><Minus className="w-5 h-5" /></button>
            <div className="flex-1 text-center"><span className="text-2xl font-bold">{quantity}</span></div>
            <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"><Plus className="w-5 h-5" /></button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="h-14 rounded-2xl bg-card border-border" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-14 rounded-2xl bg-card border-border" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="bg-gradient-to-r from-accent/20 to-success/20 rounded-2xl p-5 border border-accent/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-accent">₹{totalPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">{quantity} × ₹{activeBottle.price}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-6 bg-card border-t border-border">
        {edit && order ? (
          <div className="space-y-3">
            <Button onClick={handleProceed} className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">Proceed to Address</Button>
            <Button onClick={handleCancelOrder} variant="outline" className="w-full h-14 rounded-2xl border-border">Cancel Order</Button>
          </div>
        ) : (
          <Button onClick={handleProceed} className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">Proceed to Address</Button>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useOrders } from '../state/OrderContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { motion } from 'motion/react';

export function OrderFormScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bottle, quantity: initialQuantity, order, edit } = location.state || {};
  const { cancelOrder } = useOrders();

  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!bottle && !order) {
      navigate('/home');
    }
    if (order) {
      setQuantity(order.quantity || 1);
      setName(order.name || '');
      setPhone(order.phone || '');
    }
  }, [bottle, order, navigate]);

  if (!bottle && !order) return null;

  const activeBottle = bottle || order?.bottle;
  const totalPrice = (activeBottle?.price || 0) * quantity;

  const handleProceed = () => {
    if (!name || !phone) {
      alert('Please fill in all fields');
      return;
    }

    const payload = { bottle: activeBottle, quantity, name, phone, totalPrice };
    if (edit && order?.id) {
      navigate('/address', { state: { ...payload, edit: true, orderId: order.id } });
      return;
    }
    navigate('/address', { state: payload });
  };

  const handleCancelOrder = () => {
    if (order?.id) {
      cancelOrder(order.id);
      navigate('/orders');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="px-6 pt-8 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-card rounded-3xl p-5 border border-border shadow-lg">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-2xl bg-secondary/50 overflow-hidden flex-shrink-0">
              <img src={activeBottle.image} alt={activeBottle.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{activeBottle.name}</h3>
              <p className="text-muted-foreground text-sm mb-2">{activeBottle.description}</p>
              <p className="text-accent font-bold text-lg">₹{activeBottle.price}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="space-y-2">
          <Label>Quantity</Label>
          <div className="flex items-center gap-4 bg-card rounded-2xl p-4 border border-border">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"><Minus className="w-5 h-5" /></button>
            <div className="flex-1 text-center"><span className="text-2xl font-bold">{quantity}</span></div>
            <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"><Plus className="w-5 h-5" /></button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="h-14 rounded-2xl bg-card border-border" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-14 rounded-2xl bg-card border-border" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="bg-gradient-to-r from-accent/20 to-success/20 rounded-2xl p-5 border border-accent/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-accent">₹{totalPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">{quantity} × ₹{activeBottle.price}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-6 bg-card border-t border-border">
        {edit && order ? (
          <div className="space-y-3">
            <Button onClick={handleProceed} className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">Proceed to Address</Button>
            <Button onClick={handleCancelOrder} variant="outline" className="w-full h-14 rounded-2xl border-border">Cancel Order</Button>
          </div>
        ) : (
          <Button onClick={handleProceed} className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">Proceed to Address</Button>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useOrders } from '../state/OrderContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { motion } from "motion/react";

export function OrderFormScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    bottle,
    quantity: initialQuantity,
    order,
    edit,
  } = location.state || {};
  const { cancelOrder } = useOrders();

  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!bottle && !order) {
      navigate("/home");
    }
    // if editing an existing order, populate fields
    if (order) {
      setQuantity(order.quantity || 1);
      setName(order.name || "");
      setPhone(order.phone || "");
    }
  }, [bottle, order, navigate]);

  if (!bottle) return null;

  const activeBottle = bottle || order?.bottle;
  const totalPrice = (activeBottle?.price || 0) * quantity;

  const handleProceed = () => {
    if (!name || !phone) {
      alert("Please fill in all fields");
      return;
    }

    navigate("/address", { state: payload });
  };

  const handleCancelOrder = () => {
    if (order?.id) {
      cancelOrder(order.id);
      navigate("/orders");
    }
  };
    const payload = {
      bottle: activeBottle,
      quantity,
      name,
      phone,
      totalPrice,
    };

    // If editing, forward edit flag and orderId
    if (edit && order?.id) {
      navigate("/address", {
        state: { ...payload, edit: true, orderId: order.id },
      });
      return;
    }

    navigate("/address", { state: payload });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Selected Bottle Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-3xl p-5 border border-border shadow-lg"
        >
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-2xl bg-secondary/50 overflow-hidden flex-shrink-0">
              <img
                src={bottle.image}
                alt={bottle.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{bottle.name}</h3>
              <p className="text-muted-foreground text-sm mb-2">
                {bottle.description}
              </p>
              <p className="text-accent font-bold text-lg">₹{bottle.price}</p>
            </div>
          </div>
        </motion.div>

        {/* Quantity Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-2"
        >
          <Label>Quantity</Label>
          <div className="flex items-center gap-4 bg-card rounded-2xl p-4 border border-border">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold">{quantity}</span>
            </div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Customer Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 rounded-2xl bg-card border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-14 rounded-2xl bg-card border-border"
            />
          </div>
        </motion.div>

        {/* Total Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-gradient-to-r from-accent/20 to-success/20 rounded-2xl p-5 border border-accent/30"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-accent">₹{totalPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">
                {quantity} × ₹{bottle.price}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 py-6 bg-card border-t border-border">
        <Button
          onClick={handleProceed}
          className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
        >
          Proceed to Address
        </Button>
      </div>
    </div>
  );
}
