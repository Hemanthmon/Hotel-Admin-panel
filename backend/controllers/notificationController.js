import Notification from "../models/notification.js";

export const createNotification = async (req, res) => {
    const { title, message, user_id } = req.body;
    try {
        if (!title || !message || !user_id) {
            return res.status(400).json({ success: false, message: 'Please provide title, message, and user ID' });
        }

        const notification = new Notification({
            title,
            message,
            user_id
        });

        await notification.save();

         // ✅ Emit the new notification to all clients
         const io = req.app.get('io');
         io.emit('notification', notification); // You can also emit to a room based on user_id if needed
 

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            notification: notification
        });
    } catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({
            success: false,
            message: "Error creating notification",
            error: error.message
        });
    }
}

//get all notifications 
export const getAllNotifications = async (req, res) => {
    try {
// if you get any error look at this!!
        const notifications = await Notification.find().populate('user_id', 'name email phone').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            notifications: notifications
        });
    }catch(error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching notifications",
            error: error.message
        });
    }
}
export const getNotificationsForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const notifications = await Notification.find({ user_id: userId }).sort({ createdAt: -1 });

        if (notifications.length === 0) {
            return res.status(404).json({ success: false, message: 'No notifications found for this user' });
        }

        res.status(200).json({
            success: true,
            notifications: notifications
        });
    } catch (error) {
        console.error("Error fetching notifications for user:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching notifications for user",
            error: error.message
        });
    }
}

// Delete the notifcation 
export const deleteNotification = async (req, res) => {
    const { id } = req.params;

    try {
        
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting notification",
            error: error.message
        });
        
    }
}

