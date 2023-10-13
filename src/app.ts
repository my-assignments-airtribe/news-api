import express from "express";
import bodyParser from "body-parser";

import mongoConfig from "./config/database";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes";
import newsRoutes from "./routes/newsRoutes";

import { startBackgroundUpdates } from "./services/backgroundUpdatesService";
import helmet from "helmet";
import { limiter } from "./services/rateLimiter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(helmet());
// Define routes
app.get("/", limiter, (req, res) => {
  res.status(200).json({
    message: "This is the News API",
  });
});

app.use("/user", limiter, userRoutes);
app.use("/news", limiter,  newsRoutes);

// Start the Express server
app.listen(PORT, (error?: any) => {
  if (error) {
    console.error("Error starting the server:", error);
  } else {
    console.log("Server running on port 3000");
    // MongoDB connection handling
    mongoConfig.once("open", async () => {
      console.log("Connected to MongoDB");
      
      // Start background updates after MongoDB connection and server start
      startBackgroundUpdates();
    }).on("error", (err) => {
      console.error("Error connecting to MongoDB:", err);
    });
  }
});

