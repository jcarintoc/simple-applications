import * as postRepository from "../repositories/post.repository.js";
import { CreatePostDto, UpdatePostDto, PostWithAuthor, Post } from "../types/index.js";

export const createPost = (data: CreatePostDto, authorId: number): PostWithAuthor => {
  return postRepository.createPost(data, authorId);
};

export const getAllPosts = (publishedOnly = false): PostWithAuthor[] => {
  return postRepository.findAllPosts(publishedOnly);
};

export const getPostById = (id: number): PostWithAuthor | null => {
  const post = postRepository.findPostById(id);
  return post || null;
};

export const getPostBySlug = (slug: string): PostWithAuthor | null => {
  const post = postRepository.findPostBySlug(slug);
  return post || null;
};

export const updatePost = (id: number, data: UpdatePostDto, userId: number): Post | null => {
  const existing = postRepository.findPostById(id);

  if (!existing) {
    return null;
  }

  if (existing.author_id !== userId) {
    throw new Error("Unauthorized to update this post");
  }

  return postRepository.updatePost(id, data) || null;
};

export const deletePost = (id: number, userId: number): boolean => {
  const existing = postRepository.findPostById(id);

  if (!existing) {
    return false;
  }

  if (existing.author_id !== userId) {
    throw new Error("Unauthorized to delete this post");
  }

  return postRepository.deletePost(id);
};

export const getPostsByAuthor = (authorId: number): PostWithAuthor[] => {
  return postRepository.findPostsByAuthor(authorId);
};
