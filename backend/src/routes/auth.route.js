import express from "express";
import { login, logout, signup, onboard} from "../controllers/auth.controller.js";
import { authRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);

router.post("/onboard" ,authRoute , onboard);

export default router;
