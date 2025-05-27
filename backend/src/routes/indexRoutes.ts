import express from "express";
import authRoutes from "./authRoutes";
import postRoutes from "./postRoutes";
import countryRoutes from "./countryRoutes";

const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/posts", postRoutes);
routes.use("/countries", countryRoutes);

export default routes;