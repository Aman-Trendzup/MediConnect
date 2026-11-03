import express from 'express';
import {
 getDoctorDashboardStats,
 submitApplication,
 checkApplicationStatus,
 setAvailability,
 getAvailability,
 getDoctorProfile,
 updateDoctorProfile,
 getAllAppointments,
 getAppointmentRequests,
 updateAppointmentStatus,
 getAppointmentById,
 createBlockedSlot,
 getBlockedSlots,
 deleteBlockedSlot
} from '../controllers/doctor.controller.js'; 

import { authMiddleware } from '../middleware/auth.middleware.js';
import  verifyDoctorToken  from '../middleware/verifyDoctorToken.middleware.js';
import {uploadVerificationDocs} from '../middleware/upload.middleware.js';

const router=express.Router();

router.post("/application",authMiddleware,uploadVerificationDocs.array('documents', 5),submitApplication);

router.get("/application-status",authMiddleware,checkApplicationStatus);

router.get("/dashboard",verifyDoctorToken,getDoctorDashboardStats);

router.get("/profile",verifyDoctorToken,getDoctorProfile);

router.post("/profile",verifyDoctorToken,updateDoctorProfile);

router.post("/schedule",verifyDoctorToken,setAvailability);

router.get("/schedule",verifyDoctorToken,getAvailability);

router.get("/appointments",verifyDoctorToken,getAllAppointments);

router.get("/pending-appointments",verifyDoctorToken,getAppointmentRequests);

router.patch('/appointments/:id/status',verifyDoctorToken,updateAppointmentStatus);

router.get('/appointments/:id',verifyDoctorToken,getAppointmentById);

router.post('/blocked-slot',verifyDoctorToken,createBlockedSlot);

router.get('/blocked-slots',verifyDoctorToken,getBlockedSlots);

router.delete('/blocked-slot/:id',verifyDoctorToken,deleteBlockedSlot);

export default router;