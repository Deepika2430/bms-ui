import { useState } from "react";
import BarChart from "@/components/ui/charts/BarChart";
import PieChart from "@/components/ui/charts/PieChart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, FileBarChart, Filter } from "lucide-react";

// Sample data
const projectTimeData = [
  {
    name: "Website Redesign",
    hours: 45,
    tasks: 12,
    completed: 5,
    color: "#3b82f6",
  },
  {
    name: "Mobile App Development",
    hours: 38,
    tasks: 10,
    completed: 3,
    color: "#8b5cf6",
  },
  {
    name: "Digital Marketing Campaign",
    hours: 25,
    tasks: 8,
    completed: 2,
    color: "#f97316",
  },
  {
    name: "Internal Training",
    hours: 15,
    tasks: 5,
    completed: 4,
    color: "#10b981",
  },
];

// Weekly data for charts
const weeklyData = [
  { name: "Mon", hours: 8, tasks: 3 },
  { name: "Tue", hours: 9, tasks: 4 },
  { name: "Wed", hours: 7, tasks: 2 },
  { name: "Thu", hours: 8, tasks: 3 },
  { name: "Fri", hours: 7, tasks: 4 },
  { name: "Sat", hours: 0, tasks: 0 },
  { name: "Sun", hours: 0, tasks: 0 },
];

