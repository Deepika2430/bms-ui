import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Employee {
  id: string;
  empId: string;
  firstName: string;
  lastName: string;
  designation: string;
  email: string;
  subordinates: Employee[];
}

interface OrganizationChartProps {
  data: Employee;
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
};

const getDesignationInitials = (designation: string) => {
  if (designation) {
    return designation
      .split(" ")
      .map((word) => word?.charAt(0))
      .join("")
      .toUpperCase();
  } else {
    return "";
  }
};

const EmployeeNode: React.FC<{ employee: Employee; level?: number }> = ({
  employee,
  level = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: level * 0.2 }}
      className="flex flex-col items-center"
    >
      <Card className="p-2 bg-gradient-to-br from-purple-50 to-white border border-purple-300 shadow-xl hover:shadow-xl transition-all duration-300 w-60">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 ring-2 ring-purple-500/30 shadow-md">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-medium text-sm">
              {getInitials(employee?.firstName, employee?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900 text-sm px-2">
              {employee?.firstName} {employee?.lastName}
            </h3>
            <p className="text-xs text-red-400 mt-0.5 font-medium px-2">
              {employee.empId}
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs cursor-pointer text-purple-600 font-medium px-2 py-0.5 rounded-full mt-0.5 transition-colors">
                  {getDesignationInitials(employee?.designation)}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{employee?.designation}</p>
              </TooltipContent>
            </Tooltip>
            <a href={`mailto:${employee?.email}`} className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full mt-0.5 transition-colors">
              {employee?.email}
            </a>
          </div>
        </div>
      </Card>

      {employee?.subordinates?.length > 0 && (
        <>
          <div className="w-px h-6 bg-gradient-to-b from-purple-200 to-purple-300"></div>
          <div className="flex flex-col gap-4">
            {employee?.subordinates?.map((subordinate) => (
              <EmployeeNode key={subordinate?.id} employee={subordinate} level={level + 1} />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

const OrganizationChart: React.FC<OrganizationChartProps> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <TooltipProvider>
        <EmployeeNode employee={data} />
      </TooltipProvider>
    </div>
  );
};

export default OrganizationChart;
