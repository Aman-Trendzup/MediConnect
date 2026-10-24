import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required:[true,"user is required" ] 
    },
  title: { 
    type: String,
     required:[true,"title is required"] ,
     min:[2,"title must be atleast 2 character"]
     },
  message: {
     type: String,
      required:[true ,"message is required"] ,
      min:[2,"message must be atleast 2 character"]
    },
  isRead: {
     type: Boolean,
      default: false
     },
},{
    timestamp:true
});

export const Notification = mongoose.model('Notification', notificationSchema);