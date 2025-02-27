import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Edit, Eye } from "lucide-react";
import { getClients } from "@/services/clientService";

interface ClientTableProps {
  onEdit: (client: any) => void;
  onSelect?: (client: any) => void;
  onView: (client: any) => void;
}

const ClientTable = ({ onEdit, onSelect = () => {}, onView }: ClientTableProps) => {

  const [clients, setClients ] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      const response = await getClients();
      console.log(response.map((client) => console.log(client)));
      setClients(response);
    };
    fetchClients();
  }, []);

  return (
    <div className="rounded-md border ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.map((client) => (
            <TableRow key={client.id} onClick={() => onView(client)} className="cursor-pointer">
              <TableCell className="font-medium">{client?.companyName}</TableCell>
              <TableCell>{client?.contactPerson}</TableCell>
              <TableCell>{client?.mailingEmail}</TableCell>
              <TableCell>{client?.mailingPhone}</TableCell>
              <TableCell>{client?.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(client); }}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientTable;
