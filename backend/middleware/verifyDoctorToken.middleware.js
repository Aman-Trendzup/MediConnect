import jwt from 'jsonwebtoken';
import { DoctorProfile } from '../models/doctorProfile.model.js';

 const verifyDoctorToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token or token invalid"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (decoded.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Doctor privileges required"
      });
    }

    const doctorProfile = await DoctorProfile.findOne({ user: decoded.userId });
    if (!doctorProfile) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Doctor profile not found or application not approved yet"
      });
    }

    req.user = decoded;
    req.doctorProfile = doctorProfile;
    
    next();

  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default verifyDoctorToken;