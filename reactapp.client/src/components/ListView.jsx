import PriorityBadge from './PriorityBadge';

const ListView = ({ tasks, onEdit, onDelete }) => {
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

    const getTaskTypeBadge = (type) => {
        const badges = {
            'Enhance': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            'BugFixing': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            'DailyRoutine': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
        };
        const labels = {
            'Enhance': '🚀 Enhance',
            'BugFixing': '🐛 Bug Fix',
            'DailyRoutine': '📅 Routine'
        };
        return { color: badges[type], label: labels[type] };
    };

    const getStatusBadge = (status) => {
        const badges = {
            'ToDo': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            'InProgress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            'Done': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        };
        const labels = {
            'ToDo': 'To Do',
            'InProgress': 'In Progress',
            'Done': 'Done'
        };
        return { color: badges[status], label: labels[status] };
    };

    const handleDelete = async (taskId) => {
        if (!confirm('Delete this task permanently?')) return;
        await onDelete(taskId);
    };

    return (
        <div className="space-y-3">
            {tasks.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
                </div>
            ) : (
                tasks.map(task => {
                    const taskTypeBadge = getTaskTypeBadge(task.taskType);
                    const statusBadge = getStatusBadge(task.status);

                    return (
                        <div
                            key={task.id}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            {/* Badges */}
                            <div className="flex flex-col gap-2">
                                <PriorityBadge priority={task.priority} />
                                <span className={`text-xs px-2 py-1 rounded-full ${taskTypeBadge.color}`}>
                                    {taskTypeBadge.label}
                                </span>
                            </div>

                            {/* Task Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg truncate">
                                    {task.title}
                                </h3>
                                {task.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {task.description}
                                    </p>
                                )}
                                <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>By: {task.requestedBy}</span>
                                    {task.dueDate && (
                                        <span className="text-orange-600 dark:text-orange-400">
                                            Due: {formatDateTime(task.dueDate)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <span className={`text-xs px-3 py-1 rounded-full ${statusBadge.color}`}>
                                    {statusBadge.label}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(task)}
                                    className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ListView;