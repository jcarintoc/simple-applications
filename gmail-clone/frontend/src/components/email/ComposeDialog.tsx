import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useSendEmail } from "@/lib/query/emails";
import { useUserSearch } from "@/lib/query/users";
import { sendEmailInputSchema, type SendEmailInput } from "@/lib/api/types";

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComposeDialog({ open, onOpenChange }: ComposeDialogProps) {
  const [toQuery, setToQuery] = useState("");
  const sendEmailMutation = useSendEmail();
  const { data: searchResults } = useUserSearch(toQuery);

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
  } = useForm<SendEmailInput>({
    resolver: zodResolver(sendEmailInputSchema),
    defaultValues: {
      to_email: "",
      subject: "",
      body: "",
    },
  });

  const toEmail = watch("to_email");

  const onSubmit = (data: SendEmailInput) => {
    sendEmailMutation.mutate(data, {
      onSuccess: () => {
        reset({
          to_email: "",
          subject: "",
          body: "",
        });
        setToQuery("");
        onOpenChange(false);
      },
    });
  };

  const handleSelectUser = (email: string) => {
    setValue("to_email", email);
    setToQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col space-y-4">
          <Controller
            name="to_email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="to_email">To</FieldLabel>
                <div className="relative">
                  <Input
                    id="to_email"
                    placeholder="Recipient email"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setToQuery(e.target.value);
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                  {searchResults && searchResults.length > 0 && toQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleSelectUser(user.email)}
                          className="w-full text-left px-3 py-2 hover:bg-muted"
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="subject"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <Input id="subject" {...field} aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="body"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="flex-1 flex flex-col" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="body">Message</FieldLabel>
                <textarea
                  id="body"
                  {...field}
                  className="flex-1 min-h-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset({
                  to_email: "",
                  subject: "",
                  body: "",
                });
                setToQuery("");
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={sendEmailMutation.isPending}>
              {sendEmailMutation.isPending ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}