
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ClientTableProps {
  onEdit: (client: any) => void;
}

const ClientTable = ({ onEdit }: ClientTableProps) => {
  // Temporary mock data
  const clients = [
    {
      id: 1,
      companyName: "Tech Solutions Inc",
      contactPerson: "John Doe",
      email: "john@techsolutions.com",
      phone: "+1 234 567 8900",
      status: "Active",
      clientType: "corporate",
      panNumber: "ABCDE1234F",
      isActive: true,
      mailingCountry: "USA",
      mailingStreet: "123 Tech Street",
      mailingCity: "San Francisco",
      mailingState: "California",
      mailingZipCode: "94105",
      mailingPhone: "+1 234 567 8900",
      mailingMobile: "+1 234 567 8901",
      mailingFax: "+1 234 567 8902",
      mailingEmail: "john@techsolutions.com",
      sameAsMailing: false,
      billingAttention: "Finance Department",
      billingCountry: "USA",
      billingStreet: "456 Finance Street",
      billingCity: "San Francisco",
      billingState: "California",
      billingZipCode: "94106",
      billingPhone: "+1 234 567 8903",
      billingMobile: "+1 234 567 8904",
      billingFax: "+1 234 567 8905",
      billingEmail: "finance@techsolutions.com"
    },
    {
      id: 2,
      companyName: "TCS Solutions Inc",
      contactPerson: "Rajesh",
      email: "rajesh@techsolutions.com",
      phone: "+1 234 567 8900",
      status: "Active",
      clientType: "corporate",
      panNumber: "ABCDE1234F",
      isActive: true,
      mailingCountry: "USA",
      mailingStreet: "123 Tech Street",
      mailingCity: "San Francisco",
      mailingState: "California",
      mailingZipCode: "94105",
      mailingPhone: "+1 234 567 8900",
      mailingMobile: "+1 234 567 8901",
      mailingFax: "+1 234 567 8902",
      mailingEmail: "john@techsolutions.com",
      sameAsMailing: false,
      billingAttention: "Finance Department",
      billingCountry: "USA",
      billingStreet: "456 Finance Street",
      billingCity: "San Francisco",
      billingState: "California",
      billingZipCode: "94106",
      billingPhone: "+1 234 567 8903",
      billingMobile: "+1 234 567 8904",
      billingFax: "+1 234 567 8905",
      billingEmail: "finance@techsolutions.com"
    },
  ];

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
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.companyName}</TableCell>
              <TableCell>{client.contactPerson}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.status}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => onEdit(client)}>
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
