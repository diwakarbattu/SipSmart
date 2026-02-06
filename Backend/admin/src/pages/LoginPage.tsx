import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Beer, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { toast } from 'sonner';

export function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({ identity: '', password: '' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.login(formData.identity, formData.password);
            toast.success('Access Granted', { description: 'Welcome back, Administrator' });
            navigate('/');
        } catch (err: any) {
            toast.error('Authentication Failed', {
                description: err.response?.data?.message || err.message || 'Invalid credentials'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 dark:bg-slate-950 px-6 py-12 transition-colors">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative z-10 border border-transparent dark:border-slate-800/50"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-amber-500 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl shadow-amber-500/20 rotate-6 group">
                        <Beer className="text-white w-10 h-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">MT Beer Admin</h1>
                    <p className="text-slate-400 dark:text-slate-500 mt-2 font-medium">Elevating beverage management</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Admin Identity</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                required
                                type="text"
                                placeholder="admin@mtbeer.com"
                                value={formData.identity}
                                onChange={e => setFormData({ ...formData, identity: e.target.value })}
                                className="w-full pl-14 pr-4 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Secure Passkey</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-14 pr-14 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-900 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-500 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-slate-900 dark:bg-amber-500 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-amber-500/10 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden group"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Access Dashboard
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">
                    Encrypted Authentication Session
                </p>
            </motion.div>
        </div>
    );
}
