import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { LoginPage, RegisterPage, InboxPage, EmailDetailPage } from "@/pages";
import { ProtectedRoute, PublicRoute } from "@/components/routes";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Protected Routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<InboxPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/sent" element={<InboxPage />} />
        <Route path="/archive" element={<InboxPage />} />
        <Route path="/trash" element={<InboxPage />} />
        <Route path="/email/:id" element={<EmailDetailPage />} />
      </Route>

      {/* Public Routes - redirect if already logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </>
  )
);
