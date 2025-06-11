import express from "express";
import authRoutes from "./authRoutes";
import postRoutes from "./postRoutes";
import countryRoutes from "./countryRoutes";
import likeRoutes from "./likeRoutes";
import dislikeRoutes from "./dislikeRoutes";
import userRoutes from "./userRoutes";
import followRoutes from "./followRoutes";
import chatRoutes from "./chatRoutes";
import messageRoutes from "./messageRoutes";

const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/posts", postRoutes);
routes.use("/countries", countryRoutes);
routes.use("/likes", likeRoutes);
routes.use("/dislikes", dislikeRoutes);
routes.use("/users", userRoutes);
routes.use("/", followRoutes);
routes.use("/chats", chatRoutes);
routes.use("/chats", messageRoutes);

export default routes;