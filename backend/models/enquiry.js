import mongoose from "mongoose";

const enqueySchema = new mongoose.Schema.EventEmitter({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    property_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    check_in_date: {
        type: Date,
        required: true
    },
    check_out_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    message : {
        type: String,
        required: true
    },
},{ timestamps: true });

const Enquiry = mongoose.model("Enquiry", enqueySchema);
export default Enquiry;