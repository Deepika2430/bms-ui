import { cn } from "@/lib/utils";
import { Status } from "@/lib/types";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusClass = (status: Status) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500";
    }
  };

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getStatusClass(status), className)}>
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
