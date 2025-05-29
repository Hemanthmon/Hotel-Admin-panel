import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    Comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;