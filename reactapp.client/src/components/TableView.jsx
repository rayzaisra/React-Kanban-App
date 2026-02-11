import { useState, useMemo } from 'react';
import PriorityBadge from './PriorityBadge';

const TableView = ({ tasks, onEdit, onDelete }) => {
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });

    const formatDateTime = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getTaskTypeBadge = (type) => {
        const badges = {
            'Enhance': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', label: '🚀 Enhance' },
            'BugFixing': { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: '🐛 Bug Fix' },
            'DailyRoutine': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', label: '📅 Routine' }
        };
        return badges[type] || badges['Enhance'];
    };

    const getStatusBadge = (status) => {
        const badges = {
            'ToDo': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', label: 'To Do' },
            'InProgress': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'In Progress' },
            'Done': { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Done' }
        };
        return badges[status] || badges['ToDo'];
    };

    const getPriorityValue = (priority) => {
        const values = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
        return values[priority] || 0;
    };

    const sortedTasks = useMemo(() => {
        let sortableTasks = [...tasks];

        if (sortConfig.key) {
            sortableTasks.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle priority sorting
                if (sortConfig.key === 'priority') {
                    aValue = getPriorityValue(a.priority);
                    bValue = getPriorityValue(b.priority);
                }

                // Handle date sorting
                if (sortConfig.key === 'dueDate' || sortConfig.key === 'createdAt' || sortConfig.key === 'requestDate') {
                    aValue = aValue ? new Date(aValue).getTime() : 0;
                    bValue = bValue ? new Date(bValue).getTime() : 0;
                }

                // Handle string sorting
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableTasks;
    }, [tasks, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <span className="text-gray-400">⇅</span>;
        }
        return sortConfig.direction === 'asc' ? <span>↑</span> : <span>↓</span>;
    };

    const handleDelete = async (taskId) => {
        if (!confirm('Delete this task permanently?')) return;
        await onDelete(taskId);
    };

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        {/* Priority */}
                        <th
                            onClick={() => requestSort('priority')}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <div className="flex items-center gap-2">
                                Priority {getSortIcon('priority')}
                            </div>
                        </th>

                        {/* Title */}
                        <th
                            onClick={() => requestSort('title')}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <div className="flex items-center gap-2">
                                Title {getSortIcon('title')}
                            </div>
                        </th>

                        {/* Type */}
                        <th
                            onClick={() => requestSort('taskType')}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <div className="flex items-center gap-2">
                                Type {getSortIcon('taskType')}
                            </div>
                        </th>

                        {/* Status */}
                        <th
                            onClick={() => requestSort('status')}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <div className="flex items-center gap-2">
                                Status {getSortIcon('status')}
                            </div>
                        </th>

                        {/* Requested By */}
                        <th
                            onClick={() => requestSort('requestedBy')}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <div className="flex items-center gap-2">
                                Requested By {getSortIcon('requestedBy')}
                            </div>
                        </th>

                        {/* Due Date */}
                        <th
                            onClick={() => requestSort('dueDate')}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <div className="flex items-center gap-2">
                                Due Date {getSortIcon('dueDate')}
                            </div>
                        </th>

                        {/* Created */}
                        <th
                            onClick={() => requestSort('createdAt')}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <div className="flex items-center gap-2">
                                Created {getSortIcon('createdAt')}
                            </div>
                        </th>

                        {/* Actions */}
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedTasks.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                                No tasks found
                            </td>
                        </tr>
                    ) : (
                        sortedTasks.map(task => {
                            const taskTypeBadge = getTaskTypeBadge(task.taskType);
                            const statusBadge = getStatusBadge(task.status);
                            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;

                            return (
                                <tr
                                    key={task.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                >
                                    {/* Priority */}
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <PriorityBadge priority={task.priority} />
                                    </td>

                                    {/* Title */}
                                    <td className="px-4 py-4">
                                        <div className="max-w-xs">
                                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {task.title}
                                            </div>
                                            {task.description && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {task.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Type */}
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`text-xs px-2 py-1 rounded-full ${taskTypeBadge.color}`}>
                                            {taskTypeBadge.label}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`text-xs px-2 py-1 rounded-full ${statusBadge.color}`}>
                                            {statusBadge.label}
                                        </span>
                                    </td>

                                    {/* Requested By */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {task.requestedBy}
                                    </td>

                                    {/* Due Date */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {task.dueDate ? (
                                            <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-900 dark:text-gray-100'}>
                                                {formatDateOnly(task.dueDate)}
                                                {isOverdue && ' ⚠️'}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>

                                    {/* Created */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDateOnly(task.createdAt)}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => onEdit(task)}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableView;