// src/components/TaskForm.jsx
import { useState } from 'react';
import { createTask } from '../services/api';

const TaskForm = ({ onClose, onCreate }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        requestedBy: '',
        requestDate: '',     // "2025-11-12"
        requestTime: '',     // "14:30"
        dueDate: '',
        dueTime: '',
        status: 'ToDo'
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.requestedBy || !form.requestDate || !form.requestTime) {
            alert('Title, Requested By, Request Date & Time are required');
            return;
        }

        // COMBINE DATE + TIME → ISO STRING
        const requestDateTime = `${form.requestDate}T${form.requestTime}:00.000Z`;
        const dueDateTime = form.dueDate && form.dueTime
            ? `${form.dueDate}T${form.dueTime}:00.000Z`
            : null;

        const payload = {
            title: form.title,
            description: form.description || null,
            requestedBy: form.requestedBy,
            requestDate: requestDateTime,   // ← ISO with time
            dueDate: dueDateTime,
            status: form.status,
            isCompleted: false
        };

        try {
            await createTask(payload);
            onCreate();
        } catch (error) {
            console.error('Create failed:', error);
            alert('Failed to create task. Check console.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md overflow-y-auto max-h-screen">
                <h2 className="text-xl font-bold mb-4">Create New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* TITLE */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input name="title" required value={form.title} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" rows={3} value={form.description} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                    </div>

                    {/* REQUESTED BY */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Requested By *</label>
                        <input name="requestedBy" required value={form.requestedBy} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                    </div>

                    {/* REQUEST DATE + TIME */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Request Date *</label>
                            <input type="date" name="requestDate" required value={form.requestDate} onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Request Time *</label>
                            <input type="time" name="requestTime" required value={form.requestTime} onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                        </div>
                    </div>

                    {/* DUE DATE + TIME */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Due Date</label>
                            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Due Time</label>
                            <input type="time" name="dueTime" value={form.dueTime} onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
                            Cancel
                        </button>
                        <button type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;