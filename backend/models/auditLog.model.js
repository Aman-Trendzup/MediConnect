import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  user: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
       required: [true,"user is required"]
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
     }
},{
    timestamps:true
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);