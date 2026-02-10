import { useDrop } from 'react-dnd';
import Column from './Column';
import { updateTask } from '../services/api';
import { useQueryClient } from '@tanstack/react-query';

const columns = ['ToDo', 'InProgress', 'Done'];

const Board = ({ tasks, onEdit }) => {
    const queryClient = useQueryClient();

    const handleDrop = async (item, newStatus) => {
        const taskId = item?.id;
        if (!taskId) return;

        const oldTask = tasks.find(t => t.id === taskId);
        if (!oldTask || oldTask.status === newStatus) return;

        const updatedTask = {
            ...oldTask,
            status: newStatus,
            isCompleted: newStatus === 'Done'
        };

        // 1. Optimistically update ALL query caches immediately
        const queryCache = queryClient.getQueryCache();
        const allTaskQueries = queryCache.findAll({ queryKey: ['tasks'] });

        allTaskQueries.forEach(query => {
            queryClient.setQueryData(query.queryKey, (oldData) => {
                if (!oldData?.pages) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        tasks: page.tasks.map(t =>
                            t.id === taskId ? updatedTask : t
                        )
                    }))
                };
            });
        });

        // 2. Update backend silently in the background
        updateTask(taskId, updatedTask).catch(error => {
            console.error('Failed to update task:', error);
            // Only refetch on error to revert
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(col => (
                <DropZone key={col} status={col} onDrop={handleDrop}>
                    <Column
                        status={col}
                        tasks={tasks.filter(t => t.status === col)}
                        onEdit={onEdit}
                    />
                </DropZone>
            ))}
        </div>
    );
};

const DropZone = ({ status, onDrop, children }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'task',
        drop: (item) => onDrop(item, status),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [status, onDrop]);

    return (
        <div
            ref={drop}
            className={`min-h-[600px] p-3 rounded-lg transition-all
                ${isOver ? 'bg-blue-100 dark:bg-blue-900/30 ring-4 ring-blue-500 ring-opacity-50' : ''}
            `}
        >
            {children}
        </div>
    );
};

export default Board;