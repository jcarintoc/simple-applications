import { apiClient } from "./client";
import { postSchema, postWithAuthorSchema } from "./types";
import type { CreatePostInput, UpdatePostInput, Post, PostWithAuthor } from "./types";
import { z } from "zod";

export const getAllPosts = async (): Promise<PostWithAuthor[]> => {
  const { data } = await apiClient.get("/posts");
  return z.array(postWithAuthorSchema).parse(data);
};

export const getMyPosts = async (): Promise<PostWithAuthor[]> => {
  const { data } = await apiClient.get("/posts/my-posts");
  return z.array(postWithAuthorSchema).parse(data);
};

export const getPostById = async (id: number): Promise<PostWithAuthor> => {
  const { data } = await apiClient.get(`/posts/${id}`);
  return postWithAuthorSchema.parse(data);
};

export const getPostBySlug = async (slug: string): Promise<PostWithAuthor> => {
  const { data } = await apiClient.get(`/posts/slug/${slug}`);
  return postWithAuthorSchema.parse(data);
};

export const createPost = async (input: CreatePostInput, csrfToken: string): Promise<PostWithAuthor> => {
  const { data } = await apiClient.post("/posts", input, {
    headers: {
      "x-csrf-token": csrfToken,
    },
  });
  return postWithAuthorSchema.parse(data);
};

export const updatePost = async (
  id: number,
  input: UpdatePostInput,
  csrfToken: string
): Promise<Post> => {
  const { data } = await apiClient.put(`/posts/${id}`, input, {
    headers: {
      "x-csrf-token": csrfToken,
    },
  });
  return postSchema.parse(data);
};

export const deletePost = async (id: number, csrfToken: string): Promise<void> => {
  await apiClient.delete(`/posts/${id}`, {
    headers: {
      "x-csrf-token": csrfToken,
    },
  });
};
