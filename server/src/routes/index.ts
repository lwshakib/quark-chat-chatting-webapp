import userRoutes from "./user.routes";
import express from "express";
import conversationRoutes from "./conversation.routes";

const router = express.Router();
router.use("/user", userRoutes);
router.use("/conversation", conversationRoutes);


export default router;