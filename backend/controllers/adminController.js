//Models
import Admin from "../models/admin.js";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";

//Admin registration
export const createAdmin = async(req, res) => {
    const {name, email, password, role} = req.body;
    try{
       //Validate 
       if(!name || !email || !password || !role){
            return res.status(400).json({message:'Please fill all the fields'});
        }
        //validate email 
        if(!validator.isEmail(email)){
            return res.status(400).json({ success: false, message:'Please enter a valid email'});
        }
        //check if admin already exists
        const existingAdmin = await Admin.findOne({email});
        console.log("Admin already exists",existingAdmin);
        if(existingAdmin){
            return res.status(400).json({success: false, message:'Admin already exists'});
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            name,
            email,
            password:hashedPassword,
            role,
        });

        await newAdmin.save();

        generateTokenAndSetCookies(res, newAdmin._id);

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin:{
                _id:newAdmin._id,
                name:newAdmin.name,
                email:newAdmin.email,
                role:newAdmin.role,
                created_at:newAdmin.createdAt,
            }
        });

    }catch(error){
        console.error("Error in creating admin", error);
        res.status(400).json({ success: false, message:error.message});
    }
}

export const loginAdmin = async(req, res) => {
    const {email, password} = req.body;
    try{
        //Validate 
        if(!email || !password){
            return res.status(400).json({ success: false, message:'Please fill all the fields'});
        }
        //validate email 
        if(!validator.isEmail(email)){
            return res.status(400).json({ success: false, message:'Please enter a valid email'});
        }
        //check if admin already exists
        const existingAdmin = await Admin.findOne({email});
        console.log("Admin already exists",existingAdmin);
        if(!existingAdmin){
            return res.status(400).json({success: false, message:'Admin does not exist'});
        }
        
        //compare password
        const isMatch = await bcrypt.compare(password, existingAdmin.password);
        if(!isMatch){
            return res.status(400).json({success: false, message:'Invalid credentials'});
        }
        //Generate token and set cookies    
        generateTokenAndSetCookies(res, existingAdmin._id);

        res.status(200).json({
            success: true,
            message: 'Admin logged in successfully',
            admin:{
                _id:existingAdmin._id,
                name:existingAdmin.name,
                email:existingAdmin.email,
                role:existingAdmin.role,
                created_at:existingAdmin.createdAt,
            }
        });

    }catch(error){
        console.error("Error in admin login", error);
        res.status(400).json({ success: false, message:error.message});
    }
}