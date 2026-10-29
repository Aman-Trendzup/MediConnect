import {User} from "../models/user.model.js";
import {DoctorApplication} from "../models/doctorApplication.model.js";
import {Appointment} from "../models/appointment.model.js";
import {Service} from "../models/service.model.js"
import { AuditLog } from "../models/auditLog.model.js";
import { DoctorProfile } from "../models/doctorProfile.model.js";
import { logAdminAction } from "../utils/auditLogger.js";


//GET /api/admin/dashboard-stats
export const getAdminDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalDoctors,
            totalPatients,
            totalApplications,
            pendingApplications,
            approvedApplications,
            rejectedApplications,
            needsCorrectionApplications,
            totalAppointments,
            totalCategories,
            recentAppointments,
            recentAuditLogs
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'doctor' }),
            User.countDocuments({ role: 'patient' }),
            DoctorApplication.countDocuments(),
            DoctorApplication.countDocuments({ status: 'pending' }),
            DoctorApplication.countDocuments({ status: 'approved' }),
            DoctorApplication.countDocuments({ status: 'rejected' }),
            DoctorApplication.countDocuments({ status: 'needs_correction' }),
            Appointment.countDocuments(),
            Service.countDocuments(),
            
            // Fetch 5 latest appointments with nested doctor user population
            Appointment.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('patient', 'name email')
                .populate({
                    path: 'doctor',
                    populate: {
                        path: 'user', // Pulls name and email from the underlying User document linked to the DoctorProfile
                        select: 'name email'
                    }
                }),

            // Fetch 5 latest audit logs
            AuditLog.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'name email role')
        ]);

        return res.status(200).json({
            success: true,
            message: "successfully fetched admin dashboard stats",
            data: {
                counts: {
                    totalUsers,
                    totalDoctors,
                    totalPatients,
                    applications: {
                        total: totalApplications,
                        pending: pendingApplications,
                        approved: approvedApplications,
                        rejected: rejectedApplications,
                        needs_correction: needsCorrectionApplications
                    },
                    totalAppointments,
                    totalCategories
                },
                recentAppointments,
                recentAuditLogs
            }
        });
    } catch (error) {
        console.error("an error occured when fetching admin dashboard stats:", error); 
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error while fetching admin dashboard stats"
        });
    }
};

//GET /api/admin/doctor-applications
export const getDoctorApplications = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    // If a status query is provided 
    if (status && status !== 'all') {
      const validStatuses = ['pending', 'approved', 'rejected', 'needs_correction'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter provided."
        });
      }
      query.status = status;
    }

    const applications = await DoctorApplication.find(query)
      .populate('user', 'name email')
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      message: status ? `Successfully fetched ${status} applications.` : "Successfully fetched all doctor applications.",
      count: applications.length,
      applications
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false, 
      message: "An error occurred while fetching doctor applications."
    });
  }
};
 
  //GET /api/admin/applications/:id
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await DoctorApplication.findById(id)
      .populate('user', 'name email phone status')
      .populate('specialization', 'name description');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Doctor application not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching application details"
    });
  }
};

//PATCH /api/admin/applications/:id/review
export const doctorApplicationReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, correctionReason } = req.body;
    
    const validStatuses = ['approved', 'rejected', 'needs_correction'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either approved, rejected, or needs_correction"
      });
    }

    // Needs rejectionReason if status is rejected
    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is mandatory when an application is rejected"
      });
    }

    // Needs correctionReason if status is needs_correction
    if (status === 'needs_correction' && !correctionReason) {
      return res.status(400).json({
        success: false,
        message: "Correction reason is mandatory when requesting corrections"
      });
    }

    const application = await DoctorApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Doctor application not found"
      });
    }

    // Update application status 
    application.status = status;
    
    if (status === 'rejected') {
      application.rejectionReason = rejectionReason;
      application.correctionReason = undefined;
    } else if (status === 'needs_correction') {
      application.correctionReason = correctionReason;
      application.rejectionReason = undefined;
    } else {
      // approved
      application.rejectionReason = undefined;
      application.correctionReason = undefined;
    }

    await application.save();

    // If status is approved, upgrade user role AND create DoctorProfile
    if (status === 'approved') {
      await User.findByIdAndUpdate(application.user, { role: 'doctor' });

      // Check if a DoctorProfile already exists for this user to avoid duplicate creation errors
      const existingProfile = await DoctorProfile.findOne({ user: application.user });
      
      if (!existingProfile) {
        await DoctorProfile.create({
          user: application.user,
          specialization: application.specialization,
          qualifications: application.qualifications || [],
          experienceYears: application.experienceYears,
          consultationFee: application.consultationFee,
          clinicAddress: application.clinicAddress,
          bio: application.bio || '',
          isPublished: true
        });
      }
    }  
   
    // Audit log 
    await logAdminAction({
      user: req.user.userId,
      action: `DOCTOR APPLICATION ${status.toUpperCase()}`,
      targetModel: 'DoctorApplication',
      target: application._id,
    });

    return res.status(200).json({
      success: true,
      message: `Doctor application status updated to ${status} successfully`,
      application
    });

  } catch (error) {
    console.error("Error reviewing doctor application:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while reviewing the doctor application",
    });
  }
};

//GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    const filter = {};

    //filter by role
    if (role && role !== 'all') {
      const validRoles = ['patient', 'doctor', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role filter provided."
        });
      }
      filter.role = role;
    }

    if (status && status !== 'all') {
      const validStatuses = ['active', 'inactive', 'suspended', 'blocked'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter provided."
        });
      }
      filter.status = status;
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: role ? `Successfully fetched ${role}s.` : "Successfully fetched all users.",
      count: users.length,
      users
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false, 
      message: "An error occurred while fetching users.",
    });
  }
};
 
  //GET /api/admin/users/:id
  export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id); 
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let doctorApplication = null;
    if (user.role === 'doctor') {
      doctorApplication = await DoctorApplication.findOne({ user: id }).populate('specialization');
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
        doctorApplication: doctorApplication
      }
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching user details"
    });
  }
};

//DELETE /api/admin/users/:id
  export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user doesn't exist"
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Action prohibited: You cannot delete an admin account"
      });
    }

    //  role-specific cleanup 
    if (user.role === 'doctor') {
      await DoctorApplication.findOneAndDelete({ user: id });
      await Appointment.findOneAndDelete({user:id});
    }
     else if (user.role === 'patient') {
        await Appointment.findOneAndDelete({user:id});
    }

    await User.findByIdAndDelete(id);
     

       //audit log 
    await logAdminAction({
      user: req.user.userId,
      action: "USER DELETED",
      targetModel: 'User',
      target: user._id,
    });

    return res.status(200).json({
      success: true,
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} account deleted successfully`
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while deleting user account"
    });
  }
};

//PATCH /api/admin/users/:id/status
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive', 'suspended', 'blocked'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be active, inactive, suspended or blocked'
      });
    }

    // Find user and update status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Audit log 
    await logAdminAction({
      user: req.user.userId, 
      action: `USER STATUS UPDATED TO ${status.toUpperCase()}`,
      targetModel: 'User',
      target: updatedUser._id, 
    });

    return res.status(200).json({
      success: true,
      message: `User status successfully updated to ${status}`,
      updatedUser
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating user status",
    });
  }
};

//GET /api/admin/appointments
export const getAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      count: appointments.length,
      data: appointments
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching appointments",
    });
  }
};

//POST  /api/admin/service-category
export const createServiceCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Service category name is required"
      });
    }

    const existingService = await Service.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: "A service category with this name already exists"
      });
    }

    const newService = await Service.create({ name, description });
    
       // Audit log 
    await logAdminAction({
      user:  req.user.userId, 
      action: `SERVICE CATEGORY ${newService.name} CREATED`,
      targetModel: 'Service',
      target: newService._id, 
    });

    return res.status(201).json({
      success: true,
      message: "Service category created successfully",
      newService
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while creating service category",
    });
  }
};

//GET /api/admin/service-categories
export const getServiceCategories=async(req,res)=>{
    try {

        const services = await Service.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success:true,
            message:"service category fetched successfully",
            count: services.length,
         services
        })
    } catch (error) {
          return res.status(500).json({
            success:true,
            message:"an error occured while fetching service category"
        })
    } 
}

//GET /api/admin/service-category/:id
export const getServiceCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service category not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: service
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching service category",
    });
  }
};

//PUT /api/admin/service-category/:id
export const updateServiceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service category not found"
      });
    }
    
    // Audit log 
    await logAdminAction({
      user:  req.user.userId, 
      action: `SERVICE CATEGORY UPDATED to ${updatedService.name}`,
      targetModel: 'Service',
      target: updatedService._id, 
    });

    return res.status(200).json({
      success: true,
      message: "Service category updated successfully",
      updatedService
    });

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while updating service category",
    });
  }
};

//DELETE /api/admin/service-category/:id
export const deleteServiceCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service category not found"
      });
    }

          // Audit log 
    await logAdminAction({
      user:  req.user.userId, 
      action: `SERVICE CATEGORY ${deletedService.name} DELETED`,
      targetModel: 'Service',
      target: deletedService._id, 
    });

    return res.status(200).json({
      success: true,
      message: "Service category deleted successfully"
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while deleting service category"
    });
  }
};

//GET /api/admin/audit-logs
export const getAuditLogs = async (req, res) => {
  try {
  const logs = await AuditLog.find({})
      .populate('user', 'name email role') 
      .sort({ createdAt: -1 })             
      .limit(100);                         

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "an error occured while fetching audit logs"
    })
  }
}

