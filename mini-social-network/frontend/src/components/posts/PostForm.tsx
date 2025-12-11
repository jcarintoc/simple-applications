import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/users/UserAvatar";
import { useCreatePost } from "@/lib/query/posts";
import { useUser } from "@/lib/query";
import { createPostSchema, type CreatePostData } from "@/lib/api/posts";

export function PostForm() {
  const createPostMutation = useCreatePost();
  const { data: userData } = useUser();

  const form = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: CreatePostData) => {
    createPostMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const content = form.watch("content");
  const characterCount = content.length;
  const maxChars = 1000;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3 py-2 w-full">
      {userData?.user && (
        <UserAvatar name={userData.user.name} className="h-10 w-10 shrink-0" />
      )}
      <div className="space-y-3 w-full">
        <Textarea
          placeholder="What is happening?!"
          className="min-h-[120px] border focus-visible:ring-0 text-[15px] p-3"
          {...form.register("content")}
        />
        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${
              characterCount > maxChars ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {characterCount > 0 && `${characterCount} / ${maxChars}`}
          </span>
          <Button
            type="submit"
            disabled={createPostMutation.isPending || characterCount === 0 || characterCount > maxChars}
            size="sm"
            className="rounded-full font-bold px-6"
          >
            {createPostMutation.isPending ? "Posting..." : "Post"}
          </Button>
        </div>
        {form.formState.errors.content && (
          <p className="text-sm text-destructive">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>
    </form>
  );
}
