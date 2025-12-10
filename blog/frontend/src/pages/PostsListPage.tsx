import { PostsList } from "@/components/posts";
import { useGetAllPosts } from "@/lib/query";

export function PostsListPage() {
  const { data: posts, isLoading, error } = useGetAllPosts();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <div className="text-muted-foreground font-serif italic">
            Loading stories...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-serif font-bold text-destructive mb-2">
            Unable to load content
          </h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium underline underline-offset-4 hover:text-primary transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Editorial Header */}
      <header className="border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-0 z-10 hidden">
        {/* Optional sticky header content if needed, kept hidden for now to focus on main layout */}
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <div className="mb-20 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 text-foreground">
            The Journal.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Exploring ideas, technology, and design through a collection of
            thoughtful articles and updates.
          </p>
        </div>

        <PostsList
          posts={posts || []}
          emptyMessage="No stories published yet"
        />

        {/* Newsletter/Footer Area inside the page */}
        <div className="mt-32 border-t border-black pt-16 text-center">
          <h3 className="font-serif text-2xl mb-4">Stay Updated</h3>
          <p className="text-muted-foreground mb-8">
            Subscribe to receive the latest updates directly in your inbox.
          </p>
          <div className="flex max-w-sm mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent border-b border-border focus:border-primary outline-none px-2 py-2 transition-colors"
            />
            <button className="bg-black text-white font-medium hover:bg-black/80 transition-colors px-4 py-2">
              Subscribe
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
