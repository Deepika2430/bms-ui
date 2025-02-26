import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const fetchProjects = async () => {
  // Mock API call
  return [
    { id: 1, name: "Project Alpha", status: "In Progress", owner: "John Doe", client: { name: "ABC Corp", contact: "abc@corp.com" }, tasks: [
      { id: 1, title: "Task 1", description: "Setup database", status: "Completed", assignedTo: "Alice" },
      { id: 2, title: "Task 2", description: "Develop API endpoints", status: "In Progress", assignedTo: "Bob" },
      { id: 3, title: "Task 3", description: "Create frontend components", status: "Pending", assignedTo: "Charlie" },
      { id: 4, title: "Task 4", description: "Write documentation", status: "Pending", assignedTo: "Dave" },
      { id: 5, title: "Task 5", description: "Deploy to production", status: "Pending", assignedTo: "Eve" }
    ] },
    { id: 2, name: "Project Beta", status: "Completed", owner: "Jane Smith", client: { name: "XYZ Ltd", contact: "xyz@ltd.com" }, tasks: [
      { id: 1, title: "Task 1", description: "UI design", status: "Completed", assignedTo: "Charlie" },
      { id: 2, title: "Task 2", description: "Backend integration", status: "Completed", assignedTo: "Dave" }
    ] },
    { id: 3, name: "Project Gamma", status: "On Hold", owner: "Alice Johnson", client: { name: "LMN Inc", contact: "lmn@inc.com" }, tasks: [
      { id: 1, title: "Task 1", description: "Requirement gathering", status: "Pending", assignedTo: "Dave" },
      { id: 2, title: "Task 2", description: "Initial design", status: "Pending", assignedTo: "Eve" }
    ] },
  ];
};

const BmsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(true);
  const [isInProgressTasksOpen, setIsInProgressTasksOpen] = useState(true);
  const [isPendingTasksOpen, setIsPendingTasksOpen] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects();
      setProjects(data);
      setFilteredProjects(data);
    };
    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    setFilteredProjects(filtered);
  }, [searchTerm, statusFilter, projects]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">BMS Dashboard</h1>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
        <Select onValueChange={setStatusFilter} defaultValue="all">
          <SelectTrigger className="w-1/3">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Project</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Owner</th>
              <th className="p-2 text-left">Client</th>
              <th className="p-2 text-left">Start Date</th>
              <th className="p-2 text-left">End Date</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Consultant</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id} className="border-b cursor-pointer hover:bg-gray-100" onClick={() => setSelectedProject(project)}>
                <td className="p-2">{project.name}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white ${
                    project.status === "In Progress"
                      ? "bg-blue-500"
                      : project.status === "Completed"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="p-2">{project.owner}</td>
                <td className="p-2">{project.client.name}</td>
                <td className="p-2">{project.startDate}</td>
                <td className="p-2">{project.endDate}</td>
                <td className="p-2">{project.department}</td>
                <td className="p-2">{project.consultant}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">New Clients</h2>
        <div className="bg-white shadow-md rounded-lg p-4">
          <ul>
            <li className="border-b p-2">Client 1</li>
            <li className="border-b p-2">Client 2</li>
            <li className="border-b p-2">Client 3</li>
          </ul>
        </div>
      </div>
      
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject.name} Details</DialogTitle>
              <DialogDescription>
                <p><strong>Owner:</strong> {selectedProject.owner}</p>
                <p><strong>Status:</strong> {selectedProject.status}</p>
                <p><strong>Client:</strong> {selectedProject.client.name} ({selectedProject.client.contact})</p>
                <p><strong>Start Date:</strong> {selectedProject.startDate}</p>
                <p><strong>End Date:</strong> {selectedProject.endDate}</p>
                <p><strong>Department:</strong> {selectedProject.department}</p>
                <p><strong>Consultant:</strong> {selectedProject.consultant}</p>
                <h3 className="text-xl font-bold mt-4">Tasks</h3>
                <div className="border rounded-lg shadow-md mb-4">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => setIsCompletedTasksOpen(!isCompletedTasksOpen)}
                  >
                    <h4 className="text-lg font-semibold">Completed Tasks</h4>
                    {isCompletedTasksOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>
                  {isCompletedTasksOpen && (
                    <ul className="space-y-2 p-4">
                      {selectedProject.tasks.filter(task => task.status === "Completed").map(task => (
                        <li key={task.id} className="p-2 border-b">
                          <strong>{task.title}:</strong> {task.description}<br/>
                          <strong>Assigned to:</strong> {task.assignedTo}<br/>
                          <span className="px-2 py-1 rounded text-white bg-green-500">
                            {task.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="border rounded-lg shadow-md mb-4">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => setIsInProgressTasksOpen(!isInProgressTasksOpen)}
                  >
                    <h4 className="text-lg font-semibold">In Progress Tasks</h4>
                    {isInProgressTasksOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>
                  {isInProgressTasksOpen && (
                    <ul className="space-y-2 p-4">
                      {selectedProject.tasks.filter(task => task.status === "In Progress").map(task => (
                        <li key={task.id} className="p-2 border-b">
                          <strong>{task.title}:</strong> {task.description}<br/>
                          <strong>Assigned to:</strong> {task.assignedTo}<br/>
                          <span className="px-2 py-1 rounded text-white bg-blue-500">
                            {task.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="border rounded-lg shadow-md mb-4">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => setIsPendingTasksOpen(!isPendingTasksOpen)}
                  >
                    <h4 className="text-lg font-semibold">Pending Tasks</h4>
                    {isPendingTasksOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>
                  {isPendingTasksOpen && (
                    <ul className="space-y-2 p-4">
                      {selectedProject.tasks.filter(task => task.status === "Pending").map(task => (
                        <li key={task.id} className="p-2 border-b">
                          <strong>{task.title}:</strong> {task.description}<br/>
                          <strong>Assigned to:</strong> {task.assignedTo}<br/>
                          <span className="px-2 py-1 rounded text-white bg-yellow-500">
                            {task.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BmsDashboard;
