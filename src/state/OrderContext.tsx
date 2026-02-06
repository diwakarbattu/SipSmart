import React, { createContext, useContext, useState, useEffect } from "react";
import { orderService } from "../services/orderService";
import { socketService } from "../services/socketService";
import { authService } from "../services/authService";

export type OrderStatus = "Pending" | "Accepted" | "Delivered" | "Cancelled";

export interface Bottle {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  type?: string;
  size?: string;
  discount?: number;
  stock?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  productList: OrderItem[];
  totalPrice: number;
  address: string;
  pickupDate: string;
  pickupTime: string;
  status: OrderStatus;
  rewardPointsEarned: number;
  createdAt: string;
}

interface OrdersContextValue {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  addOrder: (o: any) => Promise<string>;
  cancelOrder: (id: string) => Promise<void>;
  getOrder: (id: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const user = authService.getCurrentUser();
    if (user) {
      const socket = socketService.connect(user.id);

      socket.on('order_status_updated', (updatedOrder: Order) => {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      });

      return () => {
        socket.off('order_status_updated');
      };
    }
  }, []);

  const addOrder = async (orderData: any) => {
    setIsLoading(true);
    try {
      const newOrder = await orderService.createOrder(orderData);
      setOrders((s) => [newOrder, ...s]);
      return newOrder.id;
    } catch (err: any) {
      setError(err.message || "Failed to create order");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      await orderService.updateOrderStatus(id, "Cancelled");
      setOrders((s) =>
        s.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o)),
      );
    } catch (err: any) {
      setError(err.message || "Failed to cancel order");
    }
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        isLoading,
        error,
        addOrder,
        cancelOrder,
        getOrder,
        refreshOrders: fetchOrders
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
};
