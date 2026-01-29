import { Check, Clock, ShoppingCart } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';

export function NotificationsPage() {
    const { notifications, markAsRead, markAllAsRead } = useData();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">New Orders alerts</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Manage your incoming order notifications</p>
                </div>
                <button
                    onClick={markAllAsRead}
                    className="text-sm font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-6 py-3 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all"
                >
                    Mark All Read
                </button>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? notifications.map((notif, index) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-[2rem] border flex items-center justify-between group hover:shadow-lg transition-all ${!notif.isRead
                            ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-500/30'
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/50'
                            }`}
                    >
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative transition-colors ${!notif.isRead ? 'bg-amber-500' : 'bg-slate-100 dark:bg-slate-800'
                                }`}>
                                <ShoppingCart className={`w-6 h-6 ${!notif.isRead ? 'text-white' : 'text-slate-400'}`} />
                                {!notif.isRead && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className={`font-bold transition-colors ${!notif.isRead ? 'text-slate-900 dark:text-white text-lg' : 'text-slate-600 dark:text-slate-400'}`}>
                                    New order from {notif.userName}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500 font-medium">
                                    <span>{notif.productName}</span>
                                    <span className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!notif.isRead && (
                            <button
                                onClick={() => markAsRead(notif.id)}
                                className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                            >
                                <Check className="w-5 h-5" />
                            </button>
                        )}
                    </motion.div>
                )) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <Bell className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-400 dark:text-slate-500 font-medium">No alerts today</p>
                    </div>
                )}
            </div>
        </div>
    );
}

import { Bell } from 'lucide-react';
