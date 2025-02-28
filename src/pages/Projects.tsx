import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectTable from "@/components/projects/ProjectTable";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProject, updateProject, getProjects } from "@/services/projectService";

type ProjectFormProps = {
  initialData: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isViewMode: boolean;
};

const Projects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [viewingProject, setViewingProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);


  useEffect(() => {
    refreshProjects();
  }, []);

  const handleCreateProject = async (data: any) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
      toast.success("Project updated successfully");
    } else {
      await createProject(data);
      toast.success("Project created successfully");
    }
    setIsDialogOpen(false);
    setEditingProject(null);
    setViewingProject(null);
    refreshProjects();
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setViewingProject(null);
    setIsDialogOpen(true);
  };

  const handleView = (project: any) => {
    setViewingProject(project);
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setViewingProject(null);
  };

  const refreshProjects = async () => {
    const response = await getProjects();
    setProjects(response);
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-nav-accent text-white">
            <CardTitle className="flex justify-between items-center">
              <span>Projects</span>
              <Button
                onClick={() => { setIsDialogOpen(true); setEditingProject(null); setViewingProject(null); }}
                className="bg-white text-nav-accent hover:bg-gray-100"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectTable projects={projects} onEdit={handleEdit} onView={handleView} />
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="px-6">
              {editingProject ? "Edit Project" : viewingProject ? "View Project" : "Create Project"}
            </DialogTitle>
            <ProjectForm
              initialData={editingProject || viewingProject}
              onSubmit={handleCreateProject}
              onCancel={handleClose}
              isViewMode={!!viewingProject}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Projects;
