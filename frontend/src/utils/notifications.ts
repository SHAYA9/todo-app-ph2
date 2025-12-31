// frontend/src/utils/notifications.ts
import { Task } from '@/types/Task';
import { formatUtcIsoForDisplay } from './date-format';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn("⚠️ This browser does not support desktop notifications");
    return "denied";
  }

  // Check if permission is already granted
  if (Notification.permission === "granted") {
    console.log("✅ Notification permission already granted");
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
    new Notification(title, options);
  } else {
    console.warn("Notification permission not granted. Cannot show notification for task:", task.title);
  }
}

// Function to schedule/poll for notifications - to be integrated into TasksPage
// This part will be integrated in TasksPage.tsx
// export async function pollForNotifications(intervalMinutes: number, minutesOffset: number) {
//   setInterval(async () => {
//     const permission = await requestNotificationPermission();
//     if (permission === "granted") {
//       // Fetch upcoming tasks from your API
//       // Example: const upcomingTasks = await getUpcomingTasks(minutesOffset);
//       // upcomingTasks.forEach(task => showNotification(task));
//     }
//   }, intervalMinutes * 60 * 1000);
// }
