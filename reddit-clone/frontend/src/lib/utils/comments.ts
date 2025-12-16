import type { CommentWithAuthor } from "../api/types";

export interface CommentWithChildren extends CommentWithAuthor {
  children: CommentWithChildren[];
}

export function buildCommentTree(comments: CommentWithAuthor[]): CommentWithChildren[] {
  const map = new Map<number, CommentWithChildren>();
  const roots: CommentWithChildren[] = [];

  // Create map of comments with children array
  comments.forEach((comment) => {
    map.set(comment.id, { ...comment, children: [] });
  });

  // Build tree structure
  comments.forEach((comment) => {
    const node = map.get(comment.id)!;
    if (comment.parent_id === null) {
      roots.push(node);
    } else {
      const parent = map.get(comment.parent_id);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return roots;
}
