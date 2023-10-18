import express from "express";
import http from "http"; // Import the Node.js built-in HTTP module
import bodyParser from "body-parser";
import mongoConfig from "./config/database";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import newsRoutes from "./routes/newsRoutes";
import { startBackgroundUpdates } from "./services/backgroundUpdatesService";
import helmet from "helmet";
import { limiter } from "./services/rateLimiter";
import { errorHandler } from "./handlers/error-handler";
import logger from "./logger";
import express, { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.NODE_ENV === 'test' ? process.env.TEST_PORT : process.env.PORT;
let server: http.Server; // Define a variable to hold the server instance

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
app.use("/news", limiter, newsRoutes);
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    logger.info(`Response: ${res.statusCode} ${res.statusMessage}`);
  });
  next();
});
app.use(errorHandler);

// Start the HTTP server and store the server instance
server = http.createServer(app);

server.listen(PORT, (error?: any) => {
  if (error) {
    console.error("Error starting the server:", error);
  } else {
    console.log(`Server running on port ${PORT}`);
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

// Define a custom interface to extend the Express interface
interface CustomExpress extends express.Express {
  close(): void;
}

// Cast app to the custom interface
const customApp = app as CustomExpress;

// Define the app.close method to stop the server
customApp.close = () => {
  server.close();
};

export default customApp;
