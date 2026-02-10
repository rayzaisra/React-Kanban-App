const ViewSwitcher = ({ currentView, onViewChange }) => {
    const views = [
        { id: 'kanban', label: 'Kanban', icon: '📋' },
        { id: 'list', label: 'List', icon: '📝' },
        { id: 'table', label: 'Table', icon: '📊' }
    ];

    return (
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {views.map(view => (
                <button
                    key={view.id}
                    onClick={() => onViewChange(view.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${currentView === view.id
                            ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                >
                    <span className="mr-1">{view.icon}</span>
                    {view.label}
                </button>
            ))}
        </div>
    );
};

export default ViewSwitcher;