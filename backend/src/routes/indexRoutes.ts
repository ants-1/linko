import express from "express";
import authRoutes from "./authRoutes";
import postRoutes from "./postRoutes";

const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/posts", postRoutes);

export default routes;