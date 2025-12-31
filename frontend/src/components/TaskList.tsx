import { Task, RecurrenceType } from '@/types/Task'; // Import RecurrenceType
import { useState } from 'react';
import { formatUtcIsoToDatetimeLocalInput, parseDatetimeLocalInputToUtcIso, formatUtcIsoForDisplay } from '@/utils/date-format'; // Import the helper

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: number, task: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingPriority, setEditingPriority] = useState<Task['priority']>('medium');
  const [editingTagsInput, setEditingTagsInput] = useState('');
  const [editingDueDate, setEditingDueDate] = useState(''); // This state will now hold YYYY-MM-DDTHH:MM
  const [editingRecurrenceType, setEditingRecurrenceType] = useState<RecurrenceType | undefined>(undefined); // New state

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingPriority(task.priority || 'medium');
    setEditingTagsInput(task.tags ? task.tags.join(', ') : '');
    setEditingDueDate(task.due_datetime ? formatUtcIsoToDatetimeLocalInput(task.due_datetime) : ''); // Use helper
    setEditingRecurrenceType(task.recurrence_type);
  };

  const handleSave = (id: number) => {
    if (editingTitle.trim()) {
      const updatedTask: Partial<Task> = { 
        title: editingTitle,
        priority: editingPriority,
        tags: editingTagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
        due_datetime: parseDatetimeLocalInputToUtcIso(editingDueDate), // Use the helper function
        recurrence_type: editingRecurrenceType,
      };
      onUpdateTask(id, updatedTask);
    }
    setEditingTaskId(null);
    setEditingTitle('');
    setEditingPriority('medium');
    setEditingTagsInput('');
    setEditingDueDate('');
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    setEditingTitle('');
    setEditingPriority('medium');
    setEditingTagsInput('');
    setEditingDueDate('');
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">No tasks yet</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className={`group p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 ${
            task.completed ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Checkbox */}
            <button
              onClick={() => onUpdateTask(task.id, { completed: !task.completed })}
              className="flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                borderColor: task.completed ? '#10b981' : '#d1d5db',
                backgroundColor: task.completed ? '#10b981' : 'transparent'
              }}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Task Content */}
            <div className="flex-1 flex flex-col">
              {editingTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(task.id);
                      if (e.key === 'Escape') handleCancel();
                    }}
                    className="px-3 py-2 bg-white dark:bg-gray-600 border border-blue-500 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    autoFocus
                  />
                  <select
                    value={editingPriority}
                    onChange={(e) => setEditingPriority(e.target.value as Task['priority'])}
                    className="mt-2 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <input
                    type="text"
                    value={editingTagsInput}
                    onChange={(e) => setEditingTagsInput(e.target.value)}
                    placeholder="Tags (comma-separated)"
                    className="mt-2 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                  <input
                    type="datetime-local"
                    value={editingDueDate}
                    onChange={(e) => setEditingDueDate(e.target.value)}
                    className="mt-2 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                  {/* New Recurrence Type dropdown for editing */}
                  <select
                    value={editingRecurrenceType || ''}
                    onChange={(e) => setEditingRecurrenceType(e.target.value === '' ? undefined : e.target.value as RecurrenceType)}
                    className="mt-2 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  >
                    <option value="">No Recurrence</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <span
                      onClick={() => onUpdateTask(task.id, { completed: !task.completed })}
                      className={`cursor-pointer transition-all duration-300 text-lg ${
                        task.completed 
                          ? 'line-through text-gray-400 dark:text-gray-500' 
                          : 'text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.recurrence_type && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full">
                        🔄 Recurring
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {task.priority && (
                      <span className={`capitalize font-medium ${
                        task.priority === 'high' ? 'text-red-500' : 
                        task.priority === 'medium' ? 'text-yellow-500' : 
                        'text-green-500'
                      }`}>
                        Priority: {task.priority}
                      </span>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {task.due_datetime && (
                      <span className="mt-1">
                        Due: {formatUtcIsoForDisplay(task.due_datetime)}
                      </span>
                    )}
                    {task.recurrence_type && (
                      <span className="mt-1 capitalize">
                        Repeats: {task.recurrence_type}
                      </span>
                    )}
                    {task.is_archived && (
                      <span className="mt-1 text-gray-400 dark:text-gray-500">
                        (Archived)
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              {editingTaskId === task.id ? (
                <>
                  <button
                    onClick={() => handleSave(task.id)}
                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-300"
                    title="Save"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-300"
                    title="Cancel"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}