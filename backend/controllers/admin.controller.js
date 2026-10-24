import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import {DoctorApplication} from "../models/doctorApplication.model.js";
import {Appointment} from "../models/appointment.model.js";
import {Service} from "../models/service.model.js"

//GET /api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password"
      });
    }

    // verify user is admin
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or unauthorized access"
      });
    }

    // Check account status 
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Admin account is currently ${user.status}`
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT token
    generateToken(res, user);

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during admin login",
    });
  }
};

//GET /api/admin/logout
export const adminLogout =async(req,res)=>{
       res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
       maxAge:0
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}

//GET /api/admin/dashboard-stats
export const getAdminDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalDoctors,
            totalPatients,
            pendingApplications,
            totalAppointments,
            totalCategories
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'doctor' }),
            User.countDocuments({ role: 'patient' }),
            DoctorApplication.countDocuments({ status: 'pending' }),
            Appointment.countDocuments(),
            Service.countDocuments()
        ]);

        return res.status(200).json({
            success: true,
            message: "successfully fetched admin dashboard stats",
            data: {
                totalUsers,
                totalDoctors,
                totalPatients,
                pendingApplications,
                totalAppointments,
                totalCategories
            }
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while fetching admin dashboard stats"
        });
    }

}

//GET /api/admin/pending-applications
  export const getPendingApplications = async(req,res)=>{
    try {
         const pendingApplications = await DoctorApplication.find({status:'pending'})
        .populate('user', 'name email')
        .sort({ submittedAt: -1 });

         if(!pendingApplications){
             return res.status(200).json({
            success:true,
            message:"there are no pending applications right now",
        })
         }

        return res.status(200).json({
            success:true,
            message:"successfully fetched pending application",
            count: pendingApplications.length,
            pendingApplications
        })
    } catch (error) {
        console.log(error.message);
          return res.status(500).json({
            success:true,
            message:"an error occured while fetching pending applications",
        })
    }
  }
 
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

    // needs rejectionReason if status is rejected
    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is mandatory when an application is rejected"
      });
    }

    // needs correctionReason if status is needs_correction
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
      //approved
      application.rejectionReason = undefined;
      application.correctionReason = undefined;
    }

    await application.save();

    // Automatically upgrade user role to doctor when application is approved
    if (status === 'approved') {
      await User.findByIdAndUpdate(application.user, { role: 'doctor' });
    }

    return res.status(200).json({
      success: true,
      message: `Doctor application status updated to ${status} successfully`,
      application
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while reviewing the doctor application",
    });
  }
};

//GET /api/admin/users
  export const getUsers = async(req,res)=>{
    try {
        const { role, status } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter)
      .sort({ createdAt: -1 });
         
        return res.status(200).json({
            success:true,
            message:"successfully fetched users",
           count: users.length,
           users
        })
    } catch (error) {
        console.log(error.message);
          return res.status(500).json({
            success:true,
            message:"an error occured while fetching users",
        })
    }
  }
 
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
  export const deleteUser= async (req, res) => {
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
export const updateUserStatus=async(req,res)=>{
    try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive', 'suspended', 'blocked'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'status must be active, inactive, suspended or blocked'
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

    return res.status(200).json({
      success: true,
      message: `User status successfully updated to ${status}`,
      data: updatedUser
    });
    } catch (error) {
           console.log(error.message);
          return res.status(500).json({
            success:true,
            message:"an error occured while updating user status",
        })
    }
}

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


