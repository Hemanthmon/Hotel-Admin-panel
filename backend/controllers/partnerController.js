import Partner from "../models/partner.js";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";

export const createPartner = async (req, res) => {
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

        // check if partner with same email or phone exists
        const partnerExists = await Partner.findOne({ $or: [{ email }, { phone }] });
        if (partnerExists) {
            return res.status(400).json({
                success: false,
                message: partnerExists.email === email
                    ? "Email already registered"
                    : "Phone number already registered"
            });
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create and save partner 
        const newPartner = new Partner({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        await newPartner.save();

        //generate token and set cookies
        const token = jwt.sign({ id: newPartner._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        //send response
        res.status(201).json({
            success: true,
            message: "Partner created successfully",
            partner: {
                _id: newPartner._id,
                name: newPartner.name,
                email: newPartner.email,
                phone: newPartner.phone,
            }
        });

    } catch (error) {
        console.error("Error in creating partner", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const loginPartner = async (req, res) => {
    // Add logic to sign in a partner
    const {emailOrPhone, password} = req.body;

    try {
        if(!emailOrPhone || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all the fields' });
        }

        let partner = null;

        //Handle Email login
        if (validator.isEmail(emailOrPhone)) {
            partner = await Partner.findOne({ email: emailOrPhone });
            if(!partner){
                return res.status(400).json({ success: false, message: 'Partner does not exist' });
            }
        }
        //Handle Phone login
        else if(validator.isMobilePhone(emailOrPhone, "any", { strictMode: false })) {
            partner = await Partner.findOne({ phone: emailOrPhone });
            if(!partner){
                return res.status(400).json({ success: false, message: 'Partner does not exist' });
            }
        }
        //Invalid input
        else {
            return res.status(400).json({ success: false, message: 'Invalid email or phone number' });
        }
        //password check
        const isMatch = await bcrypt.compare(password, partner.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }

        // Generate token and respond
      generateTokenAndSetCookies(res, partner._id);
        res.status(200).json({
            success: true,
            message: "Partner logged in successfully",
            partner: {
                _id: partner._id,
                name: partner.name,
                email: partner.email,
                phone: partner.phone,
                created_at: partner.createdAt,
            }
        });
    } catch (error) {
        console.error("Error in partner login", error.message);
        res.status(500).json({ success: false, message: "Error in partner login" });
    }

};


