import React from "react";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Clock,
  FileText,
  Building,
  Award,
  Hash,
  MapPin,
  Home,
  Heart,
  UserCheck,
  UserX,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUserDetails } from "@/services/userService";

const EmployeeProfile: React.FC = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await getUserDetails();
        setEmployee(response);
        setLoading(false);
        console.log(response);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setLoading(false);
      }
    };
    fetchEmployee();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "onboarding":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "terminated":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div className="min-h-screen pt-20 px-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-4xl  mx-auto overflow-hidden shadow-lg ">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold align-center">
                {employee?.firstName} {employee?.lastName}
              </CardTitle>
              <CardDescription className="text-purple-100 mt-1 px-4">
                {employee?.designation}
              </CardDescription>
            </div>
            <Badge
              className={cn(
                "text-sm px-3 py-1 rounded-full border",
                getStatusColor(employee?.status)
              )}
            >
              {employee?.status?.charAt(0).toUpperCase() + employee?.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-8 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="mr-2 h-5 w-5 text-purple-500" />
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-700">{employee?.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-700">{employee?.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="text-gray-700">{employee?.mobile}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="text-gray-700">
                      {formatDate(employee?.dateOfBirth)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Heart className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="text-gray-700">{employee?.bloodGroup}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <UserCheck className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-gray-700">{employee?.gender}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-700">{employee?.currentAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-purple-500" />
                About
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {employee?.otherDetails || "No description available."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-purple-500" />
                Employment Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Hash className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p className="text-gray-700">{employee?.empId}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-gray-700">{employee?.role}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-700">
                      {employee?.department}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Joining</p>
                    <p className="text-gray-700">
                      {formatDate(employee?.dateOfJoining)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contract End Date</p>
                    <p className="text-gray-700">
                      {formatDate(employee?.contractEndDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <UserX className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Resignation Date</p>
                    <p className="text-gray-700">
                      {employee?.resignation_date ? formatDate(employee?.resignationDate) : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <UserX className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Last Working Date</p>
                    <p className="text-gray-700">
                      {employee?.lastWorkingDate ? formatDate(employee?.lastWorkingDate) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-purple-500" />
                System Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-700">
                    {formatDate(employee?.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-700">
                    {formatDate(employee?.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">User ID</span>
                  <span className="text-gray-700">{employee?.id}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 border-t px-6 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-2 h-4 w-4" />
            <span>Profile ID: {employee?.id}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmployeeProfile;
