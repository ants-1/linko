import express from "express";
import countryController from "../controllers/countryController";

const router = express.Router();

router.get("/", countryController.getAllCountries);

export default router;