// frontend/src/utils/notifications.ts
import { Task } from '@/types/Task';
import { formatUtcIsoForDisplay } from './date-format';

const VAPID_PUBLIC_KEY = "BL4pAnypP1Sm7XmYjoCfg3XAqoKS9DySNmTT4KNemgpJJQ2-GGlZlQCdCV769Kc6DdkH4WbHCUonnUdsOvxPCf4"; // Replace with your VAPID public key

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function registerServiceWorker() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
            const swReg = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', swReg);

            let subscription = await swReg.pushManager.getSubscription();
            if (subscription === null) {
                subscription = await swReg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                });
                console.log('New subscription:', subscription);
                await sendSubscriptionToBackend(subscription);
            } else {
                console.log('Existing subscription:', subscription);
            }
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}

async function sendSubscriptionToBackend(subscription: PushSubscription) {
    try {
        const response = await fetch('/api/subscribe', { // This endpoint needs to be created on the backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
        });
        if (!response.ok) {
            throw new Error('Failed to send subscription to backend');
        }
    } catch (error) {
        console.error('Error sending subscription to backend:', error);
    }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn("⚠️ This browser does not support desktop notifications");
    return "denied";
  }

  // Check if permission is already granted
  if (Notification.permission === "granted") {
    console.log("✅ Notification permission already granted");
    registerServiceWorker(); // Register the service worker if permission is granted
    return Notification.permission;
  }
  
  // Check if permission was previously denied
  if (Notification.permission === "denied") {
    console.warn("❌ Notification permission was previously denied. Please enable it in browser settings.");
    return Notification.permission;
  }

  // Request permission (this will show browser prompt)
  try {
    console.log("🔔 Requesting notification permission...");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Notification permission granted! You'll receive task reminders.");
      registerServiceWorker(); // Register the service worker after permission is granted
      // Show a test notification
      new Notification("Notifications Enabled!", {
        body: "You'll now receive reminders for your upcoming tasks.",
        icon: '/favicon.ico'
      });
    } else if (permission === "denied") {
      console.warn("❌ Notification permission denied. You can enable it anytime in browser settings.");
    }
    return permission;
  } catch (error) {
    console.error("❌ Error requesting notification permission:", error);
    return "denied";
  }
}

export function showNotification(task: Task) {
  console.log("Attempting to show notification for task:", task);
  if (Notification.permission === "granted") {
    const title = `Task Due: ${task.title}`;
    const dueTime = task.due_datetime ? formatUtcIsoForDisplay(task.due_datetime) : '';
    const options: NotificationOptions = {
      body: `Priority: ${task.priority}${dueTime ? '\nDue: ' + dueTime : ''}`,
      icon: '/favicon.ico',
      data: task.id,
    };
    navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options);
    });
  } else {
    console.warn("Notification permission not granted. Cannot show notification for task:", task.title);
  }
}
