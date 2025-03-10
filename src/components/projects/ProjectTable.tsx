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
import { format } from "date-fns";

interface ProjectTableProps {
  projects: any[];
  onEdit: (project: any) => void;
  onView: (project: any) => void;
}

const ProjectTable = ({ projects, onEdit, onView }: ProjectTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects?.filter((project) =>
    Object.values(project).some(
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
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-10 w-full"
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects?.map((project) => (
              <TableRow key={project.id} onClick={() => onView(project)} className="cursor-pointer">
                <TableCell className="font-medium">{project.projectCode}</TableCell>
                <TableCell>{project.projectName}</TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>{format(new Date(project.poStartDate), "MMM d, yyyy")}</TableCell>
                <TableCell>{format(new Date(project.poEndDate), "MMM d, yyyy")}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
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
