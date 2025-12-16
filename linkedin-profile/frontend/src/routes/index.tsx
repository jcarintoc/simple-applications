import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  MyProfilePage,
  ProfilePage,
  ConnectionsPage,
  JobsPage,
  JobDetailPage,
  MyApplicationsPage,
} from "@/pages";
import { ProtectedRoute, PublicRoute } from "@/components/routes";
import MainLayout from "@/layout/MainLayout";
import AllConnectionPage from "@/pages/AllConnectionPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Protected Routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile/me" element={<MyProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/applications" element={<MyApplicationsPage />} />
          <Route path="/all-connections" element={<AllConnectionPage />} />
        </Route>
      </Route>

      {/* Public Routes - redirect to dashboard if already logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </>
  )
);
