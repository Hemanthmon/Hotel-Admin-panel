import express from 'express';
import { createOrder, verifyPayment, getCompletedPayments, getFailedPayments, getPendingPayments } from '../controllers/paymentController.js';
import { verifyUser } from '../middlewares/authUser.js';

const router = express.Router();

//Route to create a Razorpay order
router.post('/create-order', verifyUser, createOrder);
//Route to verify payment signature
router.post('/verify-payment', verifyUser, verifyPayment);

router.get('/payments/pending', verifyUser, getPendingPayments);
router.get('/payments/completed', verifyUser, getCompletedPayments);
router.get('/payments/failed', verifyUser, getFailedPayments);


export default router;