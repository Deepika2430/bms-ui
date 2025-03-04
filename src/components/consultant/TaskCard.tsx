import { cn } from "@/lib/utils";
import { Task, User } from "@/lib/types";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";
import { Calendar, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TaskCardProps {
  task: Task;
  assignee: User;
  onClick?: () => void;
  className?: string;
}

const TaskCard = ({ task, assignee, onClick, className }: TaskCardProps) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
  };
  
  return (
    <div 
      className={cn(
        "bg-white text-gray-800 shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-base truncate">{task?.taskTitle}</h3>
        <StatusBadge status={task?.status} />
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{task?.description}</p>
      
      <div className="flex items-center gap-2 mt-1 mb-3">
        <span className={cn("text-xs px-2 py-0.5 rounded-full", priorityColors[task.priority])}>
          {task?.priority?.charAt(0).toUpperCase() + task?.priority?.slice(1)} Priority
        </span>
      </div>
      
      {task.endDate && (
        <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>Due: {format(new Date(task.endDate), "MMM d, yyyy")}</span>
        </div>
      )}
      
      {task.estimatedHours && (
        <div className="flex items-center text-xs text-muted-foreground gap-1 mb-3">
          <Clock className="h-3.5 w-3.5" />
          <span>Est: {task.estimatedHours} hours</span>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={assignee?.avatar} alt={assignee?.name} />
            <AvatarFallback>{assignee?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs">{assignee?.name}</span>
        </div>
        
        <span className="text-xs text-muted-foreground">
          Created at {format(new Date(task?.createdAt), "MMM d")}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
