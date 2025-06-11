import express from "express";
import connectDatabase from "./database/db";
import passport from "passport";
import dotenv from "dotenv";
import initialisePassport from "./passport/initialisePassport";
import bodyParser from "body-parser";
import session from "express-session";
import routes from "./routes/indexRoutes";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { setSocketIO } from "./controllers/messageController";

dotenv.config();

const app = express();
const PORT = 5001;
const server = createServer(app);

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

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
setSocketIO(io);

io.on("connection", (socket) => {
  console.log("User connected.", socket.id);

  socket.on("chat message", (msg) => {
    console.log("Message:", msg);
    io.emit("chat message", msg);
  });
  
  socket.on("join room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("leave room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/api/v1", routes);

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}.`);
});
