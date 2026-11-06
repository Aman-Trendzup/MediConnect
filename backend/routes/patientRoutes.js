import {
    getAllAppointments,
    bookAppointment,
    cancelAppointment,
    checkDoctorAvailability,
    getPatientProfile,
    updatePatientProfile,
    createReview
} from "../controllers/patient.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";
import express from 'express';

const router=express.Router();


router.get("/appointments",authMiddleware,getAllAppointments);

router.post("/appointments/:doctorId",authMiddleware,bookAppointment);

router.patch("/appointments/:id/cancel",authMiddleware,cancelAppointment);

router.get("/doctors/:doctorId/availability",authMiddleware,checkDoctorAvailability);

router.get("/profile",authMiddleware,getPatientProfile);

router.patch("/profile",authMiddleware,updatePatientProfile);

router.post("/appointments/:appointmentId/review",authMiddleware,createReview);

export default router;