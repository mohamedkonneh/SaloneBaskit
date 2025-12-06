const webpush = require('web-push');
const db = require('../config/db');

// VAPID keys should be generated once and stored in your .env file
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

if (!publicVapidKey || !privateVapidKey) {
  console.error("VAPID keys are not set. Please generate them and add to .env file.");
  // You can generate VAPID keys by running:
  // npx web-push generate-vapid-keys
} else {
    webpush.setVapidDetails(
        'mailto:konnehmohamed354@gmail.com', // Replace with your actual email
        publicVapidKey,
        privateVapidKey
    );
}

// @desc    Subscribe user to push notifications
// @route   POST /api/push/subscribe
// @access  Private
const subscribe = async (req, res) => {
    const subscription = req.body;
    const userId = req.user.id;

    try {
        // Store the subscription object in your database, associated with the user
        await db.query(
            'INSERT INTO push_subscriptions (user_id, subscriptionS Fud

        res.status(201).json({ message: 'Subscription saved.' });
    } catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ message: 'Failed to save subscription.' });
    }
};

// @desc    Send a push notification
// @route   POST /api/push/send
// @access  Private/Admin
const sendNotification = async (req, res) => {
    const { title, body } = req.body;

    try {
        const { rows: subscriptions } = await db.query('SELECT subscription FROM push_subscriptions');
 p

        const promises = subscriptions.map(sub => webpush.sendNotification(sub.subscription, payload));
        await Promise.all(promises);

    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ message: 'Failed to send notifications.' });
    }
};

module.exports = { subscribe, sendNotification };