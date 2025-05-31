import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    booking_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    payment_method: {
        type: String,
        enum: ['razorpay', 'credit_card', 'debit_card', 'upi', 'netbanking'],
        required: true,
    },
    transaction_id: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
      },
      payment_status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'pending',
      },
      payment_date: {
        type: Date,
        default: Date.now,
      },
}, { timestamps: true });
const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;