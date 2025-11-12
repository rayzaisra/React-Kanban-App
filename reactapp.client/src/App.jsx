// src/App.jsx
import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskForm from './components/TaskForm';
import Board from './components/Board';
import { getAllTasks } from './services/api';

function App() {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);  // ← This controls modal
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await getAllTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {/* HEADER */}
                <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Kanban Board</h1>
                    <button
                        onClick={() => {
                            setShowForm(true);                // ← This triggers modal
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
                    >
                        + New Task
                    </button>
                </header>

                {/* MODAL – ONLY SHOW WHEN showForm === true */}
                {showForm && (
                    <TaskForm
                        onClose={() => {
                            setShowForm(false);
                        }}
                        onCreate={() => {
                            fetchTasks();     // Refresh list
                            setShowForm(false); // Close modal
                        }}
                    />
                )}

                {/* MAIN CONTENT */}
                <main className="p-6">
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="mt-2">Loading tasks...</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <p className="text-center text-gray-500">No tasks yet. Create one!</p>
                    ) : (
                        <Board tasks={tasks} setTasks={setTasks} fetchTasks={fetchTasks} />
                    )}
                </main>
            </div>
        </DndProvider>
    );
}

export default App;