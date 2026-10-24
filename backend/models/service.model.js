import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name:{ 
    type: String, 
    required: [true,"service name is required"],
     unique: true ,
     minlength:[2,"service category must be more than 2 characters"],
      maxlength:[70,"service category cannot exceed 100 characters"]
    }, 
  description: { 
    type: String,
    maxlength:[500,"description must be 500 characters"]
},
  icon: {
     type: String 
    }, 
  isActive: { 
    type: Boolean, 
    default: true
 }
},
{
    timestamps:true
});

export const Service= mongoose.model('Service', serviceSchema);