import express from "express";
import bodyParser from "body-parser";
const app = express();

// connect to mongodb
import "./config/database";



app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "This is the News API"
  });
});

app.listen(3000, (error?: any) => {
  if(error) {
    console.error(error);
  }
  console.log("Server running on port 3000");
});
