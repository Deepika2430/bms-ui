import React, { useState, useEffect } from "react";
import { getAllUsers, updateUser } from "@/services/userService";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { ChevronRight, Search, UserCog, Calendar, Phone, Clock, Building, Eye, Edit } from "lucide-react";
import { format } from "date-fns";

const Users: React.FC = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [viewMode, setViewMode] = useState(true);

  const roles = ["admin", "manager", "consultant", "associate-consultant"];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setFormData({ ...user });
    setViewMode(true);
    setIsDialogOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setSelectedUser(user);
    setFormData({ ...user });
    setViewMode(false);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      employee_details: {
        ...prevData.employee_details,
        [name]: value,
      },
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    
    try {
      setIsUpdating(true);
      const updatedUser = await updateUser(selectedUser.id, formData);
      
      // Update the users list with the updated user
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      
      toast.success("User updated successfully");
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  const toggleEditMode = () => {
    setViewMode(!viewMode);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in bg-white dark:bg-gray-900 dark:text-white">
      <div className="mb-6">
        <div className="inline-block px-2 py-1 rounded-full bg-accent text-accent-foreground text-2xl font-large mb-2">
          User Management
        </div>
        <p className="text-muted-foreground">Manage and edit user information</p>
      </div>

      <div className="bg-white dark:bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">User Directory</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users..."
                className="pl-10 w-64 focus-ring"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-48 bg-muted rounded"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-3">Name</th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-3">Role</th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-3">Email</th>
                    <th className="text-right text-sm font-medium text-muted-foreground px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users
                    .filter((user) =>
                      user.name.toLowerCase().includes(search.toLowerCase()) ||
                      (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
                    )
                    .map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-accent transition-colors duration-200 cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {user.employee_details?.first_name?.[0]}{user.employee_details?.last_name?.[0]}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium">{user.employee_details?.first_name} {user.employee_details?.last_name}</div>
                              <div className="text-sm text-muted-foreground">{user?.employee_details?.designation}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={(e) => handleEditClick(e, user)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg animate-scale-in h-full ">
          <DialogHeader>
            <DialogTitle>{viewMode ? "User Details" : "Edit User Details"}</DialogTitle>
            <DialogDescription>
              {viewMode ? "View user information" : "Update user information and role assignments"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 py-1 scrollbar-none overflow-y-auto">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleEditMode}
                >
                  {viewMode ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </>
                  )}
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 overflow-y-auto">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  {viewMode ? (
                    <div className="text-sm font-medium rounded-md border px-3 py-2">{selectedUser?.employee_details?.first_name || "N/A"}</div>
                  ) : (
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData?.employee_details?.first_name || ""}
                      onChange={handleInputChange}
                      className="w-[90%]"
                    />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  {viewMode ? (
                    <div className="text-sm font-medium rounded-md border px-3 py-2">{selectedUser?.employee_details?.last_name || "N/A"}</div>
                  ) : (
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData?.employee_details?.last_name || ""}
                      onChange={handleInputChange}
                      className="w-[90%]"
                    />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {viewMode ? (
                  <div className="text-sm font-medium rounded-md border px-3 py-2">{selectedUser.email || "N/A"}</div>
                ) : (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="w-[95%]"
                  />
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="role">Role</Label>
                  {viewMode ? (
                    <div className="text-sm font-medium rounded-md border px-3 py-2 bg-primary/10 text-primary">
                      {selectedUser.role}
                    </div>
                  ) : (
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleSelectChange("role", value)}
                      >
                      <SelectTrigger className="w-[90%]">
                      
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1).replace("-", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  {viewMode ? (
                    <div className="text-sm font-medium rounded-md border px-3 py-2">{selectedUser?.employee_details?.designation || "N/A"}</div>
                  ) : (
                    <Input
                      id="designation"
                      name="designation"
                      value={formData?.employee_details?.designation || ""}
                      onChange={handleInputChange}
                      className="w-[90%]"
                    />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {viewMode ? (
                  <div className="text-sm font-medium rounded-md border px-3 py-2 flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-2" />
                    {selectedUser?.employee_details?.phone || "N/A"}
                  </div>
                ) : (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData?.employee_details?.phone || ""}
                    onChange={handleInputChange}
                    className="w-[95%]"
                  />
                )}
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Employee ID</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Building className="h-3.5 w-3.5 mr-1" />
                    {selectedUser.employee_details?.emp_id || "Not assigned"}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Department</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedUser?.employee_details?.departments?.name || "Not assigned"}
                    {/* {selectedUser?.employee_details?.department_id || "Not assigned"} */}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Date of Birth</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(selectedUser?.employee_details?.date_of_birth)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Date of Joining</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(selectedUser?.employee_details?.date_of_joining)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Last Updated</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDate(selectedUser?.employee_details?.updated_at)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Created</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDate(selectedUser.created_at)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              {viewMode ? "Close" : "Cancel"}
            </Button>
            {!viewMode && (
              <Button 
                onClick={handleSave} 
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
