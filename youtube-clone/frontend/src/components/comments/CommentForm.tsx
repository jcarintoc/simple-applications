import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Send, User } from "lucide-react";
import { useCreateComment } from "@/lib/query/comments";
import { useUser } from "@/lib/query/auth";
import { createCommentSchema, type CreateCommentInput } from "@/lib/api/types";
import { Link } from "react-router";

interface CommentFormProps {
  videoId: number;
}

const CommentForm = ({ videoId }: CommentFormProps) => {
  const { data: user } = useUser();
  const createMutation = useCreateComment();

  const form = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: CreateCommentInput) => {
    createMutation.mutate(
      { videoId, data },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to leave a comment
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Add a comment..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending || !form.watch("content")}
                >
                  <Send className="w-3 h-3" />
                  Comment
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CommentForm;
