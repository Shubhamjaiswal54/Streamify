import express from "express";
import { authRoute } from "../middleware/auth.middleware";
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
} from "../controllers/user.controller";

const router = express.Router();
router.use(authRoute);
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

export default router;
