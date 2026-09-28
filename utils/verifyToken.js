import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  console.log("COOKIE HEADER:", req.headers.cookie);
  console.log("COOKIES:", req.cookies);

  if (!token) {
    return res.status(401).json({ msg: "Token missing", success: false });
  }

  jwt.verify(token, SECRET, (error, decoded) => {
    if (error) {
      console.log("Token verify error:", error);
      return res.status(403).json({
        msg: 'invalid token',
        success: false
      });
    }

    req.user = decoded;
    next();
  });
}

export default verifyToken;