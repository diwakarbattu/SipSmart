import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Product, Order, Notification, Offer } from '../types';
import { toast } from 'sonner';
import { userService } from '../services/userService';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { offerService } from '../services/offerService';
import { io } from 'socket.io-client';

interface DataContextType {
    users: User[];
    products: Product[];
    orders: Order[];
    offers: Offer[];
    notifications: Notification[];
    isLoading: boolean;

    addUser: (user: any) => Promise<void>;
    updateUser: (id: string, user: any) => Promise<void>;
    approveUser: (id: string, isApproved: boolean) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;

    addProduct: (product: any) => Promise<void>;
    updateProduct: (id: string, product: any) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;

    addOffer: (offer: any) => Promise<void>;
    updateOffer: (id: string, offer: any) => Promise<void>;
    deleteOffer: (id: string) => Promise<void>;

    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    refreshAll: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const [u, p, o, off] = await Promise.all([
                userService.getUsers(),
                productService.getProducts(),
                orderService.getOrders(),
                offerService.getOffers()
            ]);
            setUsers(u);
            setProducts(p);
            setOrders(o);
            setOffers(off);
        } catch (err: any) {
            console.error('Failed to load dashboard data:', err);
            toast.error('Data Sync Failure', {
                description: err.response?.data?.message || err.message || 'Could not retrieve information'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const socket = io(SOCKET_URL);

        socket.on('new_order', ({ order, notification }) => {
            setOrders(prev => [order, ...prev]);
            setNotifications(prev => [notification, ...prev]);
            toast.info(`New Order from ${order.userName}`, {
                description: `Product: ${order.productName || 'Order Items'}`,
                duration: 5000,
            });
            // Optional: Play notification sound
            new Audio('/notification.mp3').play().catch(() => { });
        });

        socket.on('product_added', (p) => setProducts(prev => [p, ...prev]));
        socket.on('product_updated', (p) => setProducts(prev => prev.map(old => old.id === p.id ? p : old)));
        socket.on('product_deleted', (id) => setProducts(prev => prev.filter(p => p.id !== id)));

        socket.on('user_registered', (user) => {
            setUsers(prev => [user, ...prev]);
            toast.info(`New User Registration: ${user.name}`);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const addUser = async (data: any) => {
        try {
            await userService.updateUser('new', data);
            fetchData();
            toast.success('User registered');
        } catch (err) { toast.error('Creation failed'); }
    };

    const updateUser = async (id: string, data: any) => {
        try {
            await userService.updateUser(id, data);
            setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
            toast.success('User updated');
        } catch (err) { toast.error('Update failed'); }
    };

    const approveUser = async (id: string, isApproved: boolean) => {
        try {
            const updated = await userService.approveUser(id, isApproved);
            setUsers(prev => prev.map(u => u.id === id ? updated : u));
            toast.success(isApproved ? 'User approved' : 'User rejected');
        } catch (err) { toast.error('Approval update failed'); }
    };

    const deleteUser = async (id: string) => {
        try {
            await userService.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            toast.success('User deleted');
        } catch (err) { toast.error('Deletion failed'); }
    };

    const addProduct = async (data: any) => {
        try {
            const p = await productService.addProduct(data);
            setProducts(prev => [p, ...prev]);
            toast.success('Product added');
        } catch (err) { toast.error('Failed to add product'); }
    };

    const updateProduct = async (id: string, data: any) => {
        try {
            const p = await productService.updateProduct(id, data);
            setProducts(prev => prev.map(old => old.id === id ? p : old));
            toast.success('Product updated');
        } catch (err) { toast.error('Update failed'); }
    };

    const deleteProduct = async (id: string) => {
        try {
            await productService.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success('Product removed');
        } catch (err) { toast.error('Deletion failed'); }
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        try {
            const o = await orderService.updateOrderStatus(id, status);
            setOrders(prev => prev.map(old => old.id === id ? o : old));
            toast.success(`Order ${status}`);
        } catch (err) { toast.error('Status update failed'); }
    };

    const deleteOrder = async (id: string) => {
        try {
            await orderService.deleteOrder(id);
            setOrders(prev => prev.filter(o => o.id !== id));
            toast.success('Order deleted');
        } catch (err) { toast.error('Deletion failed'); }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast('All notifications marked as read');
    };

    const addOffer = async (data: any) => {
        try {
            const o = await offerService.addOffer(data);
            setOffers(prev => [o, ...prev]);
            toast.success('Offer created');
        } catch (err) { toast.error('Failed to create offer'); }
    };

    const updateOffer = async (id: string, data: any) => {
        try {
            const o = await offerService.updateOffer(id, data);
            setOffers(prev => prev.map(old => old.id === id ? o : old));
            toast.success('Offer updated');
        } catch (err) { toast.error('Update failed'); }
    };

    const deleteOffer = async (id: string) => {
        try {
            await offerService.deleteOffer(id);
            setOffers(prev => prev.filter(o => o.id !== id));
            toast.success('Offer deleted');
        } catch (err) { toast.error('Deletion failed'); }
    };

    return (
        <DataContext.Provider value={{
            users, products, orders, offers, notifications, isLoading,
            addUser, updateUser, approveUser, deleteUser,
            addProduct, updateProduct, deleteProduct,
            updateOrderStatus, deleteOrder,
            addOffer, updateOffer, deleteOffer,
            markAsRead, markAllAsRead, refreshAll: fetchData
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within DataProvider');
    return context;
}
