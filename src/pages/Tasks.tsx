import { useState } from "react";
import TaskForm from "@/components/tasks/TaskForm";
import TaskTable from "@/components/tasks/TaskTable";
import TaskAssignment from "@/components/tasks/TaskAssignment";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Tasks = () => {
  const projects = [
    { id: "1", name: "Project A" },
    { id: "2", name: "Project B" },
    { id: "3", name: "Project C" },
  ];

  const consultants = [
    { id: "1", name: "Consultant X" },
    { id: "2", name: "Consultant Y" },
    { id: "3", name: "Consultant Z" },
  ];

  const [tasks, setTasks] = useState([
    { id: "1", project: "Project A", taskType: "Development", taskTitle: "Task 1", startDate: "2023-01-01", endDate: "2023-01-10", assignedTo: "Consultant X" },
    { id: "2", project: "Project B", taskType: "Testing", taskTitle: "Task 2", startDate: "2023-02-01", endDate: "2023-02-10", assignedTo: "Consultant Y" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleTaskSubmit = (data) => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...data, id: task.id } : task)));
    } else {
      setTasks([...tasks, { ...data, id: String(tasks.length + 1) }]);
    }
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleTaskCancel = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleCreateTask = () => {
    setIsDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-nav-accent text-white">
            <CardTitle className="flex justify-between items-center">
              <span>Tasks</span>
              <Button
                onClick={handleCreateTask}
                className="bg-white text-nav-accent hover:bg-gray-100"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TaskTable tasks={tasks} onCreateTask={handleCreateTask} onEditTask={handleEditTask} />
            <TaskAssignment tasks={tasks} consultants={consultants} />
          </CardContent>
        </Card>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle></DialogTitle>
            <TaskForm
              projects={projects}
              onSubmit={handleTaskSubmit}
              onCancel={handleTaskCancel}
              initialData={editingTask}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Tasks;
