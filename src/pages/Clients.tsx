import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ClientForm from "@/components/clients/ClientForm";
import ClientTable from "@/components/clients/ClientTable";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Clients = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const { toast } = useToast();

  const handleCreateClient = (data: any) => {
    console.log(editingClient ? "Updating client:" : "Creating client:", data);
    toast({
      title: "Success",
      description: editingClient 
        ? "Client updated successfully" 
        : "Client created successfully",
    });
    setIsDialogOpen(false);
    setEditingClient(null);
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-nav-accent text-white">
            <CardTitle className="flex justify-between items-center">
              <span>Clients</span>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-white text-nav-accent hover:bg-gray-100"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientTable onEdit={handleEdit} />
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>
              {/* {editingClient ? "Edit Client" : "Create Client"} */}
            </DialogTitle>
            <ClientForm 
              initialData={editingClient}
              onSubmit={handleCreateClient} 
              onCancel={handleClose} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Clients;
