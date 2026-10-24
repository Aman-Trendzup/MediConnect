import mongoose from "mongoose";

const availabilityScheduleSchema = new mongoose.Schema({
  doctor: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'DoctorProfile',
      required: [true,"doctor profile is required"]
     },
  dayOfWeek: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
    required: [true,"days of week is required" ]
  },
  startTime: { 
    type: String,
     required:[true,"start time is required"] ,
     match:[/^([0-1]?[0-9]|2?[0-3]):([0-5][0-9])$/,"enter a valid time"]
     }, 
  endTime: { 
    type: String, 
    required: [true,"end time is required"],
     match:[/^([0-1]?[0-9]|2?[0-3]):([0-5][0-9])$/,"enter a valid time"]
},  
  slotDurationMinutes: {
     type: Number, 
     default: 30,
     min:[5,"slot duration must be atleast 5 minutes"]
     },
  isAvailable: {
     type: Boolean,
      default: true 
    }
},
{
    timestamps:true
});


 export const AvailabilitySchedule=  mongoose.model('AvailabilitySchedule', availabilityScheduleSchema)

