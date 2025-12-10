import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import type { PostWithAuthor } from "@/lib/api";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostWithAuthor;
  className?: string;
  featured?: boolean;
}

export const PostCard = ({ post, className, featured = false }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = featured ? 300 : 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <Link 
      to={`/posts/${post.slug}`} 
      className={cn(
        "group block",
        featured ? "mb-12" : "pt-4",
        className
      )}
    >
      <article className="space-y-4 h-full border border-black hover:bg-black/5 duration-300 p-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium tracking-wide">
          <span className="uppercase text-primary">{post.author_name}</span>
          <span className="text-border">•</span>
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          {!post.published && <Badge variant="secondary" className="ml-2">Draft</Badge>}
        </div>
        
        <h2 className={cn(
          "font-serif font-bold group-hover:text-primary transition-colors duration-300",
          featured ? "text-4xl md:text-5xl leading-tight" : "text-2xl leading-snug"
        )}>
          {post.title}
        </h2>
        
        <p className={cn(
          "text-muted-foreground leading-relaxed",
          featured ? "text-lg line-clamp-3" : "line-clamp-2"
        )}>
          {truncateContent(post.content)}
        </p>

        <div className="flex items-center text-sm font-semibold text-primary pt-2">
          <span className="border-b border-primary/0 group-hover:border-primary transition-all duration-300">
            Read Article
          </span>
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </article>
    </Link>
  );
};
