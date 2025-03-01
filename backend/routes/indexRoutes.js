import express from "express";
import authRoutes from "./authRoutes.js";

const routes = express.Router();

routes.use("/api/v1", authRoutes);

export default routes;