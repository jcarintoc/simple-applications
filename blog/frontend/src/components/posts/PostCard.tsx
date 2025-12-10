import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, User } from "lucide-react";
import type { PostWithAuthor } from "@/lib/api";

interface PostCardProps {
  post: PostWithAuthor;
}

export const PostCard = ({ post }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <Link to={`/posts/${post.slug}`} className="block">
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl font-bold leading-tight">{post.title}</CardTitle>
            {post.published ? (
              <Badge variant="default" className="shrink-0">
                Published
              </Badge>
            ) : (
              <Badge variant="secondary" className="shrink-0">
                Draft
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{truncateContent(post.content)}</p>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{post.author_name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.created_at)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
