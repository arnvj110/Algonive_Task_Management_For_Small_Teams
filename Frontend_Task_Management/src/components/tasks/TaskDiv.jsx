import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../ui/toastFun';

const TaskDiv = ({ task }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(task?.status?.toLowerCase());

  const statusMap = {
    pending: ['bg-yellow-100', 'text-yellow-700', 'bg-yellow-500'],
    inprogress: ['bg-blue-100', 'text-blue-700', 'bg-blue-500'],
    completed: ['bg-green-100', 'text-green-700', 'bg-green-500'],
    expired: ['bg-red-100', 'text-red-700', 'bg-red-500'],
  };

  const [bgColor, textColor, dotColor] = statusMap[status] || ['bg-gray-200', 'text-gray-600', 'bg-gray-500'];

  const handleMarkAsCompleted = (e) => {
    e.stopPropagation();
    setStatus('completed');
    handleSuccess('Task Completed!');
  };

  return (
    <div
      className="group flex flex-col gap-5 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-transform duration-300 hover:shadow-xl
      w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xs xl:max-w-sm min-h-[300px] cursor-pointer hover:scale-[1.02]"
    >
      {/* Top Row: Status + Done Button */}
      <div className="w-full flex justify-between items-center">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgColor} ${textColor} text-sm font-medium`}>
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          {status || 'Unknown'}
        </span>

        {status !== 'completed' && (
          <button
            onClick={handleMarkAsCompleted}
            className="scale-0 group-hover:scale-100 transition-transform duration-300 origin-right text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full shadow-md"
          >
            Done
          </button>
        )}
      </div>

      {/* Title */}
      <div className="w-full min-h-[110px] px-2 py-2 flex items-center justify-center text-lg font-bold text-center text-gray-800 dark:text-white rounded border border-gray-300 dark:border-blue-600 bg-gray-100 dark:bg-gray-800 relative">
        <span className="truncate w-full px-2">{task.title || 'No Title'}</span>
        {task.priority && (
          <span className="absolute right-2 top-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
            {task.priority.toUpperCase()}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="w-full px-2 text-sm text-gray-600 dark:text-gray-300 truncate">
        {task.description || 'No description available.'}
      </div>

      {/* Dates */}
      <div className="flex justify-between w-full text-xs text-gray-600 dark:text-gray-300 px-2">
        <div className="flex flex-col items-start gap-1">
          <span className="text-gray-500 dark:text-gray-400">Created</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {new Date(task.createdAt).toLocaleDateString() || 'N/A'}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-gray-500 dark:text-gray-400">Deadline</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {new Date(task.dueDate).toLocaleDateString() || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskDiv;
