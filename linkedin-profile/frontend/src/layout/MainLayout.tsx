import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Outlet />
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default MainLayout;
