// routes/bookingRoutes.js
import express from "express";
import { createBooking, getCancelledBookings, getCompletedBookings, getPendingBookings } from "../controllers/bookingController.js";
import { verifyUser } from "../middlewares/authUser.js"; // ensure this path matches your project

const router = express.Router();

// @route POST /api/bookings
// @desc  Create a booking (requires user authentication)
router.post("/", verifyUser, createBooking);

router.get('/bookings/pending', verifyUser, getPendingBookings);
router.get('/bookings/completed', verifyUser, getCompletedBookings);
router.get('/bookings/cancelled', verifyUser, getCancelledBookings);

export default router;
