import jwt from 'jsonwebtoken';

const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   //admin role check
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.user = decoded;
    next();

  } catch (error) {
     console.log(error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

export default verifyAdminToken ;