import express from "express";
import bodyParser from "body-parser";
import mongoose, { ConnectOptions } from "mongoose";

const app = express();

// connect to mongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/news_api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("Connected to mongoDB!");
    app.listen(3000, (error?: any) => {
      if (error) {
        console.log(error);
      }
      console.log("App listening on port 3000!");
    });
  })
  .catch((err) => console.log(err));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "This is the News API"
  });
});
