import express from "express";
import { sendPrompt } from "../controller/prompt.controller.js";
import userMiddleware from "../middleware/prompt.middleware.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/prompt", authenticateUser, userMiddleware, sendPrompt);

export default router;
