
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    X, LogOut, ChevronRight, ChevronDown, User, Shield, Wallet,
    ShoppingBag, Phone, MessageCircle, Mail, MapPin, Trash2, Camera,
    Clock, Bell, Globe, FileText, HelpCircle, Award, TrendingUp, TrendingDown
} from 'lucide-react';
import { useUI } from '../state/UIContext';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';

export function ProfileDrawer() {
    const { isProfileOpen, closeProfile } = useUI();
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const handleLogout = () => {
        authService.logout();
        closeProfile();
        navigate('/login');
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    if (!user) return null;

    const isAdmin = user.role === 'admin';

    return (
        <AnimatePresence>
            {isProfileOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeProfile}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-br from-card via-card to-accent/5 border-b border-border flex flex-col items-center relative">
                            <button
                                onClick={closeProfile}
                                className="absolute top-6 right-6 p-2 bg-secondary rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="w-24 h-24 rounded-full bg-secondary mb-4 overflow-hidden relative group">
                                {user.profilePic ? (
                                    <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-accent/10">
                                        <User className="w-10 h-10 text-accent" />
                                    </div>
                                )}
                                <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" onClick={() => navigate('/edit-profile')}>
                                    <Camera className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                            <p className="text-xs text-muted-foreground/60 mb-3">ID: {user.id || 'N/A'}</p>

                            <div className="flex gap-2 flex-wrap justify-center">
                                {isAdmin && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-500 border border-purple-500/20">
                                        Admin
                                    </span>
                                )}
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${user.isApproved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                    {user.isApproved ? 'Verified' : 'Pending'}
                                </span>
                                {!isAdmin && user.rewardPoints > 0 && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 flex items-center gap-1">
                                        <Award className="w-3 h-3" /> {user.rewardPoints} Pts
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">

                            {/* Quick Actions */}
                            <Section
                                title="Edit Profile"
                                icon={<User className="w-5 h-5 text-sky-500" />}
                                description="Update Name & Mobile"
                                onClick={() => {
                                    closeProfile();
                                    navigate('/edit-profile');
                                }}
                            />

                            {/* Order Summary - User Only */}
                            {!isAdmin && (
                                <ExpandableSection
                                    title="Order Summary"
                                    icon={<ShoppingBag className="w-5 h-5 text-emerald-500" />}
                                    isExpanded={expandedSection === 'orders'}
                                    onToggle={() => toggleSection('orders')}
                                >
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total Orders:</span>
                                            <span className="font-bold">0</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Active Orders:</span>
                                            <span className="font-bold text-accent">0</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Last Order:</span>
                                            <span className="font-bold">Never</span>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                closeProfile();
                                                navigate('/orders');
                                            }}
                                            className="w-full mt-2 h-9 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent"
                                            variant="outline"
                                        >
                                            View Full History
                                        </Button>
                                    </div>
                                </ExpandableSection>
                            )}

                            {/* Wallet & Rewards - User Only */}
                            {!isAdmin && (
                                <ExpandableSection
                                    title="Wallet & Rewards"
                                    icon={<Wallet className="w-5 h-5 text-amber-500" />}
                                    isExpanded={expandedSection === 'wallet'}
                                    onToggle={() => toggleSection('wallet')}
                                >
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl">
                                            <span className="text-muted-foreground">Total Points:</span>
                                            <span className="font-bold text-lg text-amber-600">{user.rewardPoints}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                                                <div className="flex items-center gap-1 text-emerald-600 mb-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                    <span className="text-xs font-bold">Earned</span>
                                                </div>
                                                <p className="text-sm font-bold">{user.rewardPoints}</p>
                                            </div>
                                            <div className="flex-1 p-2 bg-rose-500/5 rounded-lg border border-rose-500/20">
                                                <div className="flex items-center gap-1 text-rose-600 mb-1">
                                                    <TrendingDown className="w-3 h-3" />
                                                    <span className="text-xs font-bold">Redeemed</span>
                                                </div>
                                                <p className="text-sm font-bold">0</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center pt-2">No recent transactions</p>
                                    </div>
                                </ExpandableSection>
                            )}

                            {/* Delivery Addresses */}
                            <Section
                                title="Delivery Addresses"
                                icon={<MapPin className="w-5 h-5 text-indigo-500" />}
                                description={user.address || "Add default address"}
                                onClick={() => {
                                    closeProfile();
                                    navigate('/address');
                                }}
                            />

                            {/* Preferences */}
                            <ExpandableSection
                                title="Preferences"
                                icon={<Clock className="w-5 h-5 text-violet-500" />}
                                isExpanded={expandedSection === 'preferences'}
                                onToggle={() => toggleSection('preferences')}
                            >
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Preferred Pickup Time:</span>
                                        <span className="font-medium">10:00 AM - 12:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Bell className="w-4 h-4" />
                                            Notifications:
                                        </span>
                                        <button className="px-3 py-1 bg-accent/10 text-accent rounded-lg text-xs font-bold">
                                            Enabled
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Language:
                                        </span>
                                        <span className="font-medium">English</span>
                                    </div>
                                </div>
                            </ExpandableSection>

                            {/* Security */}
                            <Section
                                title="Change Password"
                                icon={<Shield className="w-5 h-5 text-rose-500" />}
                                description="Update your security"
                                onClick={() => {
                                    closeProfile();
                                    navigate('/change-password');
                                }}
                            />

                            {/* Support */}
                            <ExpandableSection
                                title="Help & Support"
                                icon={<HelpCircle className="w-5 h-5 text-blue-500" />}
                                isExpanded={expandedSection === 'support'}
                                onToggle={() => toggleSection('support')}
                            >
                                <div className="space-y-2">
                                    <button
                                        onClick={() => window.open('tel:+919989636733')}
                                        className="w-full p-3 bg-secondary/50 rounded-xl flex items-center gap-3 hover:bg-accent/10 transition-colors"
                                    >
                                        <Phone className="w-4 h-4 text-violet-500" />
                                        <span className="text-sm font-medium">Call Support</span>
                                    </button>
                                    <button
                                        onClick={() => window.open('https://wa.me/919989636733', '_blank')}
                                        className="w-full p-3 bg-secondary/50 rounded-xl flex items-center gap-3 hover:bg-accent/10 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-sm font-medium">WhatsApp</span>
                                    </button>
                                    <button
                                        onClick={() => window.open('mailto:battudiwakar@gmail.com')}
                                        className="w-full p-3 bg-secondary/50 rounded-xl flex items-center gap-3 hover:bg-accent/10 transition-colors"
                                    >
                                        <Mail className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm font-medium">Email Us</span>
                                    </button>
                                </div>
                            </ExpandableSection>

                            {/* Legal */}
                            <ExpandableSection
                                title="Legal & Policies"
                                icon={<FileText className="w-5 h-5 text-slate-500" />}
                                isExpanded={expandedSection === 'legal'}
                                onToggle={() => toggleSection('legal')}
                            >
                                <div className="space-y-2 text-sm">
                                    <button className="w-full text-left p-2 hover:bg-secondary/50 rounded-lg transition-colors">
                                        Terms & Conditions
                                    </button>
                                    <button className="w-full text-left p-2 hover:bg-secondary/50 rounded-lg transition-colors">
                                        Privacy Policy
                                    </button>
                                </div>
                            </ExpandableSection>

                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 bg-card border-t border-border space-y-3">
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/5"
                            >
                                <LogOut className="w-5 h-5" />
                                Log Out
                            </Button>

                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                                        authService.logout();
                                        closeProfile();
                                        navigate('/login');
                                    }
                                }}
                                className="w-full text-center text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" /> Delete Account
                            </button>

                            <p className="text-center text-[10px] text-muted-foreground/50 pt-2">
                                v1.0.0 • BottleMart App
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

const Section = ({ title, icon, description, onClick }: { title: string, icon: React.ReactNode, description?: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4 hover:bg-accent/5 transition-colors group"
    >
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div className="flex-1 text-left">
            <h3 className="font-bold text-sm">{title}</h3>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-accent transition-colors" />
    </button>
);

const ExpandableSection = ({
    title,
    icon,
    isExpanded,
    onToggle,
    children
}: {
    title: string,
    icon: React.ReactNode,
    isExpanded: boolean,
    onToggle: () => void,
    children: React.ReactNode
}) => (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full p-4 flex items-center gap-4 hover:bg-accent/5 transition-colors"
        >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                {icon}
            </div>
            <div className="flex-1 text-left">
                <h3 className="font-bold text-sm">{title}</h3>
            </div>
            <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <ChevronDown className="w-5 h-5 text-muted-foreground/50" />
            </motion.div>
        </button>
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <div className="p-4 pt-0 border-t border-border/50">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);
