import { DoctorApplication } from "../models/doctorApplication.model.js";
import {Appointment} from "../models/appointment.model.js";
import {DoctorProfile} from "../models/doctorProfile.model.js"
import { BlockedSlot } from "../models/blockedSlot.model.js";
import {AvailabilitySchedule} from "../models/availabilitySchedule.model.js"

//POST /doctor/application
export const submitApplication = async (req, res) => {
  try {
    const { 
      specialization, 
      experienceYears, 
      consultationFee,
      qualifications 
    } = req.body;

    const userId = req.user.id;

    let clinicAddress = req.body.clinicAddress;
    
    if (typeof clinicAddress === 'string') {
      try {
        clinicAddress = JSON.parse(clinicAddress);
      } catch (e) {
        clinicAddress = {};
      }
    }

    if (!clinicAddress || !clinicAddress.street) {
      clinicAddress = {
        street: req.body["clinicAddress.street"] || req.body["clinicAddress[street]"],
        city: req.body["clinicAddress.city"] || req.body["clinicAddress[city]"],
        state: req.body["clinicAddress.state"] || req.body["clinicAddress[state]"],
        pincode: req.body["clinicAddress.pincode"] || req.body["clinicAddress[pincode]"]
      };
    }

    let formattedQualifications = qualifications;
    if (typeof qualifications === 'string') {
      try {
        formattedQualifications = JSON.parse(qualifications);
      } catch (e) {
        formattedQualifications = [qualifications];
      }
    }
    if (!Array.isArray(formattedQualifications)) {
      formattedQualifications = [formattedQualifications];
    }

    const verificationDocuments = req.files ? req.files.map(file => file.path) : [];

    const newApplication = await DoctorApplication.create({
      user: userId,
      specialization,
      qualifications: formattedQualifications,
      experienceYears: Number(experienceYears),
      consultationFee: Number(consultationFee),
      clinicAddress,
      verificationDocuments
    });

    return res.status(201).json({
      success: true,
      message: "Doctor application submitted successfully",
      newApplication
    });

  } catch (error) {
    console.log("Error submitting application:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while submitting application"
    });
  }
};

//GET /doctor/application-status
export const checkApplicationStatus = async (req, res) => {
  try {
    const application = await DoctorApplication.findOne({ user: req.user.id });

    if (!application) {
      return res.status(200).json({
        success: true,
        status: "not_submitted",
        message: "You have not submitted a doctor application yet"
      });
    }

    return res.status(200).json({
      success: true,
      status: application.status, 
      rejectionReason: application.rejectionReason || null,
      correctionReason: application.correctionReason || null,
      submittedAt: application.submittedAt || application.createdAt,
      updatedAt: application.updatedAt
    });

  } catch (error) {
    console.log("Error checking application status:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while checking application status"
    });
  }
};

//GET /doctor/profile
export const getDoctorProfile = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId })
      .populate('user', 'name email phone') 
      .populate('specialization', 'name description'); 

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor profile fetched successfully",
      doctorProfile 
    });

  } catch (error) {
    console.log("Error fetching doctor profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching profile"
    });
  }
};

//POST /doctor/profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const { 
      specialization, 
      qualifications, 
      experienceYears, 
      consultationFee, 
      clinicAddress, 
      bio,
      isPublished 
    } = req.body;

    // Find the doctor profile associated with the currently logged-in user
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user"
      });
    }

    // Build update payload dynamically to only update provided fields
    const updateData = {};

    if (specialization !== undefined) updateData.specialization = specialization;
    if (experienceYears !== undefined) updateData.experienceYears = Number(experienceYears);
    if (consultationFee !== undefined) updateData.consultationFee = Number(consultationFee);
    if (bio !== undefined) updateData.bio = bio;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    // Handle qualifications array if passed
    if (qualifications !== undefined) {
      let parsedQualifications = qualifications;
      if (typeof qualifications === 'string') {
        try {
          parsedQualifications = JSON.parse(qualifications);
        } catch (e) {
          parsedQualifications = qualifications.split(',').map(q => q.trim());
        }
      }
      updateData.qualifications = parsedQualifications;
    }

    // Handle clinicAddress object mapping/merging
    if (clinicAddress !== undefined) {
      let parsedAddress = clinicAddress;
      if (typeof clinicAddress === 'string') {
        try {
          parsedAddress = JSON.parse(clinicAddress);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid clinic address format. Please provide valid JSON"
          });
        }
      }

      updateData.clinicAddress = {
        street: parsedAddress.street ?? doctorProfile.clinicAddress.street,
        city: parsedAddress.city ?? doctorProfile.clinicAddress.city,
        state: parsedAddress.state ?? doctorProfile.clinicAddress.state,
        pincode: parsedAddress.pincode ?? doctorProfile.clinicAddress.pincode,
      };
    }

    const updatedProfile = await DoctorProfile.findOneAndUpdate(
      { user: req.user.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('specialization', 'name description'); 
    return res.status(200).json({
      success: true,
      message: "Doctor profile successfully updated",
      updatedProfile
    });

  } catch (error) {
    console.log("Error updating doctor profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while updating profile"
    });
  }
};

