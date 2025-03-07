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
import { Edit, Search, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

interface ProjectTableProps {
  projects: any[];
  onEdit: (project: any) => void;
  onView: (project: any) => void;
  isViewMode: boolean; // Add isViewMode prop
}

const ProjectTable = ({ projects, onEdit, onView, isViewMode }: ProjectTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Projects");
  const [sortColumn, setSortColumn] = useState("projectName");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesSearch = Object.values(project).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );

        const today = new Date();
        const nearDeadline = new Date(project.poEndDate);
        nearDeadline.setDate(nearDeadline.getDate() - 7);

        const matchesFilter =
          selectedFilter === "All Projects" ||
          (selectedFilter === "Active Projects" && project.status === "active") ||
          (selectedFilter === "Near Deadline Projects" && nearDeadline <= today);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];
        if (valueA < valueB) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      });
  }, [projects, searchQuery, selectedFilter, sortColumn, sortOrder]);

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>{selectedFilter}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedFilter("All Projects")}>
              All Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedFilter("Active Projects")}>
              Active Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedFilter("Near Deadline Projects")}>
              Near Deadline Projects
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {["projectCode", "projectName", "client", "poStartDate", "poEndDate", "status"].map((header) => (
                <TableHead key={header} onClick={() => handleSort(header)} className="flex-row justify-between items-center cursor-pointer" style={{ flex: 1}}>
                  <span className="flex-grow">{header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  {sortColumn === header && (
                    <span className="float-right">{sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}</span>
                  )}
                </TableHead>
              ))}
              <TableHead style={{ flex: 0.5 }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
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
