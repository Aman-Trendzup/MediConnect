 import {User} from "../models/user.model.js";
 import {Appointment} from "../models/appointment.model.js";
 import { DoctorProfile } from "../models/doctorProfile.model.js";
 import {Review} from "../models/review.model.js";
 import { AvailabilitySchedule } from "../models/availabilitySchedule.model.js";
 import {Service} from "../models/service.model.js";
 import {BlockedSlot} from "../models/blockedSlot.model.js";


 export const getDoctors=async(req,res)=>{
    try {
          const {specialization, experienceYears, consultationFee, clinicAddress, search } = req.query;
          const query={};
          if (search) {
      query.$or = [
        { specialization: { $regex: search, $options: "i" } },
        { clinicAddress: { $regex: search, $options: "i" } },
      ];
    }

    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }

    if (experienceYears) {
      query.experienceYears = { $gte: Number(experienceYears) };
    }

    if (consultationFee) {
      query.consultationFee = { $lte: Number(consultationFee) };
    }

    if (clinicAddress) {
      query.clinicAddress = { $regex: clinicAddress, $options: "i" };
    }

    const doctors = await DoctorProfile.find(query)
      .populate({
        path: "user",
        select: "name email role status",
      })
      .sort({ createdAt: -1 });

        return res.status(200).json({
            success:true,
            count: doctors.length,
            message:"successfully fetched doctors",
            doctors
        })
    } catch (error) {
        console.log("error while fetching doctors",error.message);
        return res.status(500).json({
            success:false,
            message:"an error occured while fetching doctors"
        })
    }
}

export const getServices=async(req,res)=>{
   try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: `^${search}`, $options: "i" };
    }

    const services = await Service.find(query).sort({ createdAt: -1 }); 

        return res.status(200).json({
            success:true,
            message:"successfully fetched services",
            count:services.length,
            services
        })
    } catch (error) {
        console.log("error while fetching services",error.message);
        return res.status(500).json({
            success:false,
            message:"an error occured while fetching services"
        })
    }
}

export const bookAppointment = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { doctorId } = req.params; 
    const { appointmentDate, timeSlot} = req.body;

    if (!appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Appointment date and time slot are required",
      });
    }

    const doctorProfile = await DoctorProfile.findById(doctorId);
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const targetDate = new Date(appointmentDate);
    const isBlocked = await BlockedSlot.findOne({
      doctor: doctorId,
      date: targetDate,
    });

    if (isBlocked) {
      return res.status(400).json({
        success: false,
        message: "The doctor is unavailable on this date (Time-Off / Blocked)",
      });
    }

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: targetDate,
      timeSlot: timeSlot,
      status: { $ne: "cancelled" }, 
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked",
      });
    }
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      appointmentDate: targetDate,
      timeSlot,
      consultationFee: doctorProfile.consultationFee,
      status: "pending", 
    });

    return res.status(201).json({
      success: true,
      message: "Successfully booked appointment",
      appointment,
    });
  } catch (error) {
    console.log("Error while booking appointment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while booking appointment",
    });
  }
};

export const checkDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctorProfile = await DoctorProfile.findById(doctorId);

    if (!doctorProfile) {
      return res.status(400).json({
        success: false,
        message: "Doctor profile doesn't exist",
      });
    }

    const availabilitySchedule = await AvailabilitySchedule.find({ 
      doctor: doctorProfile._id 
    });

    const blockedSlots = await BlockedSlot.find({ 
      doctor: doctorProfile._id 
    }).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched doctor availability",
      availabilitySchedule,
      blockedSlots,
    });
  } catch (error) {
    console.error("Error while fetching doctor availability:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching doctor availability",
    });
  }
};

export const getDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctorProfile = await DoctorProfile.findById(doctorId)
    .populate( "user", "name email role status")
    .populate("specialization","name description");

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile doesn't exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetched doctor profile",
      doctorProfile,
    });
  } catch (error) {
    console.log("error while fetching doctor profile", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching doctor profile",
    });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;
    const appointments = await Appointment.find({ patient: patientId })
      .populate({
        path: "doctor",
        populate: [
          { path: "user", select: "name email" },
          { path: "specialization", select: "name" },
        ],
      })
      .sort({ appointmentDate: -1 }); 

    return res.status(200).json({
      success: true,
      message: "Successfully fetched appointments",
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.log("error while fetching appointments", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching appointments",
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { id } = req.params; 
    const { cancellationReason } = req.body;

    if (!cancellationReason || cancellationReason.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "A cancellation reason is mandatory to cancel an appointment",
      });
    }

    const appointment = await Appointment.findOne({ _id: id, patient: patientId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or you are not authorized to cancel it",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This appointment is already cancelled",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an appointment that has already been completed",
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        cancellationReason: cancellationReason.trim(),
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully cancelled appointment",
      updatedAppointment,
    });
  } catch (error) {
    console.error("error while cancelling appointment", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while cancelling appointment",
    });
  }
};

export const getPatientProfile = async (req, res) => {
  try {
   
    const patientId = req.user.id;
    const patientProfile = await User.findById(patientId);

    if (!patientProfile) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetched patient profile",
      patientProfile,
    });
  } catch (error) {
    console.log("error while fetching patient profile ", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching patient profile",
    });
  }
};

export const updatePatientProfile = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { name, email, phone } = req.body;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Patient ID not found in session",
      });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: patientId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account",
        });
      }
    }

    const updatedProfile = await User.findByIdAndUpdate(
      patientId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ); 

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Patient account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully updated patient profile",
      updatedProfile,
    });
  } catch (error) {
    console.log("error while updating patient profile ", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating patient profile",
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { appointmentId } = req.params; 
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: patientId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or you are not authorized to review it",
      });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can only leave a review for completed appointments",
      });
    }

    const existingReview = await Review.findOne({ appointment: appointmentId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this appointment",
      });
    }

    const review = await Review.create({
      patient: patientId,
      doctor: appointment.doctor, 
      appointment: appointmentId,
      rating,
      comment: comment ? comment.trim() : undefined, 
    });

    return res.status(201).json({
      success: true,
      message: "Successfully submitted review",
      review,
    });
  } catch (error) {
    console.log("Error while creating review:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the review",
    });
  }
};