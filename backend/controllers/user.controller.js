import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";



export const registerUser = async (req, res) => {
  try {
     const {name,email,password,role='patient'}=req.body;
     const existingUser= await User.findOne({email});

      if (!name || !email || !password ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
     if(existingUser){
        return res.status(400).json({
                success: false,
                message: "User already exists"
            });
     }

      const hashedPassword = await bcrypt.hash(password, 10);
     const user = await User.create({
      name,
      email,
      password:hashedPassword,
      role
     })
      
     generateToken(res,user);
    return res.status(200).json(
      {
        success: true,
        message: "User account successfully created",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        }
      });
     
  } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "an error occured during register user",
        });
  }
 
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email or password is incorrect",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Email or password is incorrect",
      });
    }

    generateToken(res, user);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
     console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "an error occured while logging in user",
    });
  }
};

export const logoutUser = async (_, res) => {
 
   res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
       maxAge:0
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
     console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user context",
    });
  }
};