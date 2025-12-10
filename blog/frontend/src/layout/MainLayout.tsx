import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout";

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <br />
      <Outlet />
    </div>
  );
};

export default MainLayout;
