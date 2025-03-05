import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TimesheetEventProps {
  event: {
    title: string;
    start: Date;
    task: string;
    hours: string;
    desc: string;
    status: 'pending' | 'approved' | 'rejected';
    taskName: string;
    taskDescription: string;
    taskStatus: string;
    id: string;
  };
  assignedTasks: any[];
  readOnly?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    case 'rejected':
      return <XCircle className="h-3 w-3 text-red-500" />;
    default:
      return <Clock className="h-3 w-3 text-yellow-500" />;
  }
};

const getTaskColor = (taskId: string, assignedTasks: any[]) => {
  const task = assignedTasks.find(t => t.id === taskId);
  return task?.project
    ? "bg-blue-100 text-blue-800 border-blue-200"
    : "bg-gray-100 text-gray-800 border-gray-200";
};

export function TimesheetEventComponent({ event, assignedTasks, readOnly, onApprove, onReject }: TimesheetEventProps) {
  const task = assignedTasks.find(t => t.id === event.task);

  // For manager view, show simplified version
  if (readOnly) {
    return (
      <div
        className={cn(
          "px-2 py-1 rounded-sm border text-sm cursor-pointer transition-all",
          "hover:shadow-sm",
          event.status === 'approved' && "bg-green-50 border-green-200",
          event.status === 'rejected' && "bg-red-50 border-red-300",
          event.status === 'pending' && "bg-yellow-50 border-yellow-200"
        )}
      >
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-black">{event.hours} hrs</span>
            {getStatusIcon(event.status)}<span className="text-black">{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Regular view for non-manager users
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "px-2 py-1 rounded-sm border text-sm max-w-full overflow-hidden whitespace-nowrap text-ellipsis transition-all",
              getTaskColor(event.task, assignedTasks),
              !readOnly && "cursor-pointer hover:shadow-sm"
            )}
          >
            <div className="font-medium flex items-center justify-between gap-1">
              <span>{event.taskName || 'Unknown Task'}</span>
              {getStatusIcon(event.status)}
            </div>
            <div className="text-xs flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {event.hours} hrs
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  event.status === 'approved' && "bg-green-50 text-green-700",
                  event.status === 'rejected' && "bg-red-50 text-red-700",
                  event.status === 'pending' && "bg-yellow-50 text-yellow-700"
                )}
              >
                {getStatusIcon(event.status)}
                <span className="ml-1">{event.status}</span>
              </Badge>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          className="p-4 max-w-xs bg-white border border-indigo-100 shadow-lg z-[100] "
          sideOffset={5}
          // side="right"
          // align="start"
        >
          <div>
            <div className="font-bold mb-1 flex items-center justify-between">
              {event.taskName}
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 capitalize">
                {event.taskStatus.replace('_', ' ')}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {format(event.start, "PPPP")} · {event.hours} hours
            </div>
            {event.taskDescription && (
              <div className="text-sm mb-2 bg-gray-50 p-2 rounded-md border border-gray-100">
                <p className="text-sm text-gray-600">{event.taskDescription}</p>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  event.status === 'approved' && "bg-green-50 text-green-700",
                  event.status === 'rejected' && "bg-red-50 text-red-700",
                  event.status === 'pending' && "bg-yellow-50 text-yellow-700"
                )}
              >
                {getStatusIcon(event.status)}
                <span className="ml-1">{event.status}</span>
              </Badge>
            </div>
            {event.desc && (
              <div className="text-sm mt-2">
                <Label className="text-xs text-gray-500">Notes</Label>
                <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                  <p className="text-sm">{event.desc}</p>
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}