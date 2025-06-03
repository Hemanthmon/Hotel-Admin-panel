// controllers/bookingController.js
import Booking from "../models/booking.js";
import Property from "../models/property.js";

export const createBooking = async (req, res) => {
  try {
    const { property_id, check_in_date, check_out_date, guests, special_requests } = req.body;
    const user_id = req.user._id; // assuming user is authenticated via middleware

    // ✅ Step 1: Basic date validation
    if (!check_in_date || !check_out_date || new Date(check_in_date) >= new Date(check_out_date)) {
      return res.status(400).json({ success: false, message: "Invalid check-in or check-out date." });
    }

    // ✅ Step 2: Find property
    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    if (property.requires_enquiry) {
      const approvedEnquiry = await Enquiry.findOne({
        user_id,
        property_id,
        check_in_date,
        check_out_date,
        status: 'approved'
      });
    
      if (!approvedEnquiry) {
        return res.status(403).json({ success: false, message: "You need approval to book this property." });
      }
    }
    

    // ✅ Step 3: Check availability
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const bookingDates = [];

    for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      bookingDates.push(dateStr);
    }

    const unavailable = property.availability_calendar.some(entry =>
      bookingDates.includes(new Date(entry.date).toISOString().split("T")[0]) &&
      !entry.is_available
    );

    if (unavailable) {
      return res.status(400).json({ success: false, message: "Selected dates are not available." });
    }

    // ✅ Step 4: Calculate total price
    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    const total_amount = property.price_per_night * nights;

    // ✅ Step 5: Create booking
    const booking = new Booking({
      user_id,
      property_id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      total_amount,
      guests: guests || 1,
      special_requests,
      payment_status: 'pending',
      booking_status: 'confirmed',
    });

    await booking.save();

    // ✅ Step 6: Update availability_calendar
    property.availability_calendar = property.availability_calendar.map(entry => {
      const entryDateStr = new Date(entry.date).toISOString().split("T")[0];
      if (bookingDates.includes(entryDateStr)) {
        return { ...entry._doc, is_available: false };
      }
      return entry;
    });

    await property.save();

    // ✅ Step 7: Respond to client
    res.status(201).json({
      success: true,
      message: "Booking successful!",
      booking,
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong.", error: error.message });
  }
};
// ✅ Get Pending Bookings
export const getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user_id: req.user._id,
      payment_status: 'pending',
    }).populate('property_id');
    
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching pending bookings' });
  }
};

// ✅ Get Completed Bookings
export const getCompletedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user_id: req.user._id,
      payment_status: 'completed',
    }).populate('property_id');

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching completed bookings' });
  }
};

// ✅ Get Cancelled Bookings
export const getCancelledBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user_id: req.user._id,
      booking_status: 'cancelled',
    }).populate('property_id');

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching cancelled bookings' });
  }
};