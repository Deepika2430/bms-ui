import React, { useState } from 'react';
import { Calendar, Clock, Edit, Trash2, CheckCircle, XCircle, User, Briefcase } from 'lucide-react';

export interface TaskProps {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  project?: string;
  hoursLogged?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

const Task: React.FC<TaskProps> = ({
  id,
  title,
  description,
  assignedTo,
  dueDate,
  status,
  priority,
  project,
  hoursLogged = 0,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityClasses = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusClasses = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
  };

  const statusIcons = {
    pending: <Clock size={16} />,
    'in-progress': <User size={16} />,
    completed: <CheckCircle size={16} />,
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div
        className="p-4 cursor-pointer flex justify-between items-start"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="font-semibold text-lg text-gray-800 mr-2">{title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${priorityClasses[priority]}`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            {project && (
              <div className="flex items-center mr-4">
                <Briefcase size={16} className="mr-1" />
                <span>{project}</span>
              </div>
            )}
            {assignedTo && (
              <div className="flex items-center mr-4">
                <User size={16} className="mr-1" />
                <span>{assignedTo}</span>
              </div>
            )}
            {dueDate && (
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{dueDate}</span>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <span className={`flex items-center text-xs px-2 py-1 rounded-full ${statusClasses[status]}`}>
              {statusIcons[status]}
              <span className="ml-1">{status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
            </span>
            {hoursLogged > 0 && (
              <span className="ml-3 text-xs flex items-center text-gray-600">
                <Clock size={14} className="mr-1" />
                {hoursLogged}h logged
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Edit size={18} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100">
          <p className="text-gray-700 mb-4">{description}</p>

          {onStatusChange && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onStatusChange(id, 'pending')}
                className={`px-3 py-1 text-xs rounded-full flex items-center ${
                  status === 'pending'
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Clock size={14} className="mr-1" />
                Pending
              </button>
              <button
                onClick={() => onStatusChange(id, 'in-progress')}
                className={`px-3 py-1 text-xs rounded-full flex items-center ${
                  status === 'in-progress'
                    ? 'bg-purple-200 text-purple-800'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                <User size={14} className="mr-1" />
                In Progress
              </button>
              <button
                onClick={() => onStatusChange(id, 'completed')}
                className={`px-3 py-1 text-xs rounded-full flex items-center ${
                  status === 'completed'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                <CheckCircle size={14} className="mr-1" />
                Completed
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Task;