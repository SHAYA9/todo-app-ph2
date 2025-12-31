// frontend/src/utils/notifications.ts
import { Task } from '@/types/Task';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn("This browser does not support desktop notification");
    return "denied"; // Treat as denied if not supported
  }

  // Check if permission is already granted or denied
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }

  // Request permission
  const permission = await Notification.requestPermission();
  return permission;
}

export function showNotification(task: Task) {
  console.log("Attempting to show notification for task:", task);
  if (Notification.permission === "granted") {
    const title = `Task Due: ${task.title}`;
    const options: NotificationOptions = {
      body: `Priority: ${task.priority}\n${task.due_datetime ? 'Due: ' + new Date(task.due_datetime).toLocaleString('en-US', { timeZone: 'Asia/Karachi' }) : ''}`,
      icon: '/favicon.ico', // Adjust path to your app's icon
      data: task.id, // Store task ID to open task on click (if implemented)
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
