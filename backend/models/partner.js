
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
    documents: {
        aadhaar: { type: String }, // Cloudinary URL
        pan: { type: String },
        property_docs: [{ type: String }],
      },
      bank_details: {
        account_holder_name: { type: String },
        account_number: { type: String },
        ifsc_code: { type: String },
        bank_name: { type: String },
      },
      kyc_verified: {
        type: Boolean,
        default: false,
      }
},{ timestamps: true });

const Partner = mongoose.model('Partner', partnerSchema);
export default Partner;