import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsList } from "@/components/posts";
import { useGetMyPosts } from "@/lib/query";
import { FileText, Eye, EyeOff } from "lucide-react";

export function MyPostsPage() {
  const { data: posts, isLoading, error } = useGetMyPosts();
  const [activeTab, setActiveTab] = useState("all");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading your posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-destructive">
          Error loading posts: {error.message}
        </div>
      </div>
    );
  }

  const allPosts = posts || [];
  const publishedPosts = allPosts.filter((post) => post.published);
  const draftPosts = allPosts.filter((post) => !post.published);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Posts</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your published posts and drafts
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">
              <FileText className="mr-2 h-4 w-4" />
              All ({allPosts.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              <Eye className="mr-2 h-4 w-4" />
              Published ({publishedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              <EyeOff className="mr-2 h-4 w-4" />
              Drafts ({draftPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <PostsList
              posts={allPosts}
              emptyMessage="You haven't created any posts yet"
            />
          </TabsContent>

          <TabsContent value="published" className="mt-6">
            <PostsList
              posts={publishedPosts}
              emptyMessage="You don't have any published posts"
            />
          </TabsContent>

          <TabsContent value="drafts" className="mt-6">
            <PostsList
              posts={draftPosts}
              emptyMessage="You don't have any drafts"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
