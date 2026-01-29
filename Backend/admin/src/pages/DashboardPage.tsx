import { Users, ShoppingBag, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';

export function DashboardPage() {
    const { users, orders, products } = useData();

    const stats = [
        { label: 'Total Users', value: users.length.toLocaleString(), icon: Users, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Total Orders', value: orders.length.toLocaleString(), icon: ShoppingBag, color: 'bg-amber-500', trend: '+18%' },
        { label: 'In Progress', value: orders.filter(o => o.status === 'In Progress').length, icon: Clock, color: 'bg-purple-500', trend: '-5%' },
        { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, icon: CheckCircle, color: 'bg-emerald-500', trend: '+22%' },
        { label: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length, icon: XCircle, color: 'bg-rose-500', trend: '+2%' },
    ];

    const lowStock = products.filter(p => p.stock < 10);

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4 group hover:shadow-xl transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                <TrendingUp className={`w-3 h-3 ${stat.trend.startsWith('-') && 'rotate-180'}`} />
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recent Orders</h3>
                        <button className="text-sm font-bold text-amber-500 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest px-6">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Order ID</th>
                                    <th className="px-6 py-4 font-bold">Customer</th>
                                    <th className="px-6 py-4 font-bold">Product</th>
                                    <th className="px-6 py-4 font-bold">Total</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900 dark:text-slate-200">{order.userName}</div>
                                            <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">{order.mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                                            {order.productName}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white">
                                            ₹{order.totalPrice}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${order.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                                    order.status === 'In Progress' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                                        'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inventory Highlights */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Inventory Alerts</h3>
                    <div className="space-y-6">
                        {lowStock.length > 0 ? lowStock.map((item) => (
                            <div key={item.name} className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                                    <span className={`font-black ${item.stock < 5 ? 'text-rose-500' : 'text-amber-500'}`}>
                                        {item.stock} left
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${item.stock < 5 ? 'bg-rose-500' : 'bg-amber-500'}`}
                                        style={{ width: `${(item.stock / 50) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )) : <p className="text-slate-400 dark:text-slate-500 text-sm italic">All items well stocked!</p>}
                    </div>
                    <button className="mt-4 w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        Full Stock Report
                    </button>
                </div>
            </div>
        </div>
    );
}
