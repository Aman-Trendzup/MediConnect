import mongoose from 'mongoose';

const doctorApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User is required"]
  },
  specialization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, "Specialization is required"]
  },
  qualifications: [
    {
      type: String,
      required: [true, "Qualification is required"],
      minlength: [2, "Qualifications must be at least 2 characters long"] 
    }
  ],
  experienceYears: {
    type: Number,
    required: [true, "Experience years is required"],
    min: [0, "Experience must be non-negative"],
    max: [70, "Experience cannot be more than 70"],
  },
  consultationFee: {
    type: Number,
    required: [true, "Consultation fee is required"],
    min: [0, "Consultation fee must be non-negative"]
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
  verificationDocuments: [
    { type: String }
  ],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'needs_correction'], 
    default: 'pending'
  },
  rejectionReason: {
    type: String 
  },
  correctionReason: {
    type: String 
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const DoctorApplication = mongoose.model('DoctorApplication', doctorApplicationSchema);