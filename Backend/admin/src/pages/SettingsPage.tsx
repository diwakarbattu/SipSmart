import { User, Lock, Bell, Shield, Smartphone, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'sonner';

export function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [profileData, setProfileData] = useState({
        name: 'Super Admin',
        email: 'admin@mtbeer.com'
    });
    const [isChanging, setIsChanging] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        promotions: true
    });

    // Fetch notifications on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await authService.getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };
        fetchSettings();
    }, []);

    const handleNotificationToggle = async (key: keyof typeof notifications) => {
        const newSettings = { ...notifications, [key]: !notifications[key] };
        setNotifications(newSettings); // Optimistic update
        try {
            await authService.updateNotifications(newSettings);
            toast.success('Preferences updated');
        } catch (error) {
            setNotifications(notifications); // Revert on failure
            toast.error('Failed to update preferences');
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsChanging(true);
        try {
            await authService.changePassword(passwords.currentPassword, passwords.newPassword);
            toast.success('Password changed successfully');
            setShowPasswordModal(false);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsChanging(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            await authService.updateProfile(profileData.name, profileData.email);
            toast.success('Profile updated successfully');
            setShowProfileModal(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Admin Profile</h3>
                    <button
                        onClick={() => setShowProfileModal(true)}
                        className="text-sm font-bold text-amber-500 hover:underline"
                    >
                        Edit Details
                    </button>
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
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-slate-200">{profileData.name}</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Email Address</label>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-slate-200">{profileData.email}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Settings & Preferences */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Preferences */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6 transition-colors h-full">
                    <div className="flex items-center gap-4 text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-6 mb-6">
                        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-2xl">
                            <Sun className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Visual</h3>
                            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Appearance & Theme</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-6 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer" onClick={toggleTheme}>
                        <div className="flex items-center gap-4">
                            {theme === 'light' ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                            <span className="font-bold text-slate-700 dark:text-slate-300">Dark Mode</span>
                        </div>
                        <div className={`w-14 h-8 rounded-full p-1 transition-all ${theme === 'dark' ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6 transition-colors h-full">
                    <div className="flex items-center gap-4 text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-6 mb-6">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-2xl">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Notifications</h3>
                            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Manage alerts</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                            { key: 'push', label: 'Push Notifications', desc: 'Real-time browser alerts' },
                            { key: 'sms', label: 'SMS Alerts', desc: 'Updates to your mobile' },
                            { key: 'promotions', label: 'Marketing', desc: 'News and promotions' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => handleNotificationToggle(item.key as any)}>
                                <div>
                                    <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">{item.label}</div>
                                    <div className="text-xs text-slate-400 font-medium">{item.desc}</div>
                                </div>
                                <div className={`w-12 h-6 rounded-full p-1 transition-all ${notifications[item.key as keyof typeof notifications] ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
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
                    <div
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center justify-between p-6 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <Shield className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                            <span className="font-bold text-slate-700 dark:text-slate-300">Change Admin Password</span>
                        </div>
                        <button className="text-xs font-black uppercase tracking-widest text-slate-400">Update</button>
                    </div>
                </div>
            </div>

            {/* Password Change Modal - SAME AS BEFORE */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Change Password</h3>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isChanging}
                                    className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                                >
                                    {isChanging ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Profile Edit Modal - SAME AS BEFORE */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Profile</h3>
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileModal(false)}
                                    className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdatingProfile}
                                    className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                                >
                                    {isUpdatingProfile ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