//GET /doctor/dashboard-stats
export const getDoctorDashboardStats = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId })
      .populate('specialization', 'name description');

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user"
      });
    }

    const doctorId = doctorProfile._id;

    const [
      totalAppointments,
      pendingAppointmentsCount,
      acceptedAppointmentsCount,
      completedAppointmentsCount,
      cancelledAppointmentsCount,
      recentAppointments,
      availabilitySchedules,
      blockedSlots,
    ] = await Promise.all([
      Appointment.countDocuments({ doctor: doctorId }),
      Appointment.countDocuments({ doctor: doctorId, status: 'pending' }),
      Appointment.countDocuments({ doctor: doctorId, status: 'accepted' }),
      Appointment.countDocuments({ doctor: doctorId, status: 'completed' }),
      Appointment.countDocuments({ doctor: doctorId, status: 'cancelled' }),
      Appointment.find({ doctor: doctorId })
        .populate('patient', 'name email phone')
        .sort({ appointmentDate: -1 })
        .limit(5),
      AvailabilitySchedule.find({ doctor: doctorId }),
      BlockedSlot.find({ doctor: doctorId, date: { $gte: new Date() } }).sort({ date: 1 }),

    ]);

    // Assemble final dashboard payload
    const dashboardData = {
      profile: {
        isPublished: doctorProfile.isPublished,
        consultationFee: doctorProfile.consultationFee,
        experienceYears: doctorProfile.experienceYears,
        averageRating: doctorProfile.averageRating,
        totalReviews: doctorProfile.totalReviews,
        specialization: doctorProfile.specialization,
      },
      counts: {
        totalAppointments,
        pendingAppointments: pendingAppointmentsCount,
        acceptedAppointments: acceptedAppointmentsCount,
        completedAppointments: completedAppointmentsCount,
        cancelledAppointments: cancelledAppointmentsCount,
        activeAvailabilityDays: availabilitySchedules.filter(s => s.isAvailable).length,
        upcomingBlockedSlots: blockedSlots.length
      },
      recentAppointments,
      availabilitySchedules,
      upcomingBlockedSlots: blockedSlots
    };

    return res.status(200).json({
      success: true,
      message: "Doctor dashboard statistics fetched successfully",
      dashboardData
    });

  } catch (error) {
    console.log("Error fetching doctor dashboard stats:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching dashboard statistics"
    });
  }
};

//POST /doctor/schedule
export const setAvailability = async (req, res) => {
  try {
    const { schedules } = req.body;

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Schedules array is required"
      });
    }

    // Find the doctor profile 
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user"
      });
    }

    const savedSchedules = [];
    for (const item of schedules) {
      const { dayOfWeek, startTime, endTime, slotDurationMinutes, isAvailable } = item;

      if (!dayOfWeek || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: `Day of week, start time, and end time are required for ${dayOfWeek || 'each day'}`
        });
      }

      const schedule = await AvailabilitySchedule.findOneAndUpdate(
        { doctor: doctorProfile._id, dayOfWeek },
        { 
          doctor: doctorProfile._id,
          startTime, 
          endTime, 
          ...(slotDurationMinutes !== undefined && { slotDurationMinutes }),
          ...(isAvailable !== undefined && { isAvailable })
        },
        { new: true, upsert: true, runValidators: true }
      );

      savedSchedules.push(schedule);
    }

    return res.status(200).json({
      success: true,
      message: "Availability schedules saved successfully",
      schedules: savedSchedules
    });
  } catch (error) {
    console.log("Error setting availability:", error.message);
    return res.status(400).json({
      success: false,
      message:"Validation error while setting availability"
    });
  }
};

