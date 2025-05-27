import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import Admin from "../models/admin.js";

dotenv.config();

export const verifyAdmin = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized- missing Token"
         });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized- invalid Token"
             });
        }
        //fetch admin from db
        const admin = await Admin.findById(decoded.id).select("-password");
        if(!admin) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized- admin not found"
             });
        }
        req.admin = admin;
        next();
    } catch (error){
        console.error("Error in verifyAdminToken", error.message);
            
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized- Token expired"
             });
        }

        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized- invalid Token"
             });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Server error during token verification"
         });
    }
}