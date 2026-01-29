import { useState } from 'react';
import { Search, Filter, Edit2, Trash2, MoreVertical, UserPlus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Modal } from '../components/Modal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import type { User } from '../types';

export function UsersPage() {
    const { users, addUser, updateUser, deleteUser } = useData();
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: ''
    });

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.mobile.includes(search)
    );

    const resetForm = () => {
        setFormData({ name: '', mobile: '', email: '', address: '' });
        setSelectedUser(null);
    };

    const handleOpenEdit = (user: User) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            address: user.address
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                await updateUser(selectedUser.id, formData);
            } else {
                await addUser(formData);
            }
            setIsModalOpen(false);
            resetForm();
        } catch (err) {
            // Error handled in context
        }
    };

    const confirmDelete = (id: string) => {
        setUserToDelete(id);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or mobile number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm text-slate-900 dark:text-white"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                        <Filter className="w-5 h-5" />
                        Filter
                    </button>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="px-6 py-4 bg-amber-500 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add New User
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-8 py-5">User Name</th>
                                <th className="px-8 py-5">Contact Details</th>
                                <th className="px-8 py-5">Address</th>
                                <th className="px-8 py-5">Registration Date</th>
                                <th className="px-8 py-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredUsers.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.email}</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">{user.mobile}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-[200px] truncate">{user.address}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500">
                                            {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(user)}
                                                className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(user.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedUser ? 'Edit User Details' : 'Register New User'}
                description={selectedUser ? 'Update the information for this app user' : 'Create a new user account manually'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Full Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Mobile Number</label>
                            <input
                                required
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                placeholder="+91 00000 00000"
                                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Email Address</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Physical Address</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Hostel, Street, City..."
                                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 shadow-xl shadow-amber-500/20 transition-all"
                        >
                            {selectedUser ? 'Update User' : 'Register User'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => userToDelete && deleteUser(userToDelete)}
                title="Delete User Account"
                message="Are you sure you want to delete this user? All their data, history and rewards will be permanently wiped out."
                confirmLabel="Wipe Data"
            />
        </div>
    );
}
