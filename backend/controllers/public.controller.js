import { Service } from "../models/service.model.js";
import { DoctorProfile } from "../models/doctorProfile.model.js";


export const getDoctors = async (req, res) => {
  try {
    const { specialization, experienceYears, consultationFee, clinicAddress, search } = req.query;
    const query = {};

    if (specialization) {
      if (mongoose.Types.ObjectId.isValid(specialization)) {
        query.specialization = specialization;
      } else {
        const matchingServices = await Service.find({
          name: { $regex: specialization, $options: "i" },
        }).select("_id");
        query.specialization = { $in: matchingServices.map((s) => s._id) };
      }
    }

    if (search) {
      const matchingServices = await Service.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");
      const serviceIds = matchingServices.map((s) => s._id);

      query.$or = [
        { specialization: { $in: serviceIds } },
        { "clinicAddress.street": { $regex: search, $options: "i" } },
        { "clinicAddress.city": { $regex: search, $options: "i" } },
        { "clinicAddress.state": { $regex: search, $options: "i" } },
      ];
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
      .populate({
        path: "specialization",
        select: "name description icon isActive", 
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      message: "successfully fetched doctors",
      doctors,
    });
  } catch (error) {
    console.log("error while fetching doctors", error.message);
    return res.status(500).json({
      success: false,
      message: "an error occurred while fetching doctors",
    });
  }
};

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