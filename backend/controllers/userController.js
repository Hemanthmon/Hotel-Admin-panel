import User from "../models/user.js";


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";

export const createUser = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all the fields' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        if (!validator.isMobilePhone(phone, "any", { strictMode: false })) {
            return res.status(400).json({ success: false, message: "Invalid phone number" });
        }
        
        // check if user with same email or phone exists
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: userExists.email === email
                    ? "Email already registered"
                    : "Phone number already registered"
            });
        }


        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create and save user 
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        await newUser.save();

        //generate token and set cookies
        generateTokenAndSetCookies(res, newUser._id);

        //send response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                created_at: newUser.createdAt,
            },
        });
    } catch (error) {
        console.error("Error in registerUser:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const loginUser = async (req, res) => {
    const { emailOrPhone, password } = req.body;
  
    try {
      if (!emailOrPhone || !password) {
        return res.status(400).json({ success: false, message: "Please fill in all fields" });
      }
  
      let user = null;
  
      // Handle Email login
      if (validator.isEmail(emailOrPhone)) {
        user = await User.findOne({ email: emailOrPhone });
        if (!user) {
          return res.status(401).json({ success: false, message: "Email not found" });
        }
      }
      // Handle Phone login
      else if (validator.isMobilePhone(emailOrPhone, "any", { strictMode: false })) {
        user = await User.findOne({ phone: emailOrPhone });
        if (!user) {
          return res.status(401).json({ success: false, message: "Phone number not found" });
        }
      } 
      // Invalid input
      else {
        return res.status(400).json({ success: false, message: "Enter a valid email or phone number" });
      }
  
      // Password check
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }
  
      // Generate token and respond
      generateTokenAndSetCookies(res, user._id);
  
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          created_at: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Error in loginUser:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };