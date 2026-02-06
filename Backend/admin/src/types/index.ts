export type OrderStatus = 'Pending' | 'Accepted' | 'Delivered' | 'Cancelled';

export interface User {
    id: string;
    name: string;
    mobile: string;
    email: string;
    address: string;
    isApproved: boolean;
    rewardPoints: number;
    profilePic?: string;
    createdAt: string;
}

export interface Offer {
    id: string;
    discountType: 'Percentage' | 'Flat';
    discountValue: number;
    isActive: boolean;
    validFrom: string;
    validTo: string;
}

export interface Product {
    id: string;
    image: string;
    name: string;
    price: number;
    stock: number;
    type?: string;
    size?: string;
    discount?: number;
    description: string;
}

export interface Order {
    id: string;
    userName: string;
    mobile: string;
    productList: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    totalPrice: number;
    address: string;
    pickupDate?: string;
    pickupTime?: string;
    rewardPointsEarned?: number;
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
