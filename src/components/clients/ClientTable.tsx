import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { Edit, Eye, Search } from "lucide-react";
import { getClients } from "@/services/clientService";
import { Input } from "../ui/input";

interface ClientTableProps {
  onEdit: (client: any) => void;
  onSelect?: (client: any) => void;
  onView: (client: any) => void;
  clients: any[];
  fetchClients: () => Promise<void>;
}

const ClientTable = ({ onEdit, onSelect = () => { }, onView, clients, fetchClients }: ClientTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = useMemo(() => {
    return clients?.filter(client => client.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [clients, searchTerm]);

  return (
    <div className="space-y-4 pt-4 ">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-10 w-full"
          />
        </div>
      </div>
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
          {filteredClients?.map((client) => (
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
