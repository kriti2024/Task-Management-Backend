import express from "express";
import router from "./routes/index.js";
const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/api", router);
app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is running on port " + PORT);
  } else {
    console.log("Error occurred", error);
  }
});
