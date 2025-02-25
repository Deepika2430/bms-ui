import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Search, Plus } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Task {
  id: string;
  project: string;
  taskType: string;
  taskTitle: string;
  startDate: string;
  endDate: string;
  assignedTo: string;
}

interface TaskTableProps {
  tasks: Task[];
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
}

const TaskTable = ({ tasks, onCreateTask, onEditTask }: TaskTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter((task) =>
    Object.values(task).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-4 pt-4">
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Task Type</TableHead>
              <TableHead>Task Title</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.project}</TableCell>
                <TableCell>{task.taskType}</TableCell>
                <TableCell>{task.taskTitle}</TableCell>
                <TableCell>{task.startDate}</TableCell>
                <TableCell>{task.endDate}</TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onEditTask(task)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskTable;
