import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    message: {
        type: String,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sent_at: {
        type: Date,
        default: Date.now,
    }
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;