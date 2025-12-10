import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi, csrfApi } from "../api";
import type { CreatePostInput, UpdatePostInput } from "../api";

export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: postsApi.getAllPosts,
  });
};

export const useGetMyPosts = () => {
  return useQuery({
    queryKey: ["posts", "my-posts"],
    queryFn: postsApi.getMyPosts,
  });
};

export const useGetPostById = (id: number) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => postsApi.getPostById(id),
    enabled: !!id,
  });
};

export const useGetPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["posts", "slug", slug],
    queryFn: () => postsApi.getPostBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const { token } = await csrfApi.getCsrfToken();
      return postsApi.createPost(input, token);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // Prefetch the post detail so it's available immediately after navigation
      queryClient.setQueryData(["posts", "slug", data.slug], data);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: UpdatePostInput }) => {
      const { token } = await csrfApi.getCsrfToken();
      return postsApi.updatePost(id, input, token);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", variables.id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { token } = await csrfApi.getCsrfToken();
      return postsApi.deletePost(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
