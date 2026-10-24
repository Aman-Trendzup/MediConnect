import mongoose from 'mongoose';

const blockedSlotSchema = new mongoose.Schema({
  doctor: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'DoctorProfile', 
     required: [true,"doctor is required" ]
    },
  date: { 
    type: Date,
     required: [true,"date is required" ]
    },
  reason: {
     type: String 
    } 
},{
    timestamps:true
});

export const BlockedSlot = mongoose.model('BlockedSlot', blockedSlotSchema);