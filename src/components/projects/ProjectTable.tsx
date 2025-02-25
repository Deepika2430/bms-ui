
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Search } from "lucide-react";
import { useState } from "react";

interface ProjectTableProps {
  onEdit: (project: any) => void;
}

const ProjectTable = ({ onEdit }: ProjectTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Temporary mock data
  const projects = [
    {
      id: 1,
      projectCode: "PRJ001",
      projectName: "Website Redesign",
      client: "Tech Solutions Inc",
      startDate: "2024-03-01",
      endDate: "2024-06-30",
      status: "Active",
      department: "Engineering",
      consultant: "John Doe",
    },
  ];

  const filteredProjects = projects.filter((project) =>
    Object.values(project).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Code</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.projectCode}</TableCell>
                <TableCell>{project.projectName}</TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>{project.startDate}</TableCell>
                <TableCell>{project.endDate}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{project.department}</TableCell>
                <TableCell>{project.consultant}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
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

export default ProjectTable;
