import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Camera } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { motion } from "motion/react";
import { toast } from "sonner";

export function EditProfileScreen() {
  const navigate = useNavigate();

  const [name, setName] = useState("Amit Kumar");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [hostel, setHostel] = useState("Boys Hostel A");
  const [room, setRoom] = useState("302");

  const handleSave = () => {
    toast.success("Profile updated successfully");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background px-6 py-8">
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
        className="space-y-6 flex-1"
      >
        {/* Profile Pic */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <button className="absolute bottom-0 right-0 bg-accent text-accent-foreground p-2 rounded-full border-4 border-background">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 border border-border space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullname" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</Label>
            <Input
              id="fullname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 rounded-2xl bg-background border-border focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Mobile Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-14 rounded-2xl bg-background border-border focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hostel" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Hostel</Label>
              <Input
                id="hostel"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="h-14 rounded-2xl bg-background border-border focus:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Room</Label>
              <Input
                id="room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="h-14 rounded-2xl bg-background border-border focus:ring-accent"
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <Button
            onClick={handleSave}
            className="w-full h-16 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-bold shadow-xl shadow-accent/20"
          >
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
