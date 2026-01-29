import { User, Lock, Bell, Shield, Smartphone, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function SettingsPage() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Admin Profile</h3>
                    <button className="text-sm font-bold text-amber-500 hover:underline">Edit Details</button>
                </div>
                <div className="p-8 flex flex-col md:flex-row gap-10 items-center md:items-start">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 shadow-sm transition-all group-hover:border-amber-500 overflow-hidden">
                            <User className="w-16 h-16 text-slate-300 dark:text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-3 bg-amber-500 text-white rounded-2xl shadow-lg border-4 border-white dark:border-slate-900">
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 space-y-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Full Name</label>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-slate-200">Super Admin</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Email Address</label>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-slate-200">admin@mtbeer.com</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6 transition-colors">
                <div className="flex items-center gap-4 text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-6 mb-6">
                    <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-2xl">
                        <Sun className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Preferences</h3>
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Personalize your workspace</p>
                    </div>
                </div>
                <div className="flex items-center justify-between p-6 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                    <div className="flex items-center gap-4">
                        {theme === 'light' ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                        <span className="font-bold text-slate-700 dark:text-slate-300">Dark Mode Interface</span>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`w-14 h-8 rounded-full p-1 transition-all ${theme === 'dark' ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6 transition-colors">
                <div className="flex items-center gap-4 text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-6 mb-6">
                    <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Security & Password</h3>
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Keep your account secure</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <Shield className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                            <span className="font-bold text-slate-700 dark:text-slate-300">Change Admin Password</span>
                        </div>
                        <button className="text-xs font-black uppercase tracking-widest text-slate-400">Update</button>
                    </div>
                    <div className="flex items-center justify-between p-6 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <Bell className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                            <span className="font-bold text-slate-700 dark:text-slate-300">Notification Preferences</span>
                        </div>
                        <button className="text-xs font-black uppercase tracking-widest text-slate-400">Configure</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
