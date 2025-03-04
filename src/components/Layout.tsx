import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { ThemeProvider } from "../context/ThemeContext";

const Layout = () => {
  return (
      <ThemeProvider>
    <div className="app-layout">
        <Navigation />
        <main className="content pb-0">
          <Outlet />
        </main>
    </div>
      </ThemeProvider>
  );
};

export default Layout;
