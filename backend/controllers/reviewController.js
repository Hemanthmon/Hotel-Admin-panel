import Review from "../models/review.js"
import Booking from "../models/booking.js";
import Product from "../models/product.js";

export const createReview = async(rwq, res) => {
    try{
        const user_id = req.user._id; // Assuming user ID is available in req.user
        const { property_id, rating, comment } = req.body;  

        if(!rating || rating < 1 || rating > 5){
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        //check if user has a booking for this property
        const hasBooking = await Booking.findOne({
            user_id,
            property_id,
            booking_status: "completed"
        });
        if(!hasBooking){
            return res.status(403).json({
                success: false,
                message: "You can only review properties you have booked"
            });
        }
        //check if review already exists
        const existing = await Review.findOne({user_id, property_id});
        if(existing){
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this property"
            });
        }

        //create the review
        const review = new Review({
            user_id,
            property_id,
            rating,
            comment
        });
        await review.save();

    }catch(error){
        console.error("Error creating review:", error);
        res.status(500).json({
            success: false,
            message: "Error creating review",
            error: error.message
        });
    }
}

export const getReviewsForProperty = async(req, res) => {
    try{

        const { propertyId } = req.params;

        const reviews = await Review.find({ property_id: propertyId })
            .populate("user_id", "name email") // Populate user details
            .sort({ created_at: -1 }); // Sort by most recent first

            res.status(200).json({
                success: true,
                reviews: reviews
            });

    }catch(error){
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching reviews",
            error: error.message
        });
    }
}