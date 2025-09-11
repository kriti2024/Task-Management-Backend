import express from "express";
import router from "./routes/index.js";
import path from "path";

const app = express();
const PORT = 5000;
import cors from "cors";
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", router);
app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is running on port " + PORT);
  } else {
    console.log("Error occurred", error);
  }
});
