// src/App.jsx
import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskForm from './components/TaskForm';
import Board from './components/Board';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getTasksPaginated, searchTasks } from './services/api';

function App() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['tasks', searchTerm],
        queryFn: ({ pageParam = 1 }) => {
            if (searchTerm.trim()) {
                return searchTasks({ searchTerm, page: pageParam, pageSize: 10 });
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
        staleTime: 30_000,
        gcTime: 5 * 60_000,
    });

    const tasks = data?.tasks || [];

    // Infinite scroll
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

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                {/* HEADER */}
                <header className="border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 bg-inherit backdrop-blur-sm z-50">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <h1 className="text-2xl font-bold">Kanban Board</h1>

                        {/* SEARCH BOX */}
                        <div className="flex-1 max-w-md w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search tasks by title or description..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full px-4 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg
                                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                             transition-all"
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
                </header>

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
                                {searchTerm ? 'No tasks found matching your search.' : 'No tasks yet. Create your first one!'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <Board tasks={tasks} onEdit={handleEditTask} />

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