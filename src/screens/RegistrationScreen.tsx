import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Beer, User, Phone, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { motion } from 'motion/react';

import { authService } from '../services/authService';
import { toast } from 'sonner';

export function RegistrationScreen() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !mobile || !email || !password || !address) {
            return toast.error("Please fill all fields");
        }
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setIsLoading(true);
        try {
            await authService.register({ name, mobile, email, password, address, role: 'user' });
            toast.success("Registration successful! Your account is pending admin approval.");
            navigate('/login');
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background px-6 py-8">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-10"
            >
                <div className="bg-accent p-3 rounded-2xl">
                    <Beer className="w-8 h-8 text-accent-foreground" strokeWidth={2} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">MT Beer Order</h1>
                    <p className="text-muted-foreground text-sm">Join the Club</p>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex-1 flex flex-col"
            >
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                    <p className="text-muted-foreground">Register to start ordering</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 rounded-xl bg-card border-border"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input
                                id="mobile"
                                type="tel"
                                placeholder="Number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="h-12 rounded-xl bg-card border-border"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 rounded-xl bg-card border-border"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            placeholder="Full delivery address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="h-12 rounded-xl bg-card border-border"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 rounded-xl bg-card border-border"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword">Confirm</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-12 rounded-xl bg-card border-border"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20 mt-4"
                    >
                        {isLoading ? "Creating Account..." : "Register"}
                    </Button>

                    <div className="text-center mt-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-muted-foreground text-sm hover:text-accent transition-colors"
                        >
                            Already have an account? <span className="text-accent font-semibold">Login</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
