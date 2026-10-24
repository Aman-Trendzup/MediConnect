import express from "express";
import {registerUser,loginUser,logoutUser,getCurrentUser} from "../controllers/user.controller.js";
import { authMiddleware} from "../middleware/auth.middleware.js";


const router = express.Router();

//POST api/user/register
router.post("/register", registerUser);

//POST api/user/login
router.post("/login", loginUser);

//POST api/user/logout
router.post("/logout", logoutUser);

//GET api/user/profile
router.get("/me", authMiddleware, getCurrentUser);

export default router;