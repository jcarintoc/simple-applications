import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  PostsListPage,
  PostDetailPage,
  CreatePostPage,
  EditPostPage,
  MyPostsPage,
} from "@/pages";
import { ProtectedRoute, PublicRoute } from "@/components/routes";
import MainLayout from "@/layout/MainLayout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<MainLayout />}>
      {/* Protected Routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/my-posts" element={<MyPostsPage />} />
        <Route path="/posts/new" element={<CreatePostPage />} />
        <Route path="/posts/:id/edit" element={<EditPostPage />} />
      </Route>

      {/* Public Routes - redirect to dashboard if already logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Public blog routes - accessible to everyone */}
      <Route path="/" element={<PostsListPage />} />
      <Route path="/posts/:slug" element={<PostDetailPage />} />
    </Route>
  )
);
