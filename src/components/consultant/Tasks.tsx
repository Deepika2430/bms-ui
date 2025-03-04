import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { getAssignedTasks } from "@/services/taskService";

const TasksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAssignedTasks();
        setTasks(response);
      } catch (error) {
        setTasks([]);
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Filter tasks based on search term and filters
  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch =
      task?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task?.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group tasks by status
  const pendingTasks = filteredTasks?.filter(
    (task) => task.status === "open"
  );
  const inProgressTasks = filteredTasks?.filter(
    (task) => task.status === "in_progress"
  );
  const completedTasks = filteredTasks?.filter(
    (task) => task.status === "completed"
  );

  return (
    <div className="space-y-6 page-transition p-8 bg-white dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-10">
        <div>
          <h1 className="font-semibold text-2xl">Tasks</h1>
          <p className="text-muted-foreground">
            {filteredTasks?.length} tasks found
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Status</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter("")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("open")}>
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("in_progress")}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
              Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Priority</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setPriorityFilter("")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("low")}>
              Low
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("high")}>
              High
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Open Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTasks?.length > 0 ? (
              pendingTasks?.map((task) => (
                <TaskCard
                  key={task?.id}
                  task={task}
                  assignee={task?.assignedBy}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No open tasks found
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">In Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressTasks?.length > 0 ? (
              inProgressTasks?.map((task) => (
                <TaskCard
                  key={task?.id}
                  task={task}
                  assignee={task?.assignedBy}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No tasks in progress
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Completed Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTasks?.length > 0 ? (
              completedTasks?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  assignee={task?.assignedBy}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No completed tasks found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
