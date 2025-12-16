import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi, type CreatePostInput, type UpdatePostInput } from "../api";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (userId?: number) => [...postKeys.lists(), userId] as const,
  feed: () => [...postKeys.all, "feed"] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
  userPosts: (userId: number) => [...postKeys.all, "user", userId] as const,
};

export function useFeed() {
  return useQuery({
    queryKey: postKeys.feed(),
    queryFn: () => postsApi.getFeed(),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function usePosts(userId?: number) {
  return useQuery({
    queryKey: postKeys.list(userId),
    queryFn: () => postsApi.getPosts(userId),
    enabled: userId !== undefined ? !!userId : true,
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

export function usePostsByUser(userId: number) {
  return useQuery({
    queryKey: postKeys.userPosts(userId),
    queryFn: () => postsApi.getPostsByUser(userId),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostInput) => postsApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.feed(), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: postKeys.lists(), refetchType: 'active' });
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
      queryClient.invalidateQueries({ queryKey: postKeys.feed(), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: postKeys.lists(), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts(post.user_id), refetchType: 'active' });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.feed(), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: postKeys.lists(), refetchType: 'active' });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsApi.likePost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: postKeys.feed(), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: postKeys.lists(), refetchType: 'active' });
    },
  });
}
