import Razorpay from 'razorpay';
import Payment from '../models/payment.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

//Step 1: Create Razorpay order
export const createOrder = async (req, res) => {
    try {
        const { amount, currency = "INR", booking_id } = req.body;

        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency,
            receipt: `receipt_${booking_id}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount / 100, // Convert back to rupees
            currency: order.currency,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ success: false, message: "Payment order creation failed" });
        
    }
}

// Step 2: Verify payment signature
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            booking_id,
            user_id,
            amount,
        } = req.body;
    const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        // Save payment details in the database
        const payment = new Payment({
            user_id,
            booking_id,
            payment_method: 'razorpay',
            transaction_id: razorpay_payment_id,
            amount,
            payment_status: 'success',
        });

        await payment.save();

        res.status(200).json({ success: true, message: "Payment verified successfully", payment });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }
}