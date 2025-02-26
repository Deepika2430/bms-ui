import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectTable from "@/components/projects/ProjectTable";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Projects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const { toast } = useToast();

  const handleCreateProject = (data: any) => {
    console.log(
      editingProject ? "Updating project:" : "Creating project:",
      data
    );
    toast({
      title: "Success",
      description: editingProject
        ? "Project updated successfully"
        : "Project created successfully",
    });
    setIsDialogOpen(false);
    setEditingProject(null);
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-nav-accent text-white">
            <CardTitle className="flex justify-between items-center">
              <span>Projects</span>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-white text-nav-accent hover:bg-gray-100"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectTable onEdit={handleEdit} />
          </CardContent>
        </Card>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-full overflow-y-auto">
            <DialogTitle className="pl-2">
              {editingProject ? "Edit Project" : "Create Project"}
            </DialogTitle>
            <ProjectForm
              initialData={editingProject}
              onSubmit={handleCreateProject}
              onCancel={handleClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Projects;
