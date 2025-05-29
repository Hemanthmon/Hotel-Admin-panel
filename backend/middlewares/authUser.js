//middleware for verify user
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

export const verifyUser = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Unauthorized - missing token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - invalid token"
            });
        }   

        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - user not found"
            });
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.error("Error in verifyUserToken", error.message);

        if(error.name === "TokenExpiredError"){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - token expired"
            });
        }

        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - invalid token"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error during token verification"
        });
    }
}