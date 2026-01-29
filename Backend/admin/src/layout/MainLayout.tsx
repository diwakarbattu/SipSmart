import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';

const getPageTitle = (path: string) => {
    switch (path) {
        case '/': return 'Dashboard';
        case '/users': return 'User Management';
        case '/products': return 'Product Management';
        case '/orders': return 'Order Management';
        case '/notifications': return 'Notifications';
        case '/settings': return 'Settings';
        default: return 'Admin Panel';
    }
};

export function MainLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    if (isLoginPage) return <div className="dark:bg-slate-950 min-h-screen transition-colors">{children}</div>;

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
            <Sidebar />
            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Header title={getPageTitle(location.pathname)} />
                <main className="p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
