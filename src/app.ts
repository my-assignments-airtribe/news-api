import express from "express";
import bodyParser from "body-parser";

import mongoConfig from "./config/database";
import dotenv from 'dotenv';

import userRoutes from "./routes/userRoutes";
import newsRoutes from "./routes/newsRoutes";
import NodeCache from "node-cache";
import cron from "node-cron";

const cache = new NodeCache();

dotenv.config();


const app = express();

mongoConfig.once('open', () => {
  app.listen(3000, (error?: any) => {
    if(error) {
      console.error(error);
    }
    console.log("Server running on port 3000");
  });
}).on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});


app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "This is the News API"
  });
});

app.use('/user', userRoutes);
app.use('/news', newsRoutes);


