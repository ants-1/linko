import express from "express";
import authRoutes from "./authRoutes";
import postRoutes from "./postRoutes";
import countryRoutes from "./countryRoutes";
import likeRoutes from "./likeRoutes";
import dislikeRoutes from "./dislikeRoutes";

const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/posts", postRoutes);
routes.use("/countries", countryRoutes);
routes.use("/likes", likeRoutes);
routes.use("/dislikes", dislikeRoutes);

export default routes;