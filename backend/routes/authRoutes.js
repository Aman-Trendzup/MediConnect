import express from "express";
import {register,login,logout,getCurrentUser} from "../controllers/auth.controller.js";
import { authMiddleware} from "../middleware/auth.middleware.js";


const router = express.Router();

//POST api/auth/register
router.post("/register", register);

//POST api/auth/login
router.post("/login", login);

//POST api/auth/logout
router.post("/logout", logout);

//GET api/auth/profile
router.get("/me", authMiddleware, getCurrentUser);

export default router;