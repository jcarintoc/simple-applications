import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  HomePage,
  PropertyDetailPage,
  MyListingsPage,
  CreateListingPage,
  EditListingPage,
  MyBookingsPage,
} from "@/pages";
import { ProtectedRoute, PublicRoute } from "@/components/routes";
import MainLayout from "@/layout/MainLayout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes - no auth required */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
      </Route>

      {/* Protected Routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route path="/properties/:id/edit" element={<EditListingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Route>
      </Route>

      {/* Auth Routes - redirect to home if already logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </>
  )
);
