// src/components/Board.jsx
import { useDrop } from 'react-dnd';
import Column from './Column';
import { updateTask } from '../services/api';

const columns = ['ToDo', 'InProgress', 'Done'];

const Board = ({ tasks, setTasks, fetchTasks }) => {
    const handleDrop = async (item, newStatus) => {
        const taskId = item?.id;
        if (!taskId) return;

        const task = tasks.find(t => t.id === taskId);
        if (!task || task.status === newStatus) return;

        const updatedTask = {
            ...task,
            status: newStatus,
            isCompleted: newStatus === 'Done'  // ← CRITICAL: Set isCompleted
        };

        // Optimistic UI update
        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

        try {
            await updateTask(taskId, updatedTask);
        } catch (error) {
            console.error('Update failed:', error);
            fetchTasks(); // Revert on error
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(col => (
                <DropZone key={col} status={col} onDrop={handleDrop}>
                    <Column status={col} tasks={tasks.filter(t => t.status === col)} fetchTasks={fetchTasks} />
                </DropZone>
            ))}
        </div>
    );
};

// CRITICAL: DropZone must wrap the entire column
const DropZone = ({ status, onDrop, children }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'task',
        drop: (item) => {
            console.log(`[DROP] Task ${item.id} → ${status}`); // ← DEBUG
            onDrop(item, status);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [status, onDrop]);

    return (
        <div
            ref={drop}
            className={`min-h-[500px] p-3 rounded-lg transition-all
        ${isOver ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500' : ''}
      `}
        >
            {children}
        </div>
    );
};

export default Board;