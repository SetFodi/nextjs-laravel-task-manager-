// pages/index.js
'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // State for handling task editing
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [editingTaskDescription, setEditingTaskDescription] = useState('');

  // Fetch tasks from the Laravel API on component mount
  useEffect(() => {
    fetch('http://localhost:8000/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Error fetching tasks:', err));
  }, []);

  // Handle new task form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title: newTaskTitle,
      description: newTaskDescription,
    };

    try {
      const res = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask = await res.json();
      // Update tasks state with the newly created task
      setTasks([...tasks, createdTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Handle deletion of a task
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to delete task');

      // Remove the deleted task from the state
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Trigger edit mode for a task
  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
    setEditingTaskDescription(task.description || '');
  };

  // Handle update submission for a task
  const handleUpdateSubmit = async (id) => {
    const updatedTaskData = {
      title: editingTaskTitle,
      description: editingTaskDescription,
    };

    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTaskData),
      });

      if (!res.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await res.json();
      // Update tasks state with the updated task
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      // Reset editing state
      setEditingTaskId(null);
      setEditingTaskTitle('');
      setEditingTaskDescription('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Cancel editing and reset edit state
  const handleUpdateCancel = () => {
    setEditingTaskId(null);
    setEditingTaskTitle('');
    setEditingTaskDescription('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8">
          Task Manager
        </h1>

        {/* New Task Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all h-24"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Task List */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Your Tasks
        </h2>
        {tasks.length === 0 ? (
          <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">
              No tasks found. Start adding some!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200 group border-l-4 border-indigo-500"
              >
                {editingTaskId === task.id ? (
                  // Edit Mode: Render form inputs for editing the task
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingTaskTitle}
                      onChange={(e) => setEditingTaskTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
                    />
                    <textarea
                      value={editingTaskDescription}
                      onChange={(e) => setEditingTaskDescription(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateSubmit(task.id)}
                        className="text-sm text-green-600 dark:text-green-400 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleUpdateCancel}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode: Render task details
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.completed
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        }`}
                      >
                        {task.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEditClick(task)}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
