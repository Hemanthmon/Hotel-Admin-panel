
import mongoose from "mongoose"; 


const partnerSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email : {
         type:String,
         required:true,
         unique:true,
         lowercase:true,
         trim:true,
    },
    phone : {
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
},{ timestamps: true });

const Partner = mongoose.model('Partner', partnerSchema);
export default Partner;