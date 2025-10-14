import express from "express";
import RateLimit from "express-rate-limit";
import { sendEmail } from "../controllers/emailController.js";

const router = express.Router();

const limiter = RateLimit({
  windowMs: 15 * 60 * 6000,
  max: 100,
  message: "Too many Requests",
});

router.post("/sendEmail", limiter, sendEmail);

export default router;
