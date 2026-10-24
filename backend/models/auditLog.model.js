import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  admin: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
       required: [true,"admin is required"]
     },
  action: {
     type: String,
      required: [true,"action is required"]
     }, 
  targetModel: {
     type: String 
    }, 
  target: {
     type: mongoose.Schema.Types.ObjectId
     },
  details: {
     type: String 
    },
},{
    timestamps:true
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);