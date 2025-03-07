import { Routes, Route } from "react-router-dom";
import Dashboard from "@/components/dashboard/Dashboard";

const Home = () => {
  return (
    <div className="min-h-screen pt-16">
      <Routes>
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default Home;
