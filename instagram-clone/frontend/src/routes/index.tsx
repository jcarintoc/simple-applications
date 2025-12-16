import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  HomePage,
  ProfilePage,
  CreatePostPage,
  SearchPage,
} from "@/pages";
import { ProtectedRoute, PublicRoute } from "@/components/routes";
import MainLayout from "@/layout/MainLayout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Protected Routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
      </Route>

      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/profile/:userId" element={<ProfilePage />} />
      </Route>

      {/* Auth Routes - redirect to home if already logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </>
  )
);
