import express from 'express';

import {
    createNotification,
    getAllNotifications,
    getNotificationsForUser,
    deleteNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

// Create a new notification
router.post('/', createNotification);
// Get all notifications
router.get('/', getAllNotifications);
// Get notifications for a specific user
router.get('/user/:userId', getNotificationsForUser);
// Delete a notification
router.delete('/:id', deleteNotification);

export default router;