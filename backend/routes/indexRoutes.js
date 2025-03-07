import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import chatRoomRoutes from "./chatRoomRoutes.js";
import messageRoutes from "./messageRoutes.js";

const routes = express.Router();

routes.use("/api/v1", authRoutes);
routes.use("/api/v1", userRoutes);
routes.use("/api/v1", chatRoomRoutes);
routes.use("/api/v1", messageRoutes);

export default routes;