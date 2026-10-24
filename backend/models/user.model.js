import mongoose, { now } from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true,"name is required"],
    minlength:[2,"name must be longer than 2 characters"],
    maxlength:[60,"name must be shorter than 60 characters"]
},
  email: { 
    type: String,
     required: [true,"email is required"],
      unique: true, 
      lowercase: true ,
      match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Please enter a valid email"],
      maxlength:[100,"email must be shorter than 100 characters"]
    },
    phone: { 
    type: String,
      unique: true,
      minlength:[10,"phone number must be 10 characters"],
      maxlength:[10,"phone number must not be more than 10 characters"],
      match:[/^[6-9]\d{9}$/,"please enter a valid phone number"],
      sparse: true
  },
  password: { 
    type: String,
     required: [true,"password is required"],
     minlength:[8,"password must be atleast 8 characters long"],
     maxlength:[100,"password must be less than 100 characters"],
      select:false
     }, 
  role: { 
    type: String, 
    enum: ['admin', 'doctor', 'patient'], 
    required: [true,"role is required" ]
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended', 'blocked'], 
    default: 'active' 
  },
},
 {
     timestamps:true,
    }
);

 export const User = mongoose.model('User', userSchema);