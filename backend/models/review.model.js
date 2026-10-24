import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  patient: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
       required: [true,"patient is required" ]
    },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'DoctorProfile', 
     required:[true,"doctor profile is required" ] 
    },
  appointment: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'Appointment',
      required:[true,"appointment is required"] ,
       unique: true 
    },
  rating: {
     type: Number, 
     min:[1,"rating cannot be more than 1"] , 
     max: [5,"ratign cannot be more than 5"], 
     required: [true,"rating is required"]
     },
  comment: {
     type: String 
    },
},{
    timestamps:true
});

export const Review = mongoose.model('Review', reviewSchema);