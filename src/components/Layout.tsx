import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <div className="app-layout">
      <Navigation />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
