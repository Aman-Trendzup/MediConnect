import express from 'express';
import  {
     getAdminDashboardStats,
     getPendingApplications,
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
     deleteServiceCategory
    } from '../controllers/admin.controller.js';
import verifyAdminToken from '../middleware/verifyAdminToken.js';

const router = express.Router();

router.get("/dashboard-stats",verifyAdminToken,getAdminDashboardStats);

router.get("/pending-applications",verifyAdminToken,getPendingApplications);

router.get("/users",verifyAdminToken,getUsers);

router.get("/users/:id",verifyAdminToken,getUserById);

router.delete('/users/:id', verifyAdminToken, deleteUser);

router.get("/appointments",verifyAdminToken,getAppointments);

router.patch("/applications/:id/review",verifyAdminToken,doctorApplicationReview);

router.get("/applications/:id",verifyAdminToken,getApplicationById)

router.patch("/users/:id/status",verifyAdminToken,updateUserStatus);

router.post("/service-category",verifyAdminToken, createServiceCategory);

router.get("/service-categories",verifyAdminToken, getServiceCategories);

router.get("/serivce-category/:id",verifyAdminToken,getServiceCategoryById);

router.put("/service-category/:id",verifyAdminToken,updateServiceCategory);

router.delete("/service-category/:id",verifyAdminToken, deleteServiceCategory);


export default router;