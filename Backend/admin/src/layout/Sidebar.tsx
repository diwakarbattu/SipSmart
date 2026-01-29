import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Beer,
    ShoppingBag,
    Bell,
    Settings,
    LogOut
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Beer, label: 'Products', path: '/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { notifications } = useData();
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <aside className="w-64 bg-slate-900 dark:bg-slate-950 h-screen fixed left-0 top-0 text-slate-300 flex flex-col shadow-xl z-50 transition-colors">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 rotate-3">
                    <Beer className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">MT Beer <span className="text-amber-500">Admin</span></h1>
            </div>

            <nav className="flex-1 mt-6 px-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const isNotifications = item.label === 'Notifications';

                        return (
                            <li key={item.path}>
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/10"
                                            : "hover:bg-slate-800 dark:hover:bg-slate-900 hover:text-white"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5",
                                        isActive ? "text-white" : "text-slate-400 group-hover:text-amber-500"
                                    )} />
                                    <span className="font-medium">{item.label}</span>

                                    {isNotifications && unreadCount > 0 && (
                                        <span className="absolute right-4 w-5 h-5 bg-amber-500 group-hover:bg-white group-hover:text-amber-500 text-white text-[10px] font-black rounded-lg flex items-center justify-center transition-colors">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-800 dark:border-slate-900">
                <button
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-900 text-slate-400 hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
