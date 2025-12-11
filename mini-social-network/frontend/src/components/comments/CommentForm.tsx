import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/users/UserAvatar";
import { useCreateComment } from "@/lib/query/comments";
import { useUser } from "@/lib/query";
import { createCommentSchema, type CreateCommentData } from "@/lib/api/comments";

interface CommentFormProps {
  postId: number;
}

export function CommentForm({ postId }: CommentFormProps) {
  const createCommentMutation = useCreateComment();
  const { data: userData } = useUser();

  const form = useForm<CreateCommentData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: CreateCommentData) => {
    createCommentMutation.mutate(
      { postId, data },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  const content = form.watch("content");
  const characterCount = content.length;
  const maxChars = 500;

  return (
    <div className="px-4 py-3">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
        {userData?.user && (
          <UserAvatar name={userData.user.name} className="h-10 w-10 shrink-0" />
        )}
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Post your reply"
            className="min-h-[80px] border focus-visible:ring-0 text-[15px] p-3"
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
              size="sm"
              disabled={createCommentMutation.isPending || characterCount === 0 || characterCount > maxChars}
              className="rounded-full font-bold"
            >
              {createCommentMutation.isPending ? "Replying..." : "Reply"}
            </Button>
          </div>
          {form.formState.errors.content && (
            <p className="text-sm text-destructive">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
