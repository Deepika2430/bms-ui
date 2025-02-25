
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectTable from "@/components/projects/ProjectTable";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const Projects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const { toast } = useToast();

  const handleCreateProject = (data: any) => {
    console.log(editingProject ? "Updating project:" : "Creating project:", data);
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
    <div className="min-h-screen pt-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-nav-foreground">Projects</h1>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-nav-accent hover:bg-nav-accent/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>

        <ProjectTable onEdit={handleEdit} />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>
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
