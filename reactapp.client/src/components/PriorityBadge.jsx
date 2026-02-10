const PriorityBadge = ({ priority }) => {
    const config = {
        'Critical': {
            color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800',
            icon: '🔥'
        },
        'High': {
            color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
            icon: '⚡'
        },
        'Medium': {
            color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
            icon: '⭐'
        },
        'Low': {
            color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-800',
            icon: '📌'
        }
    };

    const { color, icon } = config[priority] || config['Medium'];

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            <span>{icon}</span>
            <span>{priority}</span>
        </span>
    );
};

export default PriorityBadge;