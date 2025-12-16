import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  HomePage,
  SubredditsPage,
  SubredditPage,
  PostDetailPage,
  CreatePostPage,
  CreateSubredditPage,
} from "@/pages";
import { ProtectedRoute, PublicRoute } from "@/components/routes";
import MainLayout from "@/layout/MainLayout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes - no auth required */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/subreddits" element={<SubredditsPage />} />
        <Route path="/r/:name" element={<SubredditPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
      </Route>

      {/* Protected Routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/subreddits/create" element={<CreateSubredditPage />} />
          <Route path="/submit" element={<CreatePostPage />} />
          <Route path="/r/:name/submit" element={<CreatePostPage />} />
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
