import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel, FieldDescription, FieldError } from "../ui/field";
import {
  createPostSchema,
  type CreatePostInput,
  type UpdatePostInput,
} from "@/lib/api";
import { Save, X } from "lucide-react";

interface PostFormProps {
  initialData?: UpdatePostInput;
  onSubmit: (data: CreatePostInput) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export const PostForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = "Save Post",
}: PostFormProps) => {
  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      published: initialData?.published ?? true,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Enter your post title..."
              className="text-lg"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Content</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              placeholder="Write your post content here..."
              className="min-h-[400px] resize-none font-mono text-sm leading-relaxed"
              aria-invalid={fieldState.invalid}
            />
            <FieldDescription>
              Write your content. Supports line breaks and basic formatting.
            </FieldDescription>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="published"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
          >
            <div className="flex items-start gap-4 border p-2">
              <Checkbox
                id={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
                className="mt-0.5"
              />
              <div className="space-y-1 leading-none">
                <FieldLabel htmlFor={field.name}>Publish post</FieldLabel>
                <FieldDescription>
                  Make this post visible to everyone. Uncheck to save as draft.
                </FieldDescription>
              </div>
            </div>

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-1 h-4 w-4" />
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
