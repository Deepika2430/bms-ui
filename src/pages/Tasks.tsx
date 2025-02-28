import { useState, useEffect } from "react";
import TaskForm from "@/components/tasks/TaskForm";
import TaskTable from "@/components/tasks/TaskTable";
import TaskAssignment from "@/components/tasks/TaskAssignment";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/services/projectService";
import { getConsultants } from "@/services/consultantService";
import { createTask, getTasks, updateTask, deleteTask } from "@/services/taskService";
import { toast } from "react-toastify";

const Tasks = () => {
  const [projects, setProjects] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [viewingTask, setViewingTask] = useState(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const projectsData = await getProjects();
        const consultantsData = await getConsultants();
        setProjects(projectsData);
        setConsultants(consultantsData);
      } catch (error) {
        console.error("Error fetching master data:", error);
        toast.error("Failed to load projects and consultants");
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load tasks");
      }
    };
    fetchTasks();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const refreshTasks = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to refresh tasks");
    }
  };

  const handleViewTask = (task) => {
    const formattedTask = {
      projectId: task.projectId,
      taskTitle: task.taskTitle,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      status: task.status,
      priority: task.priority,
      estimatedHours: task.estimatedHours,
      assignedBy: task.assignedById,
      assignedUsers: task.assignedUsers,
    };
    setViewingTask({ ...formattedTask, id: task.id });
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEditTask = (task) => {
    const formattedTask = {
      projectId: task.projectId,
      taskTitle: task.taskTitle,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      status: task.status,
      priority: task.priority,
      estimatedHours: task.estimatedHours,
      assignedTo: task.assignedToId,
      assignedBy: task.assignedById,
    };
    setEditingTask({ ...formattedTask, id: task.id });
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleTaskSubmit = async (data) => {
    try {
      const task = {
        project_id: data.projectId,
        title: data.taskTitle,
        description: data.description || "",
        status: data.status,
        priority: data.priority,
        estimated_hours: data.estimatedHours,
        assigned_to: data.assignedTo,
        start_date: data.startDate,
        due_date: data.endDate,
      };

      if (editingTask) {
        console.log(task);
        await updateTask(editingTask.id, task);
        toast.success("Task updated successfully");
      } else {
        await createTask(task);
        toast.success("Task created successfully");
      }

      await refreshTasks();
      setIsDialogOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error creating/updating task:", error);
      toast.error("Failed to create/update task");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
    setViewingTask(null);
    setDialogMode('create');
  };

  const handleCreateTask = () => {
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully");
      await refreshTasks(); // Refresh the task list
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
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
            <TaskTable
              tasks={tasks}
              onCreateTask={handleCreateTask}
              onEditTask={handleEditTask}
              onViewTask={handleViewTask}
              onDeleteTask={handleDeleteTask}
            />
            <TaskAssignment tasks={tasks} consultants={consultants} />
          </CardContent>
        </Card>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleDialogClose();
          }}
        >
          <DialogContent
            className="max-w-4xl max-h-[90vh] overflow-y-auto"
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogTitle>
              {dialogMode === 'view' ? 'Task Details' :
               dialogMode === 'edit' ? 'Edit Task' : 'Create Task'}
            </DialogTitle>
            <TaskForm
              projects={projects}
              consultants={consultants}
              submitData={handleTaskSubmit}
              onCancel={handleDialogClose}
              initialData={dialogMode === 'edit' ? editingTask : viewingTask}
              readOnly={dialogMode === 'view'}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Tasks;
