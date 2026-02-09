import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ["websocket", "polling"],
        secure: false,
        rejectUnauthorized: false,
        path: "/socket.io/",
        forceNew: false,
        autoConnect: true,
      });

      // Connection event handlers
      this.socket.on("connect", () => {
        console.log("✅ Socket connected:", this.socket?.id);
        this.socket?.emit("join", userId);
      });

      this.socket.on("connect_error", (error: any) => {
        console.error("❌ Socket connection error:", error);
      });

      this.socket.on("disconnect", (reason: string) => {
        console.log("👋 Socket disconnected:", reason);
      });

      this.socket.on("error", (error: any) => {
        console.error("⚠️  Socket error:", error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
