import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { productService } from '../services/productService';
import { Pagination } from '../components/Pagination';
import { motion } from 'framer-motion';
import { Modal } from '../components/Modal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import type { Product } from '../types';

export function ProductsPage() {
    const { addProduct, updateProduct, deleteProduct } = useData();
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        type: 'Whiskey bottle',
        size: '750ml',
        discount: 0,
        stock: 0,
        description: '',
    });

    const fetchProducts = useCallback(async () => {
        try {
            const result = await productService.getProducts(page, limit);
            setProducts(result.data);
            setPagination(result.pagination);
        } catch (error) {
            console.error(error);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const handleOpenEdit = (p: Product) => {
        setSelectedProduct(p);
        setFormData({
            name: p.name,
            price: p.price,
            type: p.type || 'Whiskey bottle',
            size: p.size || '750ml',
            discount: p.discount || 0,
            stock: p.stock,
            description: p.description,
        });
        setImagePreview(p.image);
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', String(formData.price));
            data.append('type', formData.type);
            data.append('size', formData.size);
            data.append('discount', String(formData.discount));
            data.append('stock', String(formData.stock));
            data.append('description', formData.description);
            if (imageFile) {
                data.append('image', imageFile);
            }

            if (selectedProduct) {
                await updateProduct(selectedProduct.id, data);
            } else {
                await addProduct(data);
            }
            await fetchProducts();
            setIsModalOpen(false);
            setSelectedProduct(null);
            setImageFile(null);
            setImagePreview('');
        } catch (err) {
            // Error Toast handled in context
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products by brand name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm text-slate-900 dark:text-white"
                    />
                </div>
                <button
                    onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
                    className="px-6 py-4 bg-amber-500 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Add New Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-xl transition-all"
                    >
                        <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex flex-col items-end">
                                <p className="text-amber-600 font-black text-sm">₹{product.price}</p>
                                {(product.discount ?? 0) > 0 && (
                                    <p className="text-[10px] text-emerald-500 font-bold">-{product.discount}% OFF</p>
                                )}
                            </div>
                            {product.stock < 10 && (
                                <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    Low Stock
                                </div>
                            )}
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1">{product.name}</h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{product.type}</span>
                                </div>
                                <p className={`text-xs font-black mt-1 uppercase tracking-wider ${product.stock < 10 ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {product.stock} items left
                                </p>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                                <button
                                    onClick={() => handleOpenEdit(product)}
                                    className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold text-xs hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-500 dark:hover:text-amber-400 transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => { setProductToDelete(product.id); setIsDeleteOpen(true); }}
                                    className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {pagination && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.limit}
                        onPageChange={setPage}
                        onItemsPerPageChange={setLimit}
                    />
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedProduct ? 'Customize brew details' : 'Stock fresh arrivals'}
                description={selectedProduct ? 'Modify pricing, stock levels or descriptions' : 'Add a new beer variant to the app catalog'}
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 col-span-2 md:col-span-1">
                            <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Photo Preview</label>
                            <div
                                onClick={() => document.getElementById('imageInput')?.click()}
                                className="relative group aspect-square rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-center cursor-pointer transition-all hover:border-amber-500"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                                ) : (
                                    <ImageIcon className="w-10 h-10 text-slate-300" />
                                )}
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-amber-500">
                                    <Plus className="w-10 h-10" />
                                    <span className="text-xs font-black mt-2">{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                                </div>
                                <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-5 col-span-2 md:col-span-1">
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Product Title</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl" placeholder="e.g. Premium Lager" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Price (₹)</label>
                                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl" placeholder="0" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Product Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl appearance-none"
                                    required
                                >
                                    {[
                                        'Whiskey bottle',
                                        'Beer bottle',
                                        'Wine bottle',
                                        'Vodka bottle',
                                        'Rum bottle',
                                        'Brandy bottle',
                                        'Other'
                                    ].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Bottle Size</label>
                                <select
                                    value={formData.size}
                                    onChange={e => setFormData({ ...formData, size: e.target.value })}
                                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl appearance-none"
                                    required
                                >
                                    {['180ml', '375ml', '750ml'].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Discount (%)</label>
                                <input type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })} className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl" placeholder="0" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Stock Quantity</label>
                                <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl" placeholder="50" required />
                            </div>
                        </div>

                        <div className="space-y-1 col-span-2">
                            <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Taste Profiles & Description</label>
                            <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl" placeholder="Describe the flavors..." required />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 shadow-xl shadow-amber-500/20 transition-all"
                        >
                            {selectedProduct ? 'Sync Changes' : 'Confirm Entry'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={async () => {
                    if (productToDelete) {
                        await deleteProduct(productToDelete);
                        await fetchProducts();
                        setIsDeleteOpen(false);
                    }
                }}
                title="Remove Brew variant?"
                message="This will permanently delete the product from the catalog. Customers won't see it anymore."
            />
        </div>
    );
}