//GET /doctor/schedule
export const getAvailability = async (req, res) => {
  try {
    // Find the doctor profile associated with the currently logged-in user
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user"
      });
    }

    const schedules = await AvailabilitySchedule.find({ doctor: doctorProfile._id })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched availability schedules",
     schedules
    });
  } catch (error) {
    console.log("Error fetching availability:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching availability"
    });
  }
};

//GET /doctor/appointments
export const getAllAppointments = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user"
      });
    }

    const { status } = req.query; 
    const query = { doctor: doctorProfile._id };
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1 });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched doctor appointments",
      appointments
    });
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching appointments"
    });
  }
};

 //GET /doctor/pending-appointments
export const getAppointmentRequests=async(req,res)=>{
   try {
   const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user"
      });
    }

    const requests = await Appointment.find({ 
      doctor: doctorProfile._id, 
      status: 'pending' 
    })
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched pending appointment requests",
      data: requests
    });

     } catch (error) {
        console.log(error.message);
         return res.status(500).json({
            success:false,
            message:"an error occured during fetching appointment requests"
        })
     }
}

//PATCH /doctor/appointments/:id/status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status, cancellationReason } = req.body;

    const validStatuses = ['pending', 'accepted', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value provided"
      });
    }

    // If cancelling, ensure a cancellation reason is provided
    if (status === 'cancelled' && !cancellationReason) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is mandatory when rejecting or cancelling an appointment"
      });
    }

    const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    const appointment = await Appointment.findOne({ _id: id, doctor: doctorProfile._id });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or unauthorized"
      });
    }

    // Update appointment attributes
    appointment.status = status;
    if (status === 'cancelled') {
      appointment.cancellationReason = cancellationReason;
    } else {
      appointment.cancellationReason = null; 
    }

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: `Appointment status successfully updated to ${status}`,
     appointment
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while updating appointment"
    });
  }
};

//GET /doctor/appointments/:id
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user"
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      doctor: doctorProfile._id
    }).populate('patient', 'name email'); 

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or you do not have permission to view it"
      });
    }

    return res.status(200).json({
      success: true,
      appointment
    });

  } catch (error) {
    console.log("Error fetching appointment details:", error.message);
    
    // Handle invalid MongoDB ObjectId casting errors gracefully
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching appointment details"
    });
  }
};

//POST /doctor/blocked-slot
export const createBlockedSlot = async (req, res) => {
  try {
    const { date, reason } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required to block a slot"
      });
    }

    // Find the doctor profile associated with the currently logged-in user
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user"
      });
    }

    // Normalize date to remove time interference if needed, or parse directly
    const targetDate = new Date(date);

    // Check if this date is already blocked by the doctor
    const existingBlock = await BlockedSlot.findOne({ 
      doctor: doctorProfile._id, 
      date: targetDate 
    });

    if (existingBlock) {
      return res.status(400).json({
        success: false,
        message: "This date is already blocked"
      });
    }

    const blockedSlot = await BlockedSlot.create({
      doctor: doctorProfile._id,
      date: targetDate,
      reason: reason || "Unavailable"
    });

    return res.status(201).json({
      success: true,
      message: "Slot/Date successfully blocked",
      blockedSlot
    });
  } catch (error) {
    console.log("Error creating blocked slot:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while blocking slot"
    });
  }
};

//GET /doctor/blocked-slots
export const getBlockedSlots = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user."
      });
    }

    // Fetch future or all blocked dates sorted by date
    const blockedSlots = await BlockedSlot.find({ doctor: doctorProfile._id })
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched blocked slots",
      blockedSlots
    });
  } catch (error) {
    console.log("Error fetching blocked slots:", error.message);
    return res.status(500).json({
      success: false,
      message:  "Internal Server Error while fetching blocked slots"
    });
  }
};

//DELETE /doctor/blocked-slot
export const deleteBlockedSlot = async (req, res) => {
  try {
    const { id } = req.params; 

    const doctorProfile = await DoctorProfile.findOne({ user: req.user.userId });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user"
      });
    }

    const blockedSlot = await BlockedSlot.findOneAndDelete({ 
      _id: id, 
      doctor: doctorProfile._id 
    });

    if (!blockedSlot) {
      return res.status(404).json({
        success: false,
        message: "Blocked slot not found or unauthorized"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blocked slot successfully removed",
      blockedSlot
    });
  } catch (error) {
    console.log("Error deleting blocked slot:", error.message);
    return res.status(500).json({
      success: false,
      message:  "Internal Server Error while unblocking slot"
    });
  }
};