import TaskCard from './TaskCard';

const Column = ({ status, tasks, onEdit }) => {
    const title = status === 'ToDo'
        ? 'To Do'
        : status === 'InProgress'
            ? 'In Progress'
            : 'Done';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 min-h-[600px] flex flex-col">
            <h2 className="font-semibold text-lg mb-4 text-indigo-600 dark:text-indigo-400">
                {title}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({tasks.length})
                </span>
            </h2>

            <div className="space-y-3 flex-1 overflow-y-auto">
                {tasks.length === 0 ? (
                    <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
                        No tasks here
                    </p>
                ) : (
                    tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEdit}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Column;
