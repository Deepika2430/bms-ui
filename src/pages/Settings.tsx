import { useState } from "react";
import Profile from "@/components/settings/Profile";
import ResetPassword from "@/components/settings/ResetPassword";
import ManageUsers from "@/components/settings/ManageUsers";
import AssignRoles from "@/components/settings/AssignRoles";
import { Button } from "@/components/ui/button";
import { UserPlus, Shield, UserCog, KeyRound } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("manage-users");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "reset-password":
        return <ResetPassword />;
      case "manage-users":
        return <ManageUsers />;
      case "assign-roles":
        return <AssignRoles />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-nav-foreground mb-6">Settings</h1>
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === "manage-users" ? "default" : "outline"}
            onClick={() => setActiveTab("manage-users")}
          >
            <UserPlus className="mr-2" />Manage Users
          </Button>
          <Button
            variant={activeTab === "assign-roles" ? "default" : "outline"}
            onClick={() => setActiveTab("assign-roles")}
          >
            <Shield className="mr-2" />Assign Roles
          </Button>
          <Button
            variant={activeTab === "profile" ? "default" : "outline"}
            onClick={() => setActiveTab("profile")}
          >
            <UserCog className="mr-2" />Profile Settings
          </Button>
          <Button
            variant={activeTab === "reset-password" ? "default" : "outline"}
            onClick={() => setActiveTab("reset-password")}
          >
            <KeyRound className="mr-2" />Reset Password
          </Button>
        </div>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Settings;
