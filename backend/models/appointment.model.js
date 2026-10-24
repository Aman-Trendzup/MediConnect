import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "patient is required"] 
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorProfile',
        required: [true, "doctor is required"]
    },
    appointmentDate: {
        type: Date,
        required: [true, "appointment date is required"]
    },
    timeSlot: {
        type: String,
        required: [true, "time slot is required"] 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'cancelled'],
        default: 'pending'
    },
    cancellationReason: {
        type: String,
        default: null
    },
    consultationFee: {
        type: Number,
        required: [true, "consultation fee is required"],
        min: [0, "consultation fee must be non-negative"]
    },
}, {
    timestamps: true
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);
