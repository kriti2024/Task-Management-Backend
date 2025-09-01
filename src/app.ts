import express from "express";
import router from "./routes/index";
const app = express();
const PORT = 3000;

app.use("/api", router);
app.listen(PORT, (error?) => {
  if (!error) {
    console.log("Server is running on port " + PORT);
  } else {
    console.log("Error occurred", error);
  }
});
