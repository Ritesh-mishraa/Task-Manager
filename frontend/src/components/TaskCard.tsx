import type { Task } from '../types';
import api from '../services/api';
import { Clock, Trash2, User as UserIcon } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

const priorityConfig: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  Medium: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  High: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
  Urgent: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
};

const TaskCard = ({ task }: TaskCardProps) => {
  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.patch(`/tasks/${task._id}`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Delete this task?')) {
      await api.delete(`/tasks/${task._id}`);
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-200 flex flex-col gap-3 relative">

      <div className="flex justify-between items-start">
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${priorityConfig[task.priority]}`}>
          {task.priority}
        </span>
        <button
          onClick={handleDelete}
          className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          title="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>

    
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base leading-tight mb-1">{task.title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">{task.description}</p>
      </div>

    
      <div className="h-px bg-slate-100 dark:bg-slate-700 w-full" />

  
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
          <Clock size={12} />
          <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>

        <div className="flex items-center gap-1.5" title={task.assignedToId?.name || 'Unassigned'}>
          {task.assignedToId ? (
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px] border border-white dark:border-slate-600 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
              {task.assignedToId.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center border border-white dark:border-slate-600 border-dashed">
              <UserIcon size={12} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
        <div className="relative">
          <select
            className="w-full text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md py-1.5 pl-2 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="To Do">Move to: To Do</option>
            <option value="In Progress">Move to: In Progress</option>
            <option value="Review">Move to: Review</option>
            <option value="Completed">Move to: Completed</option>
          </select>
        
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
    </div>
    );
};

        export default TaskCard;