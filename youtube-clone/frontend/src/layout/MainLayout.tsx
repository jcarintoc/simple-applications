import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "@/components/layout";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="md:pl-64">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
