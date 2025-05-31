import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { verifyUser } from '../middlewares/authUser.js';

const router = express.Router();

//Route to create a Razorpay order
router.post('/create-order', verifyUser, createOrder);
//Route to verify payment signature
router.post('/verify-payment', verifyUser, verifyPayment);

export default router;