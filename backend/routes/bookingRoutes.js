// routes/bookingRoutes.js
import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { verifyUser } from "../middleware/verifyUser.js"; // ensure this path matches your project

const router = express.Router();

// @route POST /api/bookings
// @desc  Create a booking (requires user authentication)
router.post("/", verifyUser, createBooking);

export default router;
