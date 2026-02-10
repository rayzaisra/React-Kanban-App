import { useState, useEffect } from 'react';
import { createTask, updateTask } from '../services/api';

const TaskForm = ({ onClose, onCreate, taskToEdit = null }) => {
    const isEditMode = !!taskToEdit;

    const [form, setForm] = useState({
        title: '',
        description: '',
        requestedBy: '',
        requestDate: '',
        requestTime: '',
        dueDate: '',
        dueTime: '',
        status: 'ToDo',
        taskType: 'Enhance',
        priority: 'Medium'
    });

    useEffect(() => {
        if (taskToEdit) {
            const requestDateTime = taskToEdit.requestDate ? new Date(taskToEdit.requestDate) : null;
            const dueDateTime = taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : null;

            setForm({
                title: taskToEdit.title || '',
                description: taskToEdit.description || '',
                requestedBy: taskToEdit.requestedBy || '',
                requestDate: requestDateTime ? requestDateTime.toISOString().split('T')[0] : '',
                requestTime: requestDateTime ? requestDateTime.toISOString().split('T')[1].substring(0, 5) : '',
                dueDate: dueDateTime ? dueDateTime.toISOString().split('T')[0] : '',
                dueTime: dueDateTime ? dueDateTime.toISOString().split('T')[1].substring(0, 5) : '',
                status: taskToEdit.status || 'ToDo',
                taskType: taskToEdit.taskType || 'Enhance',
                priority: taskToEdit.priority || 'Medium'
            });
        }
    }, [taskToEdit]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.requestedBy || !form.requestDate || !form.requestTime) {
            alert('Title, Requested By, Request Date & Time are required');
            return;
        }

        const requestDateTime = `${form.requestDate}T${form.requestTime}:00.000Z`;
        const dueDateTime = form.dueDate && form.dueTime
            ? `${form.dueDate}T${form.dueTime}:00.000Z`
            : null;

        const payload = {
            title: form.title,
            description: form.description || null,
            requestedBy: form.requestedBy,
            requestDate: requestDateTime,
            dueDate: dueDateTime,
            status: form.status,
            isCompleted: form.status === 'Done',
            taskType: form.taskType,
            priority: form.priority
        };

        try {
            if (isEditMode) {
                await updateTask(taskToEdit.id, payload);
            } else {
                await createTask(payload);
            }
            onCreate();
        } catch (error) {
            console.error(`${isEditMode ? 'Update' : 'Create'} failed:`, error);
            alert(`Failed to ${isEditMode ? 'update' : 'create'} task. Check console.`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md overflow-y-auto max-h-screen">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit Task' : 'Create New Task'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* TITLE */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input
                            name="title"
                            required
                            value={form.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        />
                    </div>

                    {/* REQUESTED BY */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Requested By *</label>
                        <input
                            name="requestedBy"
                            required
                            value={form.requestedBy}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        />
                    </div>

                    {/* TASK TYPE */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Task Type *</label>
                        <select
                            name="taskType"
                            required
                            value={form.taskType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        >
                            <option value="Enhance">🚀 Enhance - New feature/request to develop</option>
                            <option value="BugFixing">🐛 Bug Fixing - Fix reported bugs</option>
                            <option value="DailyRoutine">📅 Daily Routine - Maintenance, reports, updates</option>
                        </select>
                    </div>

                    {/* PRIORITY */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Priority *</label>
                        <select
                            name="priority"
                            required
                            value={form.priority}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        >
                            <option value="Low">📌 Low</option>
                            <option value="Medium">⭐ Medium</option>
                            <option value="High">⚡ High</option>
                            <option value="Critical">🔥 Critical</option>
                        </select>
                    </div>

                    {/* REQUEST DATE + TIME */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Request Date *</label>
                            <input
                                type="date"
                                name="requestDate"
                                required
                                value={form.requestDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Request Time *</label>
                            <input
                                type="time"
                                name="requestTime"
                                required
                                value={form.requestTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                            />
                        </div>
                    </div>

                    {/* DUE DATE + TIME */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Due Time</label>
                            <input
                                type="time"
                                name="dueTime"
                                value={form.dueTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                            />
                        </div>
                    </div>

                    {/* STATUS - Show only in edit mode */}
                    {isEditMode && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                            >
                                <option value="ToDo">To Do</option>
                                <option value="InProgress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    )}

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                        >
                            {isEditMode ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;