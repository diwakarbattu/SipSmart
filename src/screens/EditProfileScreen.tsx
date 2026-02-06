import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Camera, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { motion } from "motion/react";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

export function EditProfileScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const profile = await userService.getProfile(currentUser.id);
          setName(profile.name);
          setPhone(profile.mobile);
          setAddress(profile.address);
          setProfilePic(profile.profilePic || "");
        }
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    setIsSaving(true);
    try {
      const updatedProfile = await userService.updateProfile(currentUser.id, {
        name,
        mobile: phone,
        address,
        profilePic
      });
      authService.updateCurrentUser(updatedProfile);
      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background px-6 py-8 pb-10">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 flex-1 flex flex-col"
      >
        {/* Profile Pic */}
        <div className="flex flex-col items-center py-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-4 border-card shadow-xl">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-muted-foreground" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-accent text-accent-foreground p-3 rounded-full border-4 border-background shadow-lg hover:scale-110 active:scale-90 transition-transform"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4">Tap camera to change photo</p>
        </div>

        <div className="bg-card rounded-3xl p-6 border border-border space-y-5 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="fullname" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</Label>
            <Input
              id="fullname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 rounded-2xl bg-background border-border focus:ring-accent font-bold"
              placeholder="Your Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Mobile Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-14 rounded-2xl bg-background border-border focus:ring-accent font-bold"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-14 rounded-2xl bg-background border-border focus:ring-accent font-bold"
              placeholder="Building, Street, Area"
            />
          </div>
        </div>

        <div className="mt-auto pt-6">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-16 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-bold shadow-xl shadow-accent/20 transition-all flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

