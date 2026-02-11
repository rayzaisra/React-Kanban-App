import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskForm from './components/TaskForm';
import Board from './components/Board';
import ListView from './components/ListView';
import TableView from './components/TableView';  // ← ADD THIS IMPORT
import ViewSwitcher from './components/ViewSwitcher';
import FilterSidebar from './components/FilterSidebar';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getTasksPaginated, searchTasks, deleteTask, getUserPreferences, updateUserPreferences } from './services/api';

function App() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        taskType: '',
        status: '',
        priority: '',
        overdue: false
    });

    // User preferences
    const userId = 'default-user';
    const [currentView, setCurrentView] = useState('kanban');

    // Load user preferences
    useEffect(() => {
        getUserPreferences(userId).then(prefs => {
            if (prefs.preferredView) {
                setCurrentView(prefs.preferredView);
            }
        });
    }, [userId]);

    // Save view preference
    const handleViewChange = async (view) => {
        setCurrentView(view);
        try {
            await updateUserPreferences(userId, {
                preferredView: view,
                boardSettings: {}
            });
        } catch (error) {
            console.error('Failed to save preference:', error);
        }
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['tasks', searchTerm, filters],
        queryFn: ({ pageParam = 1 }) => {
            if (searchTerm.trim() || filters.taskType || filters.status || filters.priority || filters.overdue) {
                return searchTasks({
                    searchTerm,
                    page: pageParam,
                    pageSize: 10,
                    ...filters
                });
            }
            return getTasksPaginated({ page: pageParam, pageSize: 10 });
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? (lastPage.currentPage || 1) + 1 : undefined;
        },
        select: (data) => ({
            tasks: data.pages.flatMap(page => page.tasks || []),
            hasMore: data.pages[data.pages.length - 1]?.hasMore ?? false
        }),
        staleTime: 0,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
    });

    const tasks = data?.tasks || [];

    useEffect(() => {
        const onScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 800 >=
                document.documentElement.offsetHeight
            ) {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const refreshTasks = () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setShowForm(true);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            refreshTasks();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete task');
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setTaskToEdit(null);
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        setTaskToEdit(null);
        refreshTasks();
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const activeFiltersCount = [
        filters.taskType,
        filters.status,
        filters.priority,
        filters.overdue
    ].filter(Boolean).length;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                {/* HEADER */}
                <header className="border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 bg-white dark:bg-gray-800 backdrop-blur-sm z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                            <h1 className="text-2xl font-bold">Kanban Board</h1>

                            {/* SEARCH BOX */}
                            <div className="flex-1 max-w-md w-full">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full px-4 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg
                                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                                 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1
                                                     text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400
                                                     dark:hover:text-gray-200 transition"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                {searchTerm && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {tasks.length} result{tasks.length !== 1 ? 's' : ''} found
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setShowForm(true)}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium
                                         rounded-lg shadow-md transition transform hover:scale-105 whitespace-nowrap"
                            >
                                + New Task
                            </button>
                        </div>

                        {/* VIEW SWITCHER & FILTER BUTTON */}
                        <div className="flex justify-between items-center">
                            <ViewSwitcher currentView={currentView} onViewChange={handleViewChange} />

                            <button
                                onClick={() => setShowFilters(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 
                                         rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                <span>🔍</span>
                                <span>Filters</span>
                                {activeFiltersCount > 0 && (
                                    <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* FILTER SIDEBAR */}
                {showFilters && (
                    <FilterSidebar
                        onFilterChange={handleFilterChange}
                        onClose={() => setShowFilters(false)}
                    />
                )}

                {/* CREATE/EDIT TASK MODAL */}
                {showForm && (
                    <TaskForm
                        onClose={handleCloseForm}
                        onCreate={handleFormSubmit}
                        taskToEdit={taskToEdit}
                    />
                )}

                {/* MAIN CONTENT */}
                <main className="p-6 max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading tasks...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-red-600 dark:text-red-400">Failed to load tasks. Please try again.</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500 dark:text-gray-300">
                                {searchTerm || activeFiltersCount > 0
                                    ? 'No tasks found matching your criteria.'
                                    : 'No tasks yet. Create your first one!'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* RENDER BASED ON VIEW */}
                            {currentView === 'kanban' && (
                                <Board tasks={tasks} onEdit={handleEditTask} />
                            )}
                            {currentView === 'list' && (
                                <ListView
                                    tasks={tasks}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                />
                            )}
                            {currentView === 'table' && (
                                <TableView
                                    tasks={tasks}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                />
                            )}

                            {isFetchingNextPage && (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    <p className="mt-3 text-sm text-gray-500">Loading more tasks...</p>
                                </div>
                            )}

                            {!hasNextPage && tasks.length > 10 && (
                                <div className="text-center py-12">
                                    <p className="text-sm text-gray-500 italic">
                                        That's all! You've reached the end.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </DndProvider>
    );
}

export default App;
