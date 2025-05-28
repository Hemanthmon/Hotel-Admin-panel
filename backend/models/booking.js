import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    property_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
    },
    check_in_date: {
        type: Date,
        required: true,
    },
    check_out_date: {
        type: Date,
        required: true,
    },
    total_amount: {
        type: Number,
        required: true,
        min: 0
      },
    payement_status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    booking_status: {
        type: String,
        enum: ["confirmed", "cancelled", "completed", "pending"],
        default: "confirmed",
    },
    special_requests: {
        type: String,
        default: ''
      },
      guests: {
        type: Number,
        default: 1,
        min: 1
      }
},  { timestamps: true })
const Booking  = mongoose.model("Booking", bookingSchema);

export default Booking;
