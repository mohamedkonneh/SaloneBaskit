import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';

const VAPID_PUBLIC_KEY = 'BJqgLb9eBsdbQPwfPvSb_bU9194ALApm7Puvt_kT0pu78iev6zvsO47dSUDZPX9Xom6VWVrZrUUsDBwQz-76MjA'; // Replace with your actual VAPID public key

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const NotificationSettings = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub) {
            setIsSubscribed(true);
            setSubscription(sub);
          }
          setLoading(false);
        });
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubscriptionChange = async () => {
    if (isSubscribed) {
      await unsubscribeUser();
    } else {
      await subscribeUser();
    }
  };

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await api.post('/push/subscribe', sub);

      toast.success('Subscribed to notifications!');
      setIsSubscribed(true);
      setSubscription(sub);
    } catch (error) {
      console.error('Failed to subscribe the user: ', error);
      toast.error('Could not subscribe to notifications. Please ensure you have granted permission.');
    }
  };

  const unsubscribeUser = async () => {
    if (!subscription) return;
    try {
      await subscription.unsubscribe();

      await api.post('/push/unsubscribe', { endpoint: subscription.endpoint });

      toast.info('Unsubscribed from notifications.');
      setIsSubscribed(false);
      setSubscription(null);
    } catch (error) {
      console.error('Failed to unsubscribe the user: ', error);
      toast.error('Failed to unsubscribe.');
    }
  };

  if (!('serviceWorker' in navigator && 'PushManager' in window)) {
    return (
      <div>
        <h3>Push Notifications</h3>
        <p>Sorry, Push Notifications are not supported by your browser.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={styles.title}>Notification Settings</h2>
      <div style={styles.settingItem}>
        <p style={styles.settingText}>Receive updates about your orders and special promotions.</p>
        <label style={styles.switch}>
          <input 
            type="checkbox" 
            checked={isSubscribed}
            onChange={handleSubscriptionChange}
            disabled={loading}
          />
          <span style={styles.slider}></span>
        </label>
      </div>
    </div>
  );
};

const styles = {
  title: { marginBottom: '20px' },
  settingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: '1px solid #eee' },
  settingText: { margin: 0, color: '#333' },
  switch: { position: 'relative', display: 'inline-block', width: '60px', height: '34px' },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    transition: '.4s',
    borderRadius: '34px',
  },
};

export default NotificationSettings;