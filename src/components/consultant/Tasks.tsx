import { useState } from "react";
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

// Sample tasks for demo
const sampleTasks = [
  {
    id: "t1",
    title: "Create Project Proposal",
    description:
      "Draft a detailed project proposal for the client including timeline, resource requirements, and budget estimates",
    status: "in-progress",
    priority: "high",
    assigneeId: "1",
    projectId: "p1",
    createdById: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    estimatedHours: 8,
  },
  {
    id: "t2",
    title: "Client Meeting Preparation",
    description:
      "Prepare slides and talking points for the upcoming client meeting",
    status: "pending",
    priority: "medium",
    assigneeId: "1",
    projectId: "p2",
    createdById: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
    estimatedHours: 3,
  },
  {
    id: "t3",
    title: "Weekly Report",
    description:
      "Compile and submit the weekly progress report for all active projects",
    status: "pending",
    priority: "medium",
    assigneeId: "1",
    projectId: "p3",
    createdById: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours from now
    estimatedHours: 2,
  },
  {
    id: "t4",
    title: "UI Design Review",
    description:
      "Review the latest UI designs for the mobile app and provide feedback",
    status: "in-progress",
    priority: "medium",
    assigneeId: "1",
    projectId: "p2",
    createdById: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    estimatedHours: 4,
  },
  {
    id: "t5",
    title: "Code Refactoring",
    description:
      "Refactor the authentication module for better performance and security",
    status: "pending",
    priority: "high",
    assigneeId: "3",
    projectId: "p2",
    createdById: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    estimatedHours: 12,
  },
  {
    id: "t6",
    title: "Content Strategy",
    description: "Develop a content strategy for the new marketing campaign",
    status: "completed",
    priority: "medium",
    assigneeId: "4",
    projectId: "p3",
    createdById: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    estimatedHours: 6,
    actualHours: 5,
  },
  {
    id: "t7",
    title: "Budget Review",
    description: "Review Q3 budget and prepare report for leadership",
    status: "completed",
    priority: "high",
    assigneeId: "2",
    projectId: "p1",
    createdById: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
    estimatedHours: 8,
    actualHours: 10,
  },
  {
    id: "t8",
    title: "API Documentation",
    description: "Update API documentation with new endpoints and examples",
    status: "in-progress",
    priority: "low",
    assigneeId: "3",
    projectId: "p2",
    createdById: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    estimatedHours: 6,
  },
];

// Sample users
const sampleUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as Role,
    avatar:
      "https://ui-avatars.com/api/?name=Admin+User&background=6d28d9&color=fff",
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@example.com",
    role: "manager" as Role,
    avatar:
      "https://ui-avatars.com/api/?name=Manager+User&background=4f46e5&color=fff",
  },
  {
    id: "3",
    name: "Consultant User",
    email: "consultant@example.com",
    role: "consultant" as Role,
    avatar:
      "https://ui-avatars.com/api/?name=Consultant+User&background=0891b2&color=fff",
  },
  {
    id: "4",
    name: "Associate User",
    email: "associate@example.com",
    role: "associate" as Role,
    avatar:
      "https://ui-avatars.com/api/?name=Associate+User&background=14b8a6&color=fff",
  },
];

const TasksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  // Filter tasks based on search term and filters
  const filteredTasks = sampleTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group tasks by status
  const pendingTasks = filteredTasks.filter(
    (task) => task.status === "pending"
  );
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "in-progress"
  );
  const completedTasks = filteredTasks.filter(
    (task) => task.status === "completed"
  );

  // Find assignee for a task
  const findAssignee = (assigneeId: string) => {
    return sampleUsers.find((user) => user.id === assigneeId) || sampleUsers[0];
  };

  return (
    <div className="space-y-6 page-transition p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-10">
        <div>
          <h1 className="font-semibold">Tasks</h1>
          <p className="text-muted-foreground">
            {filteredTasks.length} tasks found
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
            <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>
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
          <h2 className="text-lg font-medium mb-4">Pending Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  assignee={findAssignee(task.assigneeId)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No pending tasks found
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">In Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  assignee={findAssignee(task.assigneeId)}
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
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  assignee={findAssignee(task.assigneeId)}
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
