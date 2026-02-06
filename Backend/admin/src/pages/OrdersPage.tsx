import { useState } from 'react';
import { Search, Check, X, Clock, Edit2, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Modal } from '../components/Modal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import type { Order } from '../types';

export function OrdersPage() {
    const { orders, updateOrderStatus, deleteOrder } = useData();
    const [activeTab, setActiveTab] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

    const [editFormData, setEditFormData] = useState<Partial<Order>>({});

    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === 'All' || order.status === activeTab;
        const matchesSearch = order.mobile.includes(search) ||
            order.userName.toLowerCase().includes(search.toLowerCase()) ||
            order.id.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleOpenEdit = (order: Order) => {
        setSelectedOrder(order);
        setEditFormData({ ...order });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOrder && editFormData.status) {
            try {
                await updateOrderStatus(selectedOrder.id, editFormData.status as any);
                setIsEditModalOpen(false);
            } catch (err) {
                // Error handled in context
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                    {['All', 'Pending', 'Accepted', 'Delivered', 'Cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab
                                ? 'bg-slate-900 dark:bg-amber-500 text-white shadow-lg'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by mobile or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Order ID</th>
                                <th className="px-8 py-5">Client</th>
                                <th className="px-8 py-5">Items</th>
                                <th className="px-8 py-5">Total</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-center">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredOrders.map((order, index) => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="px-8 py-6 font-black text-slate-800 dark:text-white">{order.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-slate-900 dark:text-slate-200">{order.userName}</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">{order.mobile}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            {order.productList?.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <span className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                        {item.quantity}x
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                                                </div>
                                            ))}
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                                                Pickup: {order.pickupDate} at {order.pickupTime}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-white">₹{order.totalPrice}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-2 w-fit ${order.status === 'Delivered' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                            order.status === 'Pending' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                                order.status === 'Accepted' ? 'bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400' :
                                                    'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                            }`}>
                                            {order.status === 'Pending' && <Clock className="w-3 h-3" />}
                                            {order.status === 'Accepted' && <Clock className="w-3 h-3 animate-pulse" />}
                                            {order.status === 'Delivered' && <Check className="w-3 h-3" />}
                                            {order.status === 'Cancelled' && <X className="w-3 h-3" />}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleOpenEdit(order)} className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => { setOrderToDelete(order.id); setIsDeleteOpen(true); }} className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Order Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Modify Active Order"
                description="Update order details, quantity or delivery status instantly"
            >
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1 col-span-2">
                            <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Delivery Address</label>
                            <textarea
                                rows={2}
                                value={editFormData.address}
                                onChange={e => setEditFormData({ ...editFormData, address: e.target.value })}
                                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-1 col-span-2">
                            <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Lifecycle Status</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['Pending', 'Accepted', 'Delivered', 'Cancelled'].map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setEditFormData({ ...editFormData, status: s as any })}
                                        className={`py-3 rounded-xl font-bold text-xs transition-all ${editFormData.status === s
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-bold"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 shadow-xl shadow-amber-500/20 transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => orderToDelete && deleteOrder(orderToDelete)}
                title="Discard Order Record?"
                message="This will remove the order history. This action usually cannot be undone."
            />
        </div>
    );
}
