
import { useDrag } from 'react-dnd';
import { deleteTask } from '../services/api';
import { useQueryClient } from '@tanstack/react-query';

const TaskCard = ({ task }) => {
    const queryClient = useQueryClient();
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'task',
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [task.id]);

    const handleDelete = async () => {
        if (!confirm('Delete this task permanently?')) return;

        try {
            await deleteTask(task.id);
        
        } catch (error) {
            alert('Failed to delete task');
            console.error(error);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    };

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

    // Background & border colors
    const getCardColor = () => {
        if (task.status === 'Done')
            return 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700';
        if (task.status === 'InProgress')
            return 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700';
        return 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600';
    };

    const getTitleColor = () => {
        if (task.status === 'Done') return 'text-green-800 dark:text-green-300';
        if (task.status === 'InProgress') return 'text-yellow-800 dark:text-yellow-300';
        return '';
    };

    return (
        <div
            ref={drag}
            className={`p-4 rounded-lg border-2 ${getCardColor()}
                ${isDragging ? 'opacity-40' : 'opacity-100'}
                transition-all cursor-grab active:cursor-grabbing select-none
                shadow-sm hover:shadow-lg transform hover:-translate-y-0.5`}
        >
            <h3 className={`font-semibold text-lg ${getTitleColor()} ${task.isCompleted ? 'line-through' : ''}`}>
                {task.title}
            </h3>

            {task.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-3">
                    {task.description}
                </p>
            )}

            <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>By: <span className="font-medium">{task.requestedBy || 'Unknown'}</span></p>
                <p>Request: <span className="font-medium">{formatDateTime(task.requestDate)}</span></p>
                {task.dueDate && (
                    <p className="text-orange-600 dark:text-orange-400">
                        Due: <span className="font-medium">{formatDateTime(task.dueDate)}</span>
                    </p>
                )}
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleDelete}
                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TaskCard;