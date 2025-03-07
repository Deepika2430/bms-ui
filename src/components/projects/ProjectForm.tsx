import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClients } from "@/services/clientService";
import { getDepartments } from "@/services/departmentService";
import { getConsultants } from "@/services/consultantService";
import { updateProject } from "@/services/projectService"; // Import the update service function

const projectSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  projectCode: z.string().min(1, "Project code is required"),
  projectName: z.string().min(1, "Project name is required"),
  projectDescription: z.string().min(1, "Project description is required"),
  plannedStartDate: z.string({
    required_error: "Planned start date is required",
  }),
  plannedEndDate: z.string({
    required_error: "Planned end date is required",
  }),
  revisedPlannedEndDate: z.string().optional(),
  actualStartDate: z.string().optional(),
  actualEndDate: z.string().optional(),
  contractedEfforts: z.string().optional(),
  plannedEfforts: z.string().optional(),
  poNumber: z.string().optional(),
  poAmount: z.string().optional(),
  currency: z.string().optional(),
  poStartDate: z.string().optional(),
  poEndDate: z.string().optional(),
  poValidity: z.string().optional(),
  poUpliftmentDetails: z.string().optional(),
  comments: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  // departmentId: z.string().min(1, "Department is required"),
  departmentId: z.string(),
  // consultantId: z.string().min(1, "Consultant is required"),
  consultantId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  mobile: z.string().optional(),
  phone: z.string().optional(),
  documents: z.array(z.string()).optional(),
});

interface ProjectFormProps {
  onSubmit: (data: z.infer<typeof projectSchema>) => void;
  onCancel: () => void;
  initialData?: any;
  isViewMode: boolean;
}

