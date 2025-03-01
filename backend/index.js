import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import initialisePassport from "./passport/initialisePassport.js";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import indexRoutes from "./routes/indexRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();
initialisePassport();

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.TOKEN_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
