
import { cn } from "@/lib/utils";
import { Status } from "@/lib/types";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusClass = (status: Status) => {
    switch (status) {
      case "pending":
        return "status-badge-pending";
      case "in-progress":
        return "status-badge-in-progress";
      case "completed":
        return "status-badge-completed";
      case "cancelled":
        return "status-badge-cancelled";
      default:
        return "status-badge-pending";
    }
  };

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in-progress":
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
    <span className={cn("status-badge", getStatusClass(status), className)}>
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
