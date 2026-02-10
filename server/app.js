import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { errorMiddleware } from "./middlewares/error.middlewares.js";

import { socketAuthentication } from "./middlewares/auth.middlewares.js";
import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";
import { setupSocketEvents } from "./Socket/index.js";

const corsOptions = {
  origin: ["http://localhost:5173", process.env.FRONTEND_PORT],
  credentials: true,
};

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsOptions });

app.set("io", io);
const userSocketId = new Map();

// Setup middleware
function setupMiddleware(app) {
  app.use(express.json());
  app.use(express.static("public"));
  app.use(cookieParser());
  app.use(cors(corsOptions));
}

// Setup routes
function setupRoutes(app) {
  app.use("/user", userRoutes);
  app.use("/chat", chatRoutes);
}

// Handle socket authentication
function setupSocketAuthentication(io) {
  io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, async (err) => {
      await socketAuthentication(err, socket, next);
    });
  });
}

// Initialize app
function initializeApp() {
  setupMiddleware(app);
  setupRoutes(app);
  setupSocketAuthentication(io);
  setupSocketEvents(io);
  app.use(errorMiddleware);
}

initializeApp();

export { app, server, userSocketId };
