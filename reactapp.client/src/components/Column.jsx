import TaskCard from './TaskCard';  // ← ADD THIS LINE

const Column = ({ status, tasks, fetchTasks }) => {

    const title = status === 'ToDo' ? 'To Do' : status === 'InProgress' ? 'In Progress' : 'Done';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="font-semibold text-lg mb-3 text-indigo-600 dark:text-indigo-400">{title}</h2>
            <div className="space-y-3">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} fetchTasks={fetchTasks} />
                ))}
            </div>
        </div>
    );
};

export default Column;