import mongoose from "mongoose";

const bookingSchema = new mongoose.SchemaType({
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
    total_amount: {
        type: Number,
        required: true
    },
    payment_status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    booking_status: {
        type: String,
        enum: ["confirmed", "cancelled", "completed", "pending"],
        default: "confirmed"
    },
    special_requests: {
        type: String,
        default: ""
    },
    guests: {
        type: Number,
        default: 1,
    },
})