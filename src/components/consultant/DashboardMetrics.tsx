
import { cn } from "@/lib/utils";
import { ProductivityMetrics } from "@/lib/types";
import {
  CheckCircle,
  Clock,
  List,
  ArrowUp,
  ArrowDown,
  MinusCircle,
} from "lucide-react";

interface DashboardMetricsProps {
  metrics: ProductivityMetrics;
  className?: string;
}

const DashboardMetrics = ({ metrics, className }: DashboardMetricsProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
            <h3 className="text-2xl font-semibold mt-1">
              {metrics.tasksCompleted + metrics.tasksInProgress + metrics.tasksPending}
            </h3>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
            <List className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            <span>{metrics.tasksCompleted} Completed</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">In Progress</p>
            <h3 className="text-2xl font-semibold mt-1">{metrics.tasksInProgress}</h3>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
            <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {metrics.tasksInProgress > 0 ? (
            <>
              <ArrowUp className="h-3 w-3 inline mr-1 text-green-500" />
              <span>Active tasks need attention</span>
            </>
          ) : (
            <>
              <MinusCircle className="h-3 w-3 inline mr-1 text-gray-500" />
              <span>No tasks in progress</span>
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <h3 className="text-2xl font-semibold mt-1">{metrics.tasksPending}</h3>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
            <List className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {metrics.tasksPending > 5 ? (
            <>
              <ArrowUp className="h-3 w-3 inline mr-1 text-red-500" />
              <span>High number of pending tasks</span>
            </>
          ) : (
            <>
              <ArrowDown className="h-3 w-3 inline mr-1 text-green-500" />
              <span>Pending tasks under control</span>
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Hours Logged</p>
            <h3 className="text-2xl font-semibold mt-1">{metrics.hoursLogged}</h3>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <span>
            Across {metrics.timeAllocations.length} projects this week
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
