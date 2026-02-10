import { useState } from 'react';

const FilterSidebar = ({ onFilterChange, onClose }) => {
    const [filters, setFilters] = useState({
        taskType: '',
        status: '',
        priority: '',
        overdue: false
    });

    const handleChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const emptyFilters = {
            taskType: '',
            status: '',
            priority: '',
            overdue: false
        };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center md:justify-start z-50">
            <div className="bg-white dark:bg-gray-800 w-full md:w-80 md:h-full p-6 overflow-y-auto rounded-t-2xl md:rounded-none">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Filters</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                {/* Priority Filter */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                        value={filters.priority}
                        onChange={e => handleChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    >
                        <option value="">All Priorities</option>
                        <option value="0">📌 Low</option>
                        <option value="1">⭐ Medium</option>
                        <option value="2">⚡ High</option>
                        <option value="3">🔥 Critical</option>
                    </select>
                </div>

                {/* Task Type Filter */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Task Type</label>
                    <select
                        value={filters.taskType}
                        onChange={e => handleChange('taskType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    >
                        <option value="">All Types</option>
                        <option value="Enhance">🚀 Enhance</option>
                        <option value="BugFixing">🐛 Bug Fixing</option>
                        <option value="DailyRoutine">📅 Daily Routine</option>
                    </select>
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                        value={filters.status}
                        onChange={e => handleChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    >
                        <option value="">All Status</option>
                        <option value="ToDo">To Do</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

                {/* Overdue Filter */}
                <div className="mb-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.overdue}
                            onChange={e => handleChange('overdue', e.target.checked)}
                            className="mr-3 w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Show only overdue tasks</span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition"
                    >
                        Apply
                    </button>
                </div>

                {/* Active Filters Count */}
                {(filters.taskType || filters.status || filters.priority || filters.overdue) && (
                    <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            {[filters.taskType, filters.status, filters.priority, filters.overdue].filter(Boolean).length} filter(s) active
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterSidebar;