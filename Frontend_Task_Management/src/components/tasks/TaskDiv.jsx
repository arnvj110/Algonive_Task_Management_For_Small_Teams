import React, { useState } from 'react';
import { Calendar, Clock, User, Flag, CheckCircle2, AlertCircle, Play, XCircle, Trash2, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserById } from '../../hooks/useUser';
import { useTasks } from '../../contexts/TasksContext';

const TaskDiv = ({ task }) => {
  const { user } = useAuth();
  const { updateTask, deleteTask } = useTasks(); 
  const [status, setStatus] = useState(task?.status?.toLowerCase());
  const { data: createdByUser } = useUserById(task.createdBy);
  
  // Check if current user can interact with this task
  const isMyTask = task.assignedTo === user._id || task.createdBy === user._id;
  
  const canUpdateStatus = task.assignedTo === user._id;
  const canDelete = task.createdBy === user._id; // Only creator can delete
  
  const statusConfig = {
    pending: {
      colors: ['bg-amber-50', 'text-amber-700', 'bg-amber-500', 'border-amber-200', 'shadow-amber-100'],
      icon: AlertCircle,
      label: 'Pending'
    },
    inprogress: {
      colors: ['bg-blue-50', 'text-blue-700', 'bg-blue-500', 'border-blue-200', 'shadow-blue-100'],
      icon: Play,
      label: 'In Progress'
    },
    completed: {
      colors: ['bg-emerald-50', 'text-emerald-700', 'bg-emerald-500', 'border-emerald-200', 'shadow-emerald-100'],
      icon: CheckCircle2,
      label: 'Completed'
    },
    expired: {
      colors: ['bg-red-50', 'text-red-700', 'bg-red-500', 'border-red-200', 'shadow-red-100'],
      icon: XCircle,
      label: 'Expired'
    },
  };

  const handleStatusUpdate = async () => {
    if (!canUpdateStatus) {
      alert("You are not assigned to this task.");
      return;
    }
    let nextStatus = null;
    if (status === "pending") nextStatus = "inprogress";
    else if (status === "inprogress") nextStatus = "completed";
    if (nextStatus) {
      await updateTask.mutateAsync({ taskId: task._id, updates: { status: nextStatus } });
      setStatus(nextStatus);
      
    }
  };

  const handleDelete = async () => {
    if (!canDelete) {
      alert("Only the task creator can delete this task.");
      return;
    }
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      await deleteTask.mutateAsync(task._id);
    }
  };

  const currentStatus = statusConfig[status] || {
    colors: ['bg-gray-50', 'text-gray-600', 'bg-gray-400', 'border-gray-200'],
    icon: AlertCircle,
    label: 'Unknown'
  };

  const [bgColor, textColor, dotColor, borderColor] = currentStatus.colors;
  const StatusIcon = currentStatus.icon;

  const priorityConfig = {
    high: { color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200', label: 'HIGH' },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200', label: 'MED' },
    low: { color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200', label: 'LOW' }
  };

  const priority = task?.priority?.toLowerCase();
  const priorityStyle = priorityConfig[priority] || { 
    color: 'text-gray-500', 
    bg: 'bg-gray-100', 
    border: 'border-gray-200',
    label: 'N/A' 
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = task?.dueDate && new Date(task.dueDate) < new Date() && status !== 'completed';

  return (
    <div className="flex justify-center p-4">
      <div className={`
        group relative flex flex-col gap-4 p-6 
        bg-white dark:bg-gray-700 
        rounded-2xl shadow-lg hover:shadow-xl 
        border border-gray-200 dark:border-gray-700 
        transition-all duration-300 ease-out
        hover:scale-[1.02] 
        w-full max-w-sm min-h-[380px] 
         
        ${status === 'completed' ? 'opacity-90' : ''}
        
        ${!isMyTask ? 'border-gray-300 dark:border-gray-600' : ''}
      `}>
        
        {/* Decorative top border based on status */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${dotColor}`}></div>
        
        {/* Task ownership indicator */}
        {!isMyTask && (
          <div className="absolute top-3 left-3 bg-gray-500/80 text-white rounded-full p-1">
            <Lock size={12} />
          </div>
        )}
        
        {/* Header with Status and Priority */}
        <div className="flex justify-between items-start gap-3">
          <div className={`
            inline-flex items-center gap-2 px-3 py-2 
            rounded-full ${bgColor} ${textColor} 
            text-sm font-semibold ${borderColor} border 
            transition-all duration-200 
            shadow-sm hover:shadow-md
          `}>
            <StatusIcon size={14} className="opacity-90" />
            {currentStatus.label}
          </div>
          
          {task?.priority && (
            <div className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 
              rounded-lg ${priorityStyle.bg} ${priorityStyle.color} 
              text-xs font-bold tracking-wide ${priorityStyle.border} border
              shadow-sm
            `}>
              <Flag size={12} />
              {priorityStyle.label}
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="relative group">
          <div className={`
            w-full min-h-[120px] p-5 
            flex items-center justify-center text-center 
            rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 
            dark:from-gray-700 dark:to-gray-800 
            border border-gray-200 dark:border-gray-600 
            group-hover:border-gray-300 dark:group-hover:border-gray-500 
            transition-all duration-300
            
            ${status === 'completed' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20' : ''}
          `}>
            <h3 className={`
              text-lg font-bold leading-tight break-words w-full px-2
              ${status === 'completed' 
                ? 'text-emerald-800 dark:text-emerald-200 line-through decoration-2' 
                : 'text-gray-800 dark:text-white'
              }
            `}>
              {task?.title || 'Untitled Task'}
            </h3>
          </div>
          
          {/* Completion indicator overlay */}
          {status === 'completed' && (
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-2 shadow-lg ">
              <CheckCircle2 size={16} />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="px-1 flex-1">
          <p className={`
            text-sm leading-relaxed line-clamp-3
            ${status === 'completed' 
              ? 'text-gray-500 dark:text-gray-400' 
              : 'text-gray-600 dark:text-gray-300'
            }
          `}>
            {task?.description || 'No description provided for this task.'}
          </p>
        </div>

        {/* Footer Information */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-3 gap-4 text-xs mb-4">
            {/* Created Date */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Calendar size={12} />
                <span className="font-medium">Created</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                {formatDate(task?.createdAt)}
              </span>
            </div>

            {/* Creator */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <User size={12} />
                <span className="font-medium">Creator</span>
              </div>
              <span 
                className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-full text-xs" 
                title={createdByUser?.name || 'Unknown'}
              >
                {createdByUser?.name || 'Unknown'}
              </span>
            </div>

            {/* Due Date */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className={`
                flex items-center gap-1 
                ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
              `}>
                <Clock size={12} />
                <span className="font-medium">Due</span>
              </div>
              <span className={`
                font-semibold text-xs
                ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}
              `}>
                {formatDate(task?.dueDate)}
              </span>
            </div>
          </div>

          {/* Action Buttons - Only show if user has permissions */}
          {isMyTask ? (
            <div className="relative overflow-hidden ">
  <div className="flex gap-2">
    {(status === "pending" || status === "inprogress") && canUpdateStatus ? (
      <>
        <button
          onClick={handleStatusUpdate}
          className="flex-grow flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer"
        >
          {status === "pending" ? (
            <>
              <Play size={16} />
              Start Task
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Complete
            </>
          )}
        </button>

        {canDelete && (
          <button
            onClick={handleDelete}
            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </>
    ) : status === "completed" ? (
      <div className="w-full h-10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-medium">
        <CheckCircle2 size={16} className="mr-2" />
        Task Completed
      </div>
    ) : (
      <div className="w-full h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
        View Only
      </div>
    )}
  </div>
</div>

          ) : (
            /* No permissions - show read-only indicator */
            <div className="w-full h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg">
              <Lock size={14} className="mr-2" />
              Team Task - View Only
            </div>
          )}
        </div>

        {/* Overdue indicator */}
        {isOverdue && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
            OVERDUE
          </div>
        )}

        {/* Progress indicator for completed tasks */}
        {status === 'completed' && (
          <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

export default TaskDiv;