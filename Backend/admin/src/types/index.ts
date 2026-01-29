export type OrderStatus = 'In Progress' | 'Completed' | 'Cancelled';

export interface User {
    id: string;
    name: string;
    mobile: string;
    email: string;
    address: string;
    createdAt: string;
}

export interface Product {
    id: string;
    image: string;
    name: string;
    price: number;
    stock: number;
    description: string;
}

export interface Order {
    id: string;
    userName: string;
    mobile: string;
    productName: string;
    quantity: number;
    totalPrice: number;
    address: string;
    createdAt: string;
    status: OrderStatus;
}

export interface Notification {
    id: string;
    userName: string;
    productName: string;
    createdAt: string;
    isRead: boolean;
}
