import express from 'express';
import  {
     getAdminDashboardStats,
     getDoctorApplications,
     getApplicationById,
     getUsers,
     getUserById,
     deleteUser,
     getAppointments,
     doctorApplicationReview,
     updateUserStatus,
     getServiceCategories,
     getServiceCategoryById,
     createServiceCategory,
     updateServiceCategory,
     deleteServiceCategory,
     getAuditLogs
    } from '../controllers/admin.controller.js';
import verifyAdminToken from '../middleware/verifyAdminToken.js';

const router = express.Router();

router.get("/dashboard-stats",getAdminDashboardStats);

router.get("/doctor-applications",getDoctorApplications);

router.get("/users",getUsers);

router.get("/users/:id",verifyAdminToken,getUserById);

router.delete('/users/:id', deleteUser);

router.get("/appointments",verifyAdminToken,getAppointments);

router.patch("/applications/:id/review",doctorApplicationReview);

router.get("/applications/:id",getApplicationById)

router.patch("/users/:id/status",updateUserStatus);

router.post("/service-category",verifyAdminToken, createServiceCategory);

router.get("/service-categories", getServiceCategories);

router.get("/serivce-category/:id",verifyAdminToken,getServiceCategoryById);

router.put("/service-category/:id",updateServiceCategory);

router.delete("/service-category/:id", deleteServiceCategory);

router.get("/audit-logs",getAuditLogs);

export default router;