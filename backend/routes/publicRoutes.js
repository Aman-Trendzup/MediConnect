import {getDoctors,getServices,getDoctorProfile} from "../controllers/public.controller.js";

import express from 'express';

const router= express.Router();

router.get("/doctors",getDoctors);

router.get("/services",getServices);

router.get("/doctors/:doctorId",getDoctorProfile);

export default router;