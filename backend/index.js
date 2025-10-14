import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import emailRouter from "./routes/emailRoute.js";

dotenv.config();

const app = express(); // ✅ move this up

app.use(express.json());
app.use(
  cors({
    origin: ["https://spectraq.org", "https://www.spectraq.org"],
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => console.log("❌ MongoDB connection error:", error));

app.use("/api", emailRouter);
app.get("/", (req, res) => {
  res.send("🚀API is running");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
