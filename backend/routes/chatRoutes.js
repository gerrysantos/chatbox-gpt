import express from "express";
const router = express.Router();

import { createChatLog, getChatLog } from "../controller/chatController.js";

router.post("/chat", createChatLog);

router.get("/chat", getChatLog);

export default router;
