import { useState, useEffect } from "react";
import DashboardMetrics from "./DashboardMetrics";
import TaskCard from "./TaskCard";
import ProjectCard from "./ProjectCard";
import PieChart from "../ui/charts/PieChart";
import BarChart from "../ui/charts/BarChart";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus } from "lucide-react";
import { getRole } from "@/services/authService";
import { getUserDetails } from "@/services/userService";

// Sample data for the dashboard
const sampleTasks: Task[] = [
  {
    id: "t1",
    title: "Create Project Proposal",
    description: "Draft a detailed project proposal for the client including timeline, resource requirements, and budget estimates",
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
    description: "Prepare slides and talking points for the upcoming client meeting",
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
    description: "Compile and submit the weekly progress report for all active projects",
    status: "pending",
    priority: "medium",
    assigneeId: "1",
    projectId: "p3",
    createdById: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours from now
    estimatedHours: 2,
  },
];

const sampleProjects: Project[] = [
  {
    id: "p1",
    name: "Website Redesign",
    clientId: "c1",
    description: "Complete overhaul of the client's corporate website with new branding and improved UX",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
    status: "in-progress",
    managerId: "2",
    teamMemberIds: ["1", "3", "4"],
    budget: 45000,
  },
  {
    id: "p2",
    name: "Mobile App Development",
    clientId: "c2",
    description: "Development of a new mobile application for product catalog and customer engagement",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45), // 45 days from now
    status: "in-progress",
    managerId: "2",
    teamMemberIds: ["1", "3"],
    budget: 65000,
  },
  {
    id: "p3",
    name: "Digital Marketing Campaign",
    clientId: "c3",
    description: "Planning and execution of a comprehensive digital marketing campaign for Q4 product launch",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days from now
    status: "pending",
    managerId: "2",
    teamMemberIds: ["1", "4"],
    budget: 30000,
  },
];

const sampleClients: Client[] = [
  {
    id: "c1",
    name: "TechCorp Inc.",
    contactPerson: "John Smith",
    email: "john@techcorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Blvd, San Francisco, CA",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120), // 120 days ago
  },
  {
    id: "c2",
    name: "Acme Solutions",
    contactPerson: "Jane Doe",
    email: "jane@acmesolutions.com",
    phone: "+1 (555) 987-6543",
    address: "456 Innovation Ave, Boston, MA",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
  },
  {
    id: "c3",
    name: "Global Enterprises",
    contactPerson: "Robert Johnson",
    email: "robert@globalent.com",
    phone: "+1 (555) 456-7890",
    address: "789 Business Rd, Chicago, IL",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
  },
];

const sampleUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as Role,
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=6d28d9&color=fff",
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@example.com",
    role: "manager" as Role,
    avatar: "https://ui-avatars.com/api/?name=Manager+User&background=4f46e5&color=fff",
  },
  {
    id: "3",
    name: "Consultant User",
    email: "consultant@example.com",
    role: "consultant" as Role,
    avatar: "https://ui-avatars.com/api/?name=Consultant+User&background=0891b2&color=fff",
  },
  {
    id: "4",
    name: "Associate User",
    email: "associate@example.com",
    role: "associate" as Role,
    avatar: "https://ui-avatars.com/api/?name=Associate+User&background=14b8a6&color=fff",
  },
];

const sampleTimeAllocations: TimeAllocation[] = [
  {
    projectId: "p1",
    projectName: "Website Redesign",
    hours: 16,
    percentage: 40,
  },
  {
    projectId: "p2",
    projectName: "Mobile App Development",
    hours: 12,
    percentage: 30,
  },
  {
    projectId: "p3",
    projectName: "Digital Marketing Campaign",
    hours: 8,
    percentage: 20,
  },
  {
    projectId: "p4",
    projectName: "Internal Training",
    hours: 4,
    percentage: 10,
  },
];

const sampleProductivityMetrics: ProductivityMetrics = {
  tasksCompleted: 12,
  tasksInProgress: 8,
  tasksPending: 5,
  hoursLogged: 40,
  timeAllocations: sampleTimeAllocations,
};

const Dashboard = () => {
//   const { user } = getRole();
  const [metrics, setMetrics] = useState<ProductivityMetrics>(sampleProductivityMetrics);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [user, setUser] =  useState(null);
 
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await getUserDetails();
          setUser(response);
          console.log(response);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
        }
        fetchUser();
    }, []);
  // Get user data and filter tasks accordingly
  useEffect(() => {
    // In a real app, we would fetch data from API here
    // For the demo, we'll use the sample data
  }, [user?.id]);

  // Prepare chart data
  const pieChartData = metrics.timeAllocations.map((allocation) => ({
    name: allocation.projectName,
    value: allocation.hours,
    color: getRandomColor(allocation.projectId),
  }));

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

  // Find assignee for each task
  const findAssignee = (assigneeId: string) => {
    return sampleUsers.find((user) => user.id === assigneeId) || sampleUsers[0];
  };

  // Find client for a project
  const findClient = (clientId: string) => {
    return sampleClients.find((client) => client.id === clientId) || sampleClients[0];
  };

  // Find manager for a project
  const findManager = (managerId: string) => {
    return sampleUsers.find((user) => user.id === managerId) || sampleUsers[1];
  };

  return (
    <div className="space-y-6 page-transition overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* <p className="text-muted-foreground text-2xl">Welcome back, {user?.firstName+" "+user?.lastName}</p> */}
        </div>
      </div>

      <DashboardMetrics metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-100">
        <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Task Distribution</h2>
          </div>
          <PieChart data={pieChartData} className="h-48" />
        </div>

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
            <Button variant="ghost" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                assignee={findAssignee(task.assigneeId)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Active Projects</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                client={findClient(project.clientId)}
                manager={findManager(project.managerId)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


