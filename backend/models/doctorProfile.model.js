import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required: [true,"doctor profile is required"],
      unique: true
     },
  specialization: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'ServiceCategory',
      required: [true,"specialization is required"]
     },
  qualifications: [
    { type: String ,
      minlength:[2,"qualification must be atleast 2 characters long"],
      maxlength:[100,"qualification must not be longer than 100 characters"]
    }
 ],
  experienceYears: { 
    type: Number,
     required:[true,"experience years is required"],
     min:[0,"experience must be non-negative"],
     max:[70,"experience cannot be more than 70"]
     },
  consultationFee: {
     type: Number, 
     required: [true,"consultation fee is required"],
      min:[0,"slot duration must be non-negative"]
     },

  clinicAddress: {
  street: {
    type: String,
    required: [true, "Street address is required"],
    minlength: [3, "Street address must be at least 3 characters long"],
    maxlength: [100, "Street address cannot exceed 100 characters"]
  },
  city: {
    type: String,
    required: [true, "City is required"],
    minlength: [2, "City name must be at least 2 characters long"],
    maxlength: [50, "City name cannot exceed 50 characters"]
  },
  state: {
    type: String,
    required: [true, "State is required"],
    minlength: [2, "State name must be at least 2 characters long"],
    maxlength: [50, "State name cannot exceed 50 characters"]
  },
  pincode: {
    type: String,
    required: [true, "Pincode is required"],
    minlength: [6, "Pincode must be at least 6 characters"], 
    maxlength: [10, "Pincode cannot exceed 10 characters"]
  }
},
  bio: {
     type: String,
     maxlength:[500,"bio must be 500 characters"]
     },
  isPublished: {
     type: Boolean,
      default: true 
    },
  averageRating: {
     type: Number,
      default: 0
     },
  totalReviews: {
     type: Number,
      default: 0 
    }
},{
    timestamps:true
});

export const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);