import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Search, Edit2, Trash2, Tag, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OffersPage() {
    const { offers, addOffer, updateOffer, deleteOffer } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<any>(null);
    const [formData, setFormData] = useState({
        discountType: 'Percentage',
        discountValue: 0,
        isActive: true,
        validFrom: '',
        validTo: ''
    });

    const filteredOffers = offers.filter(o =>
        o.discountType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.discountValue.toString().includes(searchTerm)
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingOffer) {
            await updateOffer(editingOffer.id, formData);
        } else {
            await addOffer(formData);
        }
        setIsModalOpen(false);
        setEditingOffer(null);
        setFormData({
            discountType: 'Percentage',
            discountValue: 0,
            isActive: true,
            validFrom: '',
            validTo: ''
        });
    };

    const handleEdit = (offer: any) => {
        setEditingOffer(offer);
        setFormData({
            discountType: offer.discountType,
            discountValue: offer.discountValue,
            isActive: offer.isActive,
            validFrom: new Date(offer.validFrom).toISOString().split('T')[0],
            validTo: new Date(offer.validTo).toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Offers & Promotions</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage discounts and seasonal offers</p>
                </div>
                <button
                    onClick={() => { setEditingOffer(null); setIsModalOpen(true); }}
                    className="btn-primary"
                >
                    <Plus className="size-4" />
                    Create New Offer
                </button>
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search offers..."
                            className="input pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Type</th>
                                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Value</th>
                                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Validity</th>
                                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                                <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOffers.map((offer) => (
                                <tr key={offer.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Tag className="size-4 text-amber-500" />
                                            <span className="font-medium text-slate-700">{offer.discountType}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {offer.discountType === 'Percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500">
                                        {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validTo).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        {offer.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <CheckCircle className="size-3" /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                <XCircle className="size-3" /> Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(offer)} className="p-1.5 hover:bg-amber-100 text-slate-600 hover:text-amber-600 rounded-lg transition-colors">
                                                <Edit2 className="size-4" />
                                            </button>
                                            <button onClick={() => deleteOffer(offer.id)} className="p-1.5 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg transition-colors">
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden"
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-6">
                                {editingOffer ? 'Edit Offer' : 'New Offer'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Type</label>
                                        <select
                                            className="input"
                                            value={formData.discountType}
                                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        >
                                            <option value="Percentage">Percentage</option>
                                            <option value="Flat">Flat</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Value</label>
                                        <input
                                            type="number"
                                            className="input"
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Valid From</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Valid To</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={formData.validTo}
                                        onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="size-4 text-amber-500 focus:ring-amber-500 border-slate-300 rounded"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active Offer</label>
                                </div>
                                <div className="flex items-center gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                                    >
                                        {editingOffer ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
