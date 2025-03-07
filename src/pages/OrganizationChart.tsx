import OrganizationChart from "@/components/OrganizationChart";
import { getUserHierarchy, getUserHierarchyByEmpId } from "@/services/orgChat";
import { useState, useEffect } from "react";

const Index = () => {
  const [orgData, setOrgData] = useState(null);

  const fetchUserHierarchy = async (empId?: string) => {
    try {
      const response = empId ? await getUserHierarchyByEmpId(empId) : await getUserHierarchy();
      setOrgData(response);
      console.log("response", response);
    } catch (error) {
      setOrgData(null);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUserHierarchy();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50 pt-20">
      {orgData && <OrganizationChart data={orgData} onCardClick={fetchUserHierarchy} />}
    </div>
  );
};

export default Index;
