import express from "express";
import { login, logout, signup, onboard} from "../controllers/auth.controller.js";
import { authRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);

router.post("/onboard" ,authRoute , onboard);

router.get("/me" ,authRoute , (req , res) => {
    return res.status(200).json({sucess : true , user : req.user });
})
export default router;
