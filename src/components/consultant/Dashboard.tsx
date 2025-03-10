import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardMetrics from "./DashboardMetrics";
import TaskCard from "./TaskCard";
import PieChart from "../ui/charts/PieChart";
import BarChart from "../ui/charts/BarChart";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { getUserDetails } from "@/services/userService";
import { getProjects } from "@/services/projectService";
import { getAssignedTasks, getTasks } from "@/services/taskService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const tasksData = await getAssignedTasks();
      console.log(tasksData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to refresh tasks");
    }
  };

  const fetchAllTasks = async () => {
    try {
      const tasksData = await getTasks();
      console.log(tasksData);
      setAllTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
      toast.error("Failed to load projects");
    }
  };

  const getMetrics = () => {
    return {
      tasksCompleted: tasks.filter((t) => t.status === "completed").length,
      tasksInProgress: tasks.filter((t) => t.status === "in_progress").length,
      tasksPending: tasks.filter((t) => t.status === "open").length,
      hoursLogged: 40,
      timeAllocations: projects.map((project) => ({
        projectId: project.id,
        projectName: project.projectName,
        hours: tasks.filter((task) => task.projectId === project.id).reduce((sum, task) => sum + parseInt(task.estimatedHours, 10), 0),
        percentage: 0, // This can be calculated if needed
      })),
    };
  };

  const fetchUser = async () => {
    try {
      const response = await getUserDetails();
      setUser(response);
      setRole(response.role);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchTasks();
    fetchAllTasks();
  }, []);

  useEffect(() => {
    if (role === "manager") {
      fetchProjects();
    }
  }, [role]);

  useEffect(() => {
    setMetrics(getMetrics());
  }, [tasks, projects]);

  // Prepare chart data
  const pieChartData = role === "manager"
    ? projects.map((project) => ({
        name: project.projectName,
        value: allTasks.filter((task) => task.projectId === project.id).length,
        color: getRandomColor(project.id),
        tooltip: `${allTasks.filter((task) => task.projectId === project.id).length} tasks`,
      }))
    : [
        {
          name: "Open",
          value: tasks.filter((task) => task.status === "open").length,
          color: getRandomColor("open"),
          tooltip: `${tasks.filter((task) => task.status === "open").length} tasks`,
        },
        {
          name: "In Progress",
          value: tasks.filter((task) => task.status === "in_progress").length,
          color: getRandomColor("in_progress"),
          tooltip: `${tasks.filter((task) => task.status === "in_progress").length} tasks`,
        },
        {
          name: "Completed",
          value: tasks.filter((task) => task.status === "completed").length,
          color: getRandomColor("completed"),
          tooltip: `${tasks.filter((task) => task.status === "completed").length} tasks`,
        },
      ];

  const barChartData = [
    {
      name: "Mon",
      hours: 8,
    },
    {
      name: "Tue",
      hours: 10,
    },
    {
      name: "Wed",
      hours: 7,
    },
    {
      name: "Thu",
      hours: 9,
    },
    {
      name: "Fri",
      hours: 6,
    },
    {
      name: "Sat",
      hours: 0,
    },
    {
      name: "Sun",
      hours: 0,
    },
  ];

  // Helper function to get random color based on ID
  function getRandomColor(id: string) {
    const colors = [
      "#3b82f6", // blue
      "#8b5cf6", // violet
      "#ec4899", // pink
      "#f97316", // orange
      "#10b981", // emerald
      "#06b6d4", // cyan
      "#6366f1", // indigo
    ];

    // Use the id's charCode sum to determine the color
    const charCodeSum = id
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return colors[charCodeSum % colors.length];
  }

  return (
    <div className="space-y-6 page-transition overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-2xl">Welcome back, {user?.firstName} {user?.lastName}</p>
        </div>
      </div>

      {metrics && <DashboardMetrics metrics={metrics} />} {/* Ensure metrics is not null */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-100">
        {role === "manager" && (
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Project Tasks Overview</h2> {/* Updated title */}
            </div>
            <PieChart data={pieChartData} className="h-48" tooltipKey="tooltip" /> {/* Pass tooltipKey prop */}
          </div>
        )}

        {role === "consultant" && (
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Task Distribution</h2>
            </div>
            <PieChart data={pieChartData} className="h-48" tooltipKey="tooltip" /> {/* Pass tooltipKey prop */}
          </div>
        )}

        <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Hours Logged</h2>
          </div>
          <BarChart
            data={barChartData}
            bars={[
              {
                key: "hours",
                name: "Hours",
                color: "#3b82f6",
              },
            ]}
            className="h-48"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">My Tasks</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                assignee={task?.assignedBy}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
