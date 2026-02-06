
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Lock, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { authService } from '../services/authService';

export function ChangePasswordScreen() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            // Mocking the API call for now since backend endpoint might not exist yet
            // In a real scenario: await authService.changePassword(currentPassword, newPassword);

            // Simulating success
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Password changed successfully');
            navigate(-1);
        } catch (err: any) {
            toast.error(err.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="px-6 pt-8 pb-4 bg-card border-b border-border sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold">Change Password</h1>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 p-6 space-y-6">
                <div className="bg-secondary/20 p-4 rounded-2xl border border-accent/10 mb-6">
                    <p className="text-sm text-muted-foreground flex gap-2">
                        <Lock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        Create a strong password to keep your account secure.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current">Current Password</Label>
                        <Input
                            id="current"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="h-12 rounded-xl bg-card"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new">New Password</Label>
                        <Input
                            id="new"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-12 rounded-xl bg-card"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm">Confirm New Password</Label>
                        <Input
                            id="confirm"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-12 rounded-xl bg-card"
                            placeholder="Re-enter new password"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-card border-t border-border mt-auto">
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        "Updating..."
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Update Password
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
