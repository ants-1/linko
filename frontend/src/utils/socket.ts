import { io } from "socket.io-client";

const socket = io("https://linko-2hp9.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;