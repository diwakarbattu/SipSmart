import { Bell, Search, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

export function Header({ title }: { title: string }) {
    const { theme, toggleTheme } = useTheme();
    const { notifications } = useData();
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>

            <div className="flex items-center gap-6">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500" />
                    <input
                        type="text"
                        placeholder="Search everything..."
                        className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 w-64 transition-all"
                    />
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400 group"
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? (
                        <Moon className="w-5 h-5 group-hover:text-indigo-500" />
                    ) : (
                        <Sun className="w-5 h-5 group-hover:text-amber-500" />
                    )}
                </button>

                <button className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-amber-500" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 text-[10px] font-black text-white flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Admin Panel</p>
                        <p className="text-xs text-slate-500">Super Admin</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800 cursor-pointer overflow-hidden shadow-sm">
                        <User className="w-6 h-6 text-slate-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}
