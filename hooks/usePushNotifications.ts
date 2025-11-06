import { useState, useEffect } from 'react';
import { getVapidKey, subscribeToPush, unsubscribeFromPush } from '../services/api';

const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);

      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  const subscribe = async () => {
    if (!isSupported || permission === 'denied') return;

    if (permission === 'default') {
      const newPermission = await Notification.requestPermission();
      setPermission(newPermission);
      if (newPermission !== 'granted') return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const vapidKey = await getVapidKey();
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(vapidKey),
        });

        await subscribeToPush(subscription);
        setIsSubscribed(true);
    } catch (error) {
        console.error('Failed to subscribe to push notifications', error);
    }
  };

  const unsubscribe = async () => {
    if (!isSubscribed) return;

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            await unsubscribeFromPush(subscription);
            await subscription.unsubscribe();
            setIsSubscribed(false);
        }
    } catch (error) {
        console.error('Failed to unsubscribe from push notifications', error);
    }
  };

  return { isSupported, permission, isSubscribed, subscribe, unsubscribe };
};
