import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTasks = async () => {
        try {
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            setError("Unable to connect to the backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async (event) => {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            const newTask = await response.json();

            setTasks((currentTasks) => [newTask, ...currentTasks]);
            setTitle("");
        } catch (error) {
            setError("Unable to add the task.");
        }
    };

    const toggleTask = async (task) => {
        try {
            const response = await fetch(`${API_URL}/${task._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    completed: !task.completed,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            const updatedTask = await response.json();

            setTasks((currentTasks) =>
                currentTasks.map((item) =>
                    item._id === updatedTask._id ? updatedTask : item
                )
            );
        } catch (error) {
            setError("Unable to update the task.");
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task._id !== id)
            );
        } catch (error) {
            setError("Unable to delete the task.");
        }
    };

    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = tasks.filter((task) => !task.completed).length;

    return (
        <div className="app">

            {/* Background decoration */}
            <div className="background-shape shape-one"></div>
            <div className="background-shape shape-two"></div>

            <main className="dashboard">

                {/* Header */}
                <header className="header">
                    <div>
                        <div className="brand">
                            <div className="brand-icon">✓</div>
                            <span>TaskFlow</span>
                        </div>

                        <h1>
                            Organize your work.
                            <span> Get things done.</span>
                        </h1>

                        <p className="subtitle">
                            A simple task management application built and
                            DevOpsified from the ground up.
                        </p>
                    </div>

                    <div className="status">
                        <span className="status-dot"></span>
                        System Online
                    </div>
                </header>

                {/* Statistics */}
                <section className="stats">

                    <div className="stat-card">
                        <div className="stat-icon total-icon">
                            ☷
                        </div>

                        <div>
                            <p>Total Tasks</p>
                            <h2>{tasks.length}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon pending-icon">
                            ◷
                        </div>

                        <div>
                            <p>Pending</p>
                            <h2>{pendingTasks}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon completed-icon">
                            ✓
                        </div>

                        <div>
                            <p>Completed</p>
                            <h2>{completedTasks}</h2>
                        </div>
                    </div>

                </section>

                {/* Add Task */}
                <section className="add-task-card">

                    <div className="section-heading">
                        <div>
                            <h2>Create a new task</h2>
                            <p>Add something you want to accomplish.</p>
                        </div>
                    </div>

                    <form onSubmit={addTask} className="task-form">

                        <div className="input-wrapper">
                            <span>＋</span>

                            <input
                                type="text"
                                placeholder="What needs to be done?"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                            />
                        </div>

                        <button type="submit" className="add-button">
                            Add Task
                        </button>

                    </form>

                </section>

                {/* Task list */}
                <section className="tasks-card">

                    <div className="tasks-header">
                        <div>
                            <h2>Your Tasks</h2>
                            <p>
                                {tasks.length === 0
                                    ? "No tasks yet"
                                    : `${tasks.length} ${
                                          tasks.length === 1
                                              ? "task"
                                              : "tasks"
                                      } in your list`}
                            </p>
                        </div>

                        <div className="task-count">
                            {completedTasks}/{tasks.length} done
                        </div>
                    </div>

                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="empty-state">
                            <div className="loader"></div>
                            <p>Loading your tasks...</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">✓</div>
                            <h3>You're all caught up!</h3>
                            <p>
                                Add your first task above to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="task-list">

                            {tasks.map((task) => (
                                <div
                                    className={`task-item ${
                                        task.completed
                                            ? "task-completed"
                                            : ""
                                    }`}
                                    key={task._id}
                                >

                                    <label className="task-left">

                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() =>
                                                toggleTask(task)
                                            }
                                        />

                                        <span className="custom-checkbox">
                                            {task.completed && "✓"}
                                        </span>

                                        <span className="task-title">
                                            {task.title}
                                        </span>

                                    </label>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            deleteTask(task._id)
                                        }
                                        title="Delete task"
                                    >
                                        🗑
                                    </button>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

                {/* Footer */}
                <footer>
                    <span>TaskFlow</span>
                    <span>•</span>
                    <span>Built with React + Node.js + MongoDB</span>
                </footer>

            </main>
        </div>
    );
}

export default App;