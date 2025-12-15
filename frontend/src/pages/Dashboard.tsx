import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import { Link } from "react-router-dom";
import { useTaskSocket } from "../hooks/useTaskSocket";
import { useTheme } from "../context/ThemeContext";
import { Plus, Layout, LogOut, Moon, Sun } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, loading } = useTaskSocket();
  const { theme, toggleTheme } = useTheme(); 
  const getTasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === status);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-indigo-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Layout className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight">
            TaskFlow
          </span>
        </div>

        <div className="flex items-center gap-4">

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-none">
                {user?.name}
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                Admin
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 ring-2 ring-white dark:ring-slate-800">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-hidden">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Board
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Manage your team's tasks and projects
            </p>
          </div>
          <Link
            to="/create-task"
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-lg transition-all active:scale-95 font-medium text-sm"
          >
            <Plus size={18} />
            <span>New Task</span>
          </Link>
        </div>

        {/* Task Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full items-start">
          {["To Do", "In Progress", "Review", "Completed"].map((status) => {
            const columnTasks = getTasksByStatus(status);
            return (
              <div
                key={status}
                className="flex flex-col h-full max-h-[calc(100vh-200px)] bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-2 transition-colors"
              >
                <div className="flex items-center justify-between px-3 py-3 mb-2">
                  <h2 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                    {status}
                  </h2>
                  <span className="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm">
                    {columnTasks.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar px-1 space-y-3 pb-2">
                  {columnTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl m-2 opacity-60">
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full mb-3">
                        <Layout
                          size={24}
                          className="text-slate-400 dark:text-slate-500"
                        />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        No tasks yet
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs text-center mt-1">
                        {status === "To Do"
                          ? "Create a task to get started"
                          : `Move tasks to '${status}'`}
                      </p>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard key={task._id} task={task} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
