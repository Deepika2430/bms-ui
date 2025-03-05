import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import ClientForm from "@/components/clients/ClientForm";
import ClientTable from "@/components/clients/ClientTable";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Clients = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [viewingClient, setViewingClient] = useState<any>(null);

  const handleCreateClient = (data: any) => {
    editingClient ? toast.success("Client updated successfully") : toast.success("Client created successfully");
    setIsDialogOpen(false);
    setEditingClient(null);
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleView = (client: any) => {
    setViewingClient(client);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingClient(null);
    setViewingClient(null);
  };

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-nav-accent text-white">
            <CardTitle className="flex justify-between items-center">
              <span>Clients</span>
              <Button
                onClick={() => {setIsDialogOpen(true) ; setEditingClient(null); setViewingClient(null);}}
                className="bg-white text-nav-accent hover:bg-gray-100"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientTable onEdit={handleEdit} onView={handleView} />
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="px-6">
              {editingClient ? "Edit Client" : viewingClient ? "View Client" : "Create Client"}
            </DialogTitle>
            <ClientForm
              initialData={editingClient || viewingClient}
              onSubmit={handleCreateClient}
              onCancel={handleClose}
              isViewMode={!!viewingClient}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Clients;
