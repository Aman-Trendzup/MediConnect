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
      min:[2,"qualification must be atleast 2 characters long"],
      max:[100,"qualification must not be longer than 100 characters"]
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
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  bio: {
     type: String,
     max:[500,"bio must be 500 characters"]
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