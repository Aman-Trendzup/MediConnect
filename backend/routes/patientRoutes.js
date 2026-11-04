import {
    getDoctors,
    getServices,
    getAllAppointments,
    bookAppointment,
    cancelAppointment,
    checkDoctorAvailability,
    getDoctorProfile,
    getPatientProfile,
    updatePatientProfile,
    createReview
} from "../controllers/patient.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";
import express from 'express';

const router=express.Router();

router.get("/doctors",getDoctors);

router.get("/services",getServices);

router.get("/appointments",authMiddleware,getAllAppointments);

router.post("/appointments/:doctorId",authMiddleware,bookAppointment);

router.patch("/appointments/:id/cancel",authMiddleware,cancelAppointment);

router.get("/doctors/:doctorId",authMiddleware,getDoctorProfile);

router.get("/doctors/:doctorId/availability",authMiddleware,checkDoctorAvailability);

router.get("/profile",authMiddleware,getPatientProfile);

router.patch("/profile",authMiddleware,updatePatientProfile);

router.post("/appointments/:appointmentId/review",authMiddleware,createReview);

export default router;