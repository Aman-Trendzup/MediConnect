import mongoose from "mongoose";

async function connectDB(){
  if(!process.env.MONGO_URI){
    throw new Error("MONGODB URI is not defined in env")
  }
  try {
       await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
       console.log("Error connecting to database");
       process.exit(1);
  }


}

export default connectDB;