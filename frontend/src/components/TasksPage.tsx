"use client";

import { useEffect, useState, useCallback, useRef } from 'react'; // Import useRef
import { getTasks, createTask, updateTask, deleteTask, getUpcomingTasks } from '@/services/api'; // Import getUpcomingTasks
import { Task } from '@/types/Task';
import TaskList from '@/components/TaskList';
import AddTask from '@/components/AddTask';
import { requestNotificationPermission, showNotification } from '@/utils/notifications'; // Import notification utilities
import Link from 'next/link';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompleted, setFilterCompleted] = useState<boolean | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<Task['priority'] | undefined>(undefined);
  const [filterHasDueDate, setFilterHasDueDate] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const notifiedTaskIds = useRef<Set<number>>(new Set()); // To track notified tasks

  const fetchTasks = useCallback(async (
    search?: string,
    completed?: boolean,
    priority?: Task['priority'],
    has_due_date?: boolean,
    sort_by?: string,
    sort_order?: string
  ) => {
    try {
      setLoading(true);
      const fetchedTasks = await getTasks(search, completed, priority, has_due_date, sort_by, sort_order);
      setTasks(fetchedTasks);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(searchTerm, filterCompleted, filterPriority, filterHasDueDate, sortBy, sortOrder);
  }, [fetchTasks, searchTerm, filterCompleted, filterPriority, filterHasDueDate, sortBy, sortOrder]);

  // Notification Logic - Request permission on mount
  useEffect(() => {
    // Request notification permission immediately on page load
    const initNotifications = async () => {
      const permission = await requestNotificationPermission();
      console.log("Notification permission status:", permission);
      
      if (permission === "default") {
        // If user hasn't decided yet, show a friendly prompt
        setTimeout(async () => {
          const retry = await requestNotificationPermission();
          if (retry === "denied") {
            console.log("User denied notifications. They can enable it later in browser settings.");
          }
        }, 3000);
      } else if (permission === "granted") {
        console.log("✅ Notifications enabled! You'll receive reminders for upcoming tasks.");
      } else {
        console.log("Notifications blocked. Enable them in your browser settings to get task reminders.");
      }
    };
    
    initNotifications();

    const notificationInterval = setInterval(async () => {
      console.log("Polling for upcoming tasks...");
      if (Notification.permission === "granted") {
        try {
          const upcoming = await getUpcomingTasks(15);
          console.log("Upcoming tasks received:", upcoming);
          upcoming.forEach(task => {
            if (task.id && !notifiedTaskIds.current.has(task.id)) {
              console.log("Showing notification for task:", task.title, task.id);
              showNotification(task);
              notifiedTaskIds.current.add(task.id);
            }
          });
        } catch (err) {
          console.error("Error fetching upcoming tasks for notifications:", err);
        }
      } else {
        console.warn("Notification permission not granted, skipping poll for notifications.");
      }
    }, 60 * 1000); // Poll every 1 minute

    return () => clearInterval(notificationInterval);
  }, []); // Run once on mount

  const handleAddTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await createTask(taskData);
      setTasks([...tasks, newTask]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleUpdateTask = async (id: number, updatedTask: Partial<Task>) => {
    // Store original task state for rollback
    const originalTasks = tasks;
    
    try {
      console.log('Updating task ID:', id, 'with data:', updatedTask);
      
      // Optimistically update UI for better responsiveness
      if (updatedTask.completed !== undefined) {
        setTasks(prevTasks => prevTasks.map((task) => 
          task.id === id ? { ...task, completed: updatedTask.completed! } : task
        ));
      }
      
      const result = await updateTask(id, updatedTask);
      console.log('Update successful, result:', result);
      
      // If the task was archived (recurring task completion), remove it from view
      if (result.is_archived === true && result.recurrence_type) {
        console.log('✅ Recurring task completed! Creating next instance...');
        // Remove the archived task from state
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        // Fetch the updated list (which includes the new recurring instance)
        await fetchTasks(searchTerm, filterCompleted, filterPriority, filterHasDueDate, sortBy, sortOrder);
      } else {
        // For non-recurring tasks or other updates, ensure the task stays updated
        setTasks(prevTasks => prevTasks.map((task) => 
          task.id === id ? { ...task, ...result } : task
        ));
      }
      
      setError(null);
    } catch (err: any) {
      console.error('❌ Error updating task:', err);
      setError(err.message || 'Failed to update task');
      // Revert to original state on error
      setTasks(originalTasks);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const completedCount = tasks.filter(t => t.completed && !t.is_archived).length;
  const totalCount = tasks.filter(t => !t.is_archived).length;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-800 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay organized and productive
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl px-22 py-2">
                <div className="text-sm font-medium">Total</div>
                <div className="text-2xl font-bold">{totalCount}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl px-22 py-2">
                <div className="text-sm font-medium">Completed</div>
                <div className="text-2xl font-bold">{completedCount}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl px-22 py-2">
                <div className="text-sm font-medium">Pending</div>
                <div className="text-2xl font-bold">{totalCount - completedCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden">
          <div className="p-6">
            {/* Add Task Section */}
            <AddTask onAddTask={handleAddTask} />

            {/* Search and Filter/Sort Controls */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowAdvancedSearch(true)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {showAdvancedSearch && (
              <div className="mb-4 space-y-4 transition-all duration-300 ease-in-out">
                {/* Filter Controls */}
                <div className="flex gap-4">
                  <select
                    value={filterCompleted === undefined ? '' : filterCompleted.toString()}
                    onChange={(e) => setFilterCompleted(e.target.value === '' ? undefined : e.target.value === 'true')}
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 text-gray-900 dark:text-white"
                  >
                    <option value="">All Status</option>
                    <option value="true">Completed</option>
                    <option value="false">Pending</option>
                  </select>
                  <select
                    value={filterPriority || ''}
                    onChange={(e) => setFilterPriority(e.target.value === '' ? undefined : e.target.value as Task['priority'])}
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 text-gray-900 dark:text-white"
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select
                    value={filterHasDueDate === undefined ? '' : filterHasDueDate.toString()}
                    onChange={(e) => setFilterHasDueDate(e.target.value === '' ? undefined : e.target.value === 'true')}
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 text-gray-900 dark:text-white"
                  >
                    <option value="">All Due Dates</option>
                    <option value="true">Has Due Date</option>
                    <option value="false">No Due Date</option>
                  </select>
                </div>
                
                {/* Sort Controls */}
                <div className="flex gap-4">
                  <select
                    value={sortBy || ''}
                    onChange={(e) => setSortBy(e.target.value === '' ? undefined : e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 text-gray-900 dark:text-white"
                  >
                    <option value="">Sort By</option>
                    <option value="title">Title</option>
                    <option value="priority">Priority</option>
                    <option value="due_date">Due Date</option>
                  </select>
                  <select
                    value={sortOrder || ''}
                    onChange={(e) => setSortOrder(e.target.value === '' ? undefined : e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 text-gray-900 dark:text-white"
                  >
                    <option value="">Order</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              /* Task List */
              <TaskList 
                tasks={tasks} 
                onUpdateTask={handleUpdateTask} 
                onDeleteTask={handleDeleteTask} 
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 mb-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TaskFlow
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Stay organized, stay productive
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Powered by</span>
                <Link 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors duration-200 flex items-center gap-1 group" 
                  href="https://xpertsphere.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="group-hover:underline">Xpertsphere</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                © 2025 All rights reserved
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}