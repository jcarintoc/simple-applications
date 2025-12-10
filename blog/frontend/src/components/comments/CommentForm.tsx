import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { createCommentSchema, type CreateCommentInput } from "@/lib/api";
import { MessageSquarePlus } from "lucide-react";

interface CommentFormProps {
  onSubmit: (data: CreateCommentInput) => void;
  isSubmitting?: boolean;
}

export const CommentForm = ({ onSubmit, isSubmitting }: CommentFormProps) => {
  const form = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = (data: CreateCommentInput) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
              <MessageSquarePlus className="h-4 w-4" />
              Add a Comment
            </FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              placeholder="Share your thoughts..."
              className="min-h-[100px] resize-none"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
};
