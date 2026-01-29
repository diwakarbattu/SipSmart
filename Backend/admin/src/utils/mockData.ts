import type { User, Product, Order, Notification } from '../types';

export const mockUsers: User[] = [
    { id: '1', name: 'Amit Kumar', mobile: '+91 98765 43210', email: 'amit@example.com', address: 'Room 302, Boys Hostel A', createdAt: '2026-01-20T10:00:00Z' },
    { id: '2', name: 'Rahul Singh', mobile: '+91 88765 43211', email: 'rahul@example.com', address: 'Room 101, Boys Hostel B', createdAt: '2026-01-21T11:30:00Z' },
    { id: '3', name: 'Sreya Verma', mobile: '+91 78765 43212', email: 'sreya@example.com', address: 'Room 205, Girls Hostel C', createdAt: '2026-01-22T09:15:00Z' },
];

export const mockProducts: Product[] = [
    { id: '1', name: 'Premium Lager', price: 150, stock: 50, description: '650ml chilled lager', image: 'https://images.unsplash.com/photo-1746422029410-851a7577979a?w=400' },
    { id: '2', name: 'Classic Gold', price: 120, stock: 30, description: '500ml classic gold', image: 'https://images.unsplash.com/photo-1678120443929-41537c681e75?w=400' },
    { id: '3', name: 'Craft IPA', price: 200, stock: 15, description: '330ml craft IPA', image: 'https://images.unsplash.com/photo-1627060063038-85a707de7613?w=400' },
];

export const mockOrders: Order[] = [
    { id: 'ORD-123', userName: 'Amit Kumar', mobile: '+91 98765 43210', productName: 'Premium Lager', quantity: 2, totalPrice: 300, address: 'Room 302, Hostel A', createdAt: '2026-01-28T10:00:00Z', status: 'In Progress' },
    { id: 'ORD-124', userName: 'Rahul Singh', mobile: '+91 88765 43211', productName: 'Classic Gold', quantity: 1, totalPrice: 120, address: 'Room 101, Hostel B', createdAt: '2026-01-28T11:15:00Z', status: 'Completed' },
    { id: 'ORD-125', userName: 'Sreya Verma', mobile: '+91 78765 43212', productName: 'Craft IPA', quantity: 3, totalPrice: 600, address: 'Room 205, Hostel C', createdAt: '2026-01-28T12:05:00Z', status: 'Cancelled' },
];

export const mockNotifications: Notification[] = [
    { id: '1', userName: 'Amit Kumar', productName: 'Premium Lager', createdAt: '2026-01-28T10:00:00Z', isRead: false },
    { id: '2', userName: 'Rahul Singh', productName: 'Classic Gold', createdAt: '2026-01-28T11:15:00Z', isRead: true },
];
