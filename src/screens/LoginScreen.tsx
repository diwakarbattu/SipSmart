import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Beer, Phone, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { motion } from 'motion/react';

import { authService } from '../services/authService';
import { toast } from 'sonner';

export function LoginScreen() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState(''); // email or mobile
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!identity || !password) return toast.error("Please fill all fields");

    setIsLoading(true);
    try {
      await authService.login(identity, password);
      toast.success("Welcome to MT Beer Order!");
      navigate('/home');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
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
        className="flex items-center gap-3 mb-12"
      >
        <div className="bg-accent p-3 rounded-2xl">
          <Beer className="w-8 h-8 text-accent-foreground" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">MT Beer Order</h1>
          <p className="text-muted-foreground text-sm">Quick & Easy</p>
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
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">Login to continue ordering</p>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="w-32 h-40 bg-gradient-to-b from-yellow-600/20 to-yellow-800/20 rounded-3xl border-2 border-accent/30 flex items-center justify-center">
              <Beer className="w-16 h-16 text-accent" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full border-2 border-background"></div>
          </motion.div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="identity">Mobile or Email</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="identity"
                placeholder="Enter mobile or email"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="pl-12 h-14 rounded-2xl bg-card border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 h-14 rounded-2xl bg-card border-border"
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <p>Don't have an account?</p>
          <Button
            variant="outline"
            onClick={() => navigate('/register')}
            className="w-full register-btn h-14 hover:bg-card"
          >
            Register Now
          </Button>
        </div>

        <div className="mt-auto pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
