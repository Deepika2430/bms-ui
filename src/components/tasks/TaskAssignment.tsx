import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Task {
  id: string;
  project: string;
  taskType: string;
  taskTitle: string;
  startDate: string;
  endDate: string;
  assignedTo: string;
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
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState("");
  const [isBillable, setIsBillable] = useState(false);

  const handleAssign = () => {
    // Logic to assign the task to the consultant
    console.log(`Assigned task ${selectedTask} to consultant ${selectedConsultant} (Billable: ${isBillable})`);
  };

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold">Assign Task to Consultant</h2>
      <div className="flex gap-4">
        <Select onValueChange={setSelectedTask} defaultValue="">
          <SelectTrigger>
            <SelectValue placeholder="Select Task..." />
          </SelectTrigger>
          <SelectContent>
            {tasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.taskTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedConsultant} defaultValue="">
          <SelectTrigger>
            <SelectValue placeholder="Select Consultant..." />
          </SelectTrigger>
          <SelectContent>
            {consultants.map((consultant) => (
              <SelectItem key={consultant.id} value={consultant.id}>
                {consultant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Checkbox checked={isBillable} onCheckedChange={setIsBillable} />
          <label>Billable</label>
        </div>
        <Button onClick={handleAssign} disabled={!selectedTask || !selectedConsultant}>
          Assign
        </Button>
      </div>
    </div>
  );
};

export default TaskAssignment;
