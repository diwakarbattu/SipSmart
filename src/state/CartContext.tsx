import React, { createContext, useContext, useState, useMemo } from "react";
import { Bottle } from "./OrderContext";

export interface CartItem {
  bottle: Bottle;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (bottle: Bottle, quantity: number) => void;
  updateQuantity: (bottleId: number, quantity: number) => void;
  removeItem: (bottleId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (bottle: Bottle, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.bottle.id === bottle.id);
      if (existing) {
        return prev.map((i) =>
          i.bottle.id === bottle.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { bottle, quantity }];
    });
  };

  const updateQuantity = (bottleId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(bottleId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.bottle.id === bottleId ? { ...i, quantity } : i))
    );
  };

  const removeItem = (bottleId: number) => {
    setItems((prev) => prev.filter((i) => i.bottle.id !== bottleId));
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.bottle.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
