import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email :{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum : ['admin', 'staff'],
        default:'admin',
    },
}, { timestamps: true }); 

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