// Monthly data for charts
const monthlyProjectProgress = [
  { name: "Week 1", "Website Redesign": 12, "Mobile App": 8, Marketing: 5 },
  { name: "Week 2", "Website Redesign": 15, "Mobile App": 10, Marketing: 8 },
  { name: "Week 3", "Website Redesign": 18, "Mobile App": 12, Marketing: 10 },
  { name: "Week 4", "Website Redesign": 22, "Mobile App": 15, Marketing: 13 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<string>("week");
  const [selectedProject, setSelectedProject] =
    useState<string>("All Projects");

  // Check permissions
  // if (!hasPermission(["admin", "manager"])) {
  if (1 == 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            You do not have permission to view analytics. Please contact your
            administrator.
          </p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const pieChartData = projectTimeData.map((project) => ({
    name: project.name,
    value: project.hours,
    color: project.color,
  }));

  // Task completion rate data
  const taskCompletionData = projectTimeData.map((project) => ({
    name: project.name,
    value: Math.round((project.completed / project.tasks) * 100),
    color: project.color,
  }));

  return (
    <div className="relative space-y-6 page-transition overflow-hidden">
      {/* Inner Header Positioned Relatively */}
      <div className="fixed top-16 left-64 right-0 bg-white dark:bg-card shadow-sm border-b border-border z-20 p-1 mx-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-semibold">Analytics</h1>
            <p className="text-muted-foreground">
              View performance metrics and project statistics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("week")}
            >
              This Week
            </Button>
            <Button
              variant={timeRange === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("month")}
            >
              This Month
            </Button>
            <Button
              variant={timeRange === "quarter" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("quarter")}
            >
              This Quarter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{selectedProject}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSelectedProject("All Projects")}
                >
                  All Projects
                </DropdownMenuItem>
                {projectTimeData.map((project) => (
                  <DropdownMenuItem
                    key={project.name}
                    onClick={() => setSelectedProject(project.name)}
                  >
                    {project.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4 flex flex-col items-center">
            <h2 className="text-lg font-medium mb-2">Total Hours</h2>
            <div className="text-4xl font-bold text-primary mt-4 mb-2">123</div>
            <p className="text-sm text-muted-foreground">
              Hours logged{" "}
              {timeRange === "week"
                ? "this week"
                : timeRange === "month"
                ? "this month"
                : "this quarter"}
            </p>
            <div className="text-sm text-green-600 dark:text-green-400 mt-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 10-2 0v3H7a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V7z"
                  clipRule="evenodd"
                />
              </svg>
              8% from previous {timeRange}
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4 flex flex-col items-center">
            <h2 className="text-lg font-medium mb-2">Tasks Completed</h2>
            <div className="text-4xl font-bold text-primary mt-4 mb-2">35</div>
            <p className="text-sm text-muted-foreground">
              Tasks completed{" "}
              {timeRange === "week"
                ? "this week"
                : timeRange === "month"
                ? "this month"
                : "this quarter"}
            </p>
            <div className="text-sm text-green-600 dark:text-green-400 mt-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 10-2 0v3H7a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V7z"
                  clipRule="evenodd"
                />
              </svg>
              12% from previous {timeRange}
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4 flex flex-col items-center">
            <h2 className="text-lg font-medium mb-2">Average Utilization</h2>
            <div className="text-4xl font-bold text-primary mt-4 mb-2">87%</div>
            <p className="text-sm text-muted-foreground">
              Team utilization{" "}
              {timeRange === "week"
                ? "this week"
                : timeRange === "month"
                ? "this month"
                : "this quarter"}
            </p>
            <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                  transform="rotate(45 10 10)"
                />
              </svg>
              2% from previous {timeRange}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Time Distribution</h2>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>View By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>All Projects</DropdownMenuItem>
                  <DropdownMenuItem>Active Projects</DropdownMenuItem>
                  <DropdownMenuItem>Completed Projects</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
            <PieChart data={pieChartData} className="h-64" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Most Time Spent</div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: projectTimeData[0].color }}
                  ></div>
                  <div className="text-sm">{projectTimeData[0].name}</div>
                </div>
                <div className="text-xl font-semibold">
                  {projectTimeData[0].hours} hours
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Least Time Spent</div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: projectTimeData[3].color }}
                  ></div>
                  <div className="text-sm">{projectTimeData[3].name}</div>
                </div>
                <div className="text-xl font-semibold">
                  {projectTimeData[3].hours} hours
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Daily Hours</h2>
            </div>
            <BarChart
              data={weeklyData}
              bars={[
                {
                  key: "hours",
                  name: "Hours Logged",
                  color: "#3b82f6",
                },
              ]}
              className="h-64"
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Total Hours</div>
                <div className="text-xl font-semibold">
                  {weeklyData.reduce((sum, day) => sum + day.hours, 0)} hours
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Most Productive Day</div>
                <div className="text-xl font-semibold">
                  {
                    weeklyData.reduce(
                      (max, day) => (day.hours > max.hours ? day : max),
                      weeklyData[0]
                    ).name
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Task Completion Rate</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <FileBarChart className="h-4 w-4" />
                <span>Details</span>
              </Button>
            </div>
            <PieChart data={taskCompletionData} className="h-64" />
            <div className="mt-4 space-y-4">
              <div className="text-sm text-muted-foreground">
                Task completion rate by project (completed/total)
              </div>
              <div className="space-y-2">
                {projectTimeData.map((project) => (
                  <div
                    key={project.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      ></div>
                      <span className="text-sm">{project.name}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {project.completed}/{project.tasks}{" "}
                      <span className="text-muted-foreground">
                        ({Math.round((project.completed / project.tasks) * 100)}
                        %)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Project Progress</h2>
              {/* <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span>This Month</span>
              </Button> */}
            </div>
            <BarChart
              data={monthlyProjectProgress}
              bars={[
                {
                  key: "Website Redesign",
                  name: "Website Redesign",
                  color: "#3b82f6",
                },
                {
                  key: "Mobile App",
                  name: "Mobile App",
                  color: "#8b5cf6",
                },
                {
                  key: "Marketing",
                  name: "Marketing",
                  color: "#f97316",
                },
              ]}
              className="h-64"
            />
            <div className="mt-4 space-y-4">
              <div className="text-sm text-muted-foreground">
                Hours spent on each project by week
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Website Redesign</div>
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-semibold">67</div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      ↑ 10%
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Mobile App</div>
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-semibold">45</div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      ↑ 15%
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Marketing</div>
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-semibold">36</div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      ↑ 8%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
