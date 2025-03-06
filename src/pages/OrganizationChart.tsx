import OrganizationChart from "@/components/OrganizationChart";
import { getUserHierarchy } from "@/services/orgChat";
import { useState, useEffect } from "react";

// const orgData = {
//   id: "8b918050-385b-460e-b7db-f5f8a7574936",
//   firstName: "Abhi Kumar",
//   lastName: "Yellapu",
//   empId: "4014",
//   designation: "Managing Director",
//   subordinates: [
//     {
//       id: "3d312369-61fc-4cf8-a8f9-959cbccf91f0",
//       firstName: "Deepika",
//       lastName: "Lasya",
//       empId: "1010",
//       designation: "Project Manager",
//       subordinates: [
//         {
//           id: "6acaf9aa-6449-4c30-affd-6a912bfaf214",
//           firstName: "Deepika",
//           lastName: "Pabbisetti",
//           empId: "4007",
//           designation: "Associate Software Engineer",
//           subordinates: [],
//         },
//       ],
//     },
//   ],
// };

const Index = () => {
  const [orgData, setOrgData] = useState([]);

  useEffect(() => {
    const fetchUserHierarchy = async () => {
      try {
        const response = await getUserHierarchy();
        setOrgData(response);
        console.log("response", response);
      } catch (error) {
        setOrgData([]);
        console.error("Error fetching data:", error);
      }
    };

    fetchUserHierarchy();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50 pt-20">
      {orgData && <OrganizationChart data={orgData} />}
    </div>
  );
};

export default Index;
