import express from "express";
import connectDatabase from "./database/db";
import passport from "passport";
import dotenv from "dotenv";
import initialisePassport from "./passport/initialisePassport";
import bodyParser from "body-parser";
import session from "express-session";
import routes from "./routes/indexRoutes";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 5001;

connectDatabase();
initialisePassport();

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.TOKEN_SECRET_KEY!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
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
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}.`);
});
