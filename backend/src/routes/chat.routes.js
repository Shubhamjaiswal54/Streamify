import express from "express";
import { authRoute } from "../middleware/auth.middleware";


const router = express.Router();


router.get("/token" , authRoute , getStreamToken);

export default router;