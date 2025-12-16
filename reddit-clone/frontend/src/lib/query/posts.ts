import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi, type CreatePostInput, type UpdatePostInput } from "../api";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (subredditId?: number) => [...postKeys.lists(), subredditId] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

export function usePosts(subredditId?: number) {
  return useQuery({
    queryKey: postKeys.list(subredditId),
    queryFn: () => postsApi.getPosts(subredditId),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsApi.getPostById(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostInput) => postsApi.createPost(data),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists(), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(post.id), refetchType: 'active' });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostInput }) =>
      postsApi.updatePost(id, data),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(post.id), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: postKeys.lists(), refetchType: 'active' });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists(), refetchType: 'active' });
    },
  });
}

export function useUpvotePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsApi.upvotePost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: postKeys.lists(), refetchType: 'active' });
    },
  });
}
