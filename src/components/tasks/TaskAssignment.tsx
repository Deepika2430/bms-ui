import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {assignTask} from "@/services/taskService"
import { toast } from "react-toastify";
import { createNotification } from "@/services/notificationService";

interface Task {
  id: string;
  project: string;
  taskType: string;
  taskTitle: string;
  startDate: string;
  endDate: string;
  assignedTo: string;
  status: string;
  priority: string;
  estimatedHours: string;
  description: string;
  assignedBy: string;
  assignedUsers?: any[];
}

interface Consultant {
  id: string;
  name: string;
}

interface TaskAssignmentProps {
  tasks: Task[];
  consultants: Consultant[];
}

const TaskAssignment = ({ tasks, consultants }: TaskAssignmentProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<string>("");

  const handleAssign = async () => {
    if (!selectedTask || !selectedConsultant) {
      toast.error("Please select both task and consultant");
      return;
    }

    try {
      await assignTask(selectedTask.id, selectedConsultant);
      await createNotification(selectedConsultant, `${selectedTask.taskTitle} has been assigned to you(${selectedTask.description})`);
      toast.success(`Task "${selectedTask.taskTitle}" assigned to consultant successfully`);

      // Reset selections after successful assignment
      setSelectedTask(null);
      setSelectedConsultant("");
    } catch (error) {
      toast.error("Failed to assign task");
      console.error("Error assigning task:", error);
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold">Assign Task to Consultant</h2>
      <div className="flex gap-4">
        <Select
          value={selectedTask?.id || ""}
          onValueChange={(taskId) => {
            const task = tasks.find(t => t.id === taskId);
            setSelectedTask(task || null);
          }}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select Task..." />
          </SelectTrigger>
          <SelectContent>
            {tasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.taskTitle} ({task.project})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedConsultant}
          onValueChange={setSelectedConsultant}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select Consultant..." />
          </SelectTrigger>
          <SelectContent>
            {consultants.map((consultant) => (
              <SelectItem key={consultant.id} value={consultant.id}>
                {consultant?.employeeDetails?.firstName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleAssign}
          disabled={!selectedTask || !selectedConsultant}
          className="bg-nav-accent text-white hover:bg-nav-accent/90"
        >
          Assign
        </Button>
      </div>


    </div>
  );
};

export default TaskAssignment;