const ProjectForm = ({ onSubmit, onCancel, initialData, isViewMode }: ProjectFormProps) => {
  const [documents, setDocuments] = useState<string[]>([]);
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(true);
  const [isAssignPmOpen, setIsAssignPmOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Add isEditing state

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      clientId: initialData?.clientId ?? "",
      projectCode: initialData?.projectCode ?? "",
      projectName: initialData?.projectName ?? "",
      projectDescription: initialData?.projectDescription ?? "",
      plannedStartDate: initialData?.plannedStartDate
        ? new Date(initialData.plannedStartDate).toISOString().split('T')[0]
        : "",
      plannedEndDate: initialData?.plannedEndDate
        ? new Date(initialData.plannedEndDate).toISOString().split('T')[0]
        : "",
      revisedPlannedEndDate: initialData?.revisedPlannedEndDate
        ? new Date(initialData.revisedPlannedEndDate).toISOString().split('T')[0]
        : "",
      actualStartDate: initialData?.actualStartDate
        ? new Date(initialData.actualStartDate).toISOString().split('T')[0]
        : "",
      actualEndDate: initialData?.actualEndDate
        ? new Date(initialData.actualEndDate).toISOString().split('T')[0]
        : "",
      contractedEfforts: initialData?.contractedEfforts ?? "",
      plannedEfforts: initialData?.plannedEfforts ?? "",
      poNumber: initialData?.poNumber ?? "",
      poAmount: initialData?.poAmount ?? "",
      currency: initialData?.currency ?? "",
      poStartDate: initialData?.poStartDate
        ? new Date(initialData.poStartDate).toISOString().split('T')[0]
        : "",
      poEndDate: initialData?.poEndDate
        ? new Date(initialData.poEndDate).toISOString().split('T')[0]
        : "",
      poValidity: initialData?.poValidity ?? "",
      poUpliftmentDetails: initialData?.poUpliftmentDetails ?? "",
      comments: initialData?.comments ?? "",
      status: initialData?.status ?? "active",
      departmentId: initialData?.departmentId ?? "",
      consultantId: initialData?.consultantId ?? "",
      firstName: initialData?.firstName ?? "",
      lastName: initialData?.lastName ?? "",
      email: initialData?.email ?? "",
      mobile: initialData?.mobile ?? "",
      phone: initialData?.phone ?? "",
      documents: initialData?.documents ?? [],
    },
  });

  const [clients, setClients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [consultants, setConsultants] = useState([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setConsultants(await getConsultants());
        setDepartments(await getDepartments());
        setClients(await getClients());
      } catch (error) {
        console.log(error);
        setClients([]);
        setClients([]);
        setDepartments([]);
      }
    };

    fetchMasterData();
  }, []);

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would handle file upload here
      setDocuments([...documents, file.name]);
    }
  };

  const handleRemoveDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  const handleSubmit = (data: z.infer<typeof projectSchema>) => {
    if (initialData) {
      updateProject(initialData.id, data); // Call the update service function if initialData exists
    } else {
      onSubmit(data);
    }
  };

  return (
    <Card className="shadow-none border-none p-0">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="border rounded-lg shadow-md">
              <div
                className={`flex justify-between items-center cursor-pointer ${
                  isProjectInfoOpen ? "pb-0 px-3 pt-3" : "p-3"
                } `}
                onClick={() => setIsProjectInfoOpen(!isProjectInfoOpen)}
              >
                <h3 className="text-lg font-semibold p-0">
                  Project Information
                </h3>
                {isProjectInfoOpen ? <ChevronUp /> : <ChevronDown />}
              </div>
              {isProjectInfoOpen && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isViewMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients?.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.companyName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Code*</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isViewMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name*</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isViewMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description*</FormLabel>
                          <FormControl>
                            <Textarea className="w-[300px]" {...field} disabled={isViewMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="plannedStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Planned Start Date*</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              {...field}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="plannedEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Planned End Date*</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              {...field}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="revisedPlannedEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Revised Planned End Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              {...field}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="actualStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Actual Start Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              {...field}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="actualEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Actual End Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              {...field}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contractedEfforts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contracted Efforts (Hrs)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" disabled={isViewMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="plannedEfforts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Planned Efforts (Hrs)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" disabled={isViewMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="poNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PO#</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isViewMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormLabel>PO Amount</FormLabel>
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isViewMode}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[100px]">
                                  <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem
                                    key={currency.code}
                                    value={currency.code}
                                  >
                                    {currency.symbol} {currency.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="poAmount"
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                className="w-30"
                                {...field}
                                type="number"
                                disabled={isViewMode}
                              />
                            </FormControl>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="poStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PO Start Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              className="w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              {...field} 
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="poEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PO End Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              className="w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              {...field} 
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="poValidity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PO Validity</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isViewMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="poUpliftmentDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PO Upliftment Details</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isViewMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments</FormLabel>
                          <FormControl>
                            <Textarea className="w-[300px]" {...field} disabled={isViewMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Project Status*</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-4"
                              disabled={isViewMode}
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="active" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Active
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="inactive" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Inactive
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="border rounded-lg shadow-md">
              <div
                className={`flex justify-between items-center cursor-pointer ${
                  isAssignPmOpen ? "pb-0 px-3 pt-3" : "p-3"
                } `}
                onClick={() => setIsAssignPmOpen(!isAssignPmOpen)}
              >
                <h2 className="text-lg font-semibold">Assign PM</h2>
                {isAssignPmOpen ? <ChevronUp /> : <ChevronDown />}
              </div>
              {isAssignPmOpen && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isViewMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="consultantId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consultant*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isViewMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Consultant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {consultants?.map((consultant) => (
                                <SelectItem
                                  key={consultant?.id}
                                  value={consultant?.id}
                                >
                                  {consultant?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium mb-4">
                      Primary Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isViewMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isViewMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" disabled={isViewMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" disabled={isViewMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" disabled={isViewMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium mb-4">Documents</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          onChange={handleFileUpload}
                          className="max-w-xs pb-8"
                          disabled={isViewMode}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setDocuments([...documents])}
                          disabled={isViewMode}
                        >
                          Add
                        </Button>
                      </div>
                      {documents.length > 0 && (
                        <div className="space-y-2">
                          {documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <span className="flex-1">{doc}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveDocument(index)}
                                disabled={isViewMode}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4 p-4">
              {!isViewMode && (
                <>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-nav-accent text-white"
                    onClick={form.handleSubmit(handleSubmit)}
                  >
                    {initialData ? "Update Project" : "Create Project"}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
