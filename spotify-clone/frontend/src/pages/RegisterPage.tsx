import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { AuthCard, AuthFormField } from "@/components/auth";
import { useRegister } from "@/lib/query";
import { registerSchema, type RegisterInput, type ErrorResponse } from "@/lib/api";

export function RegisterPage() {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data, {
      onError: (error) => {
        if (error instanceof AxiosError) {
          const errorData = error.response?.data as ErrorResponse | undefined;
          const errorMessage = errorData?.error || "Registration failed. Please try again.";

          if (errorMessage === "Email already registered") {
            form.setError("email", { message: errorMessage });
          } else {
            form.setError("root", { message: errorMessage });
          }
        }
      },
    });
  };

  return (
    <AuthCard
      title="Create an account"
      description="Enter your details to get started"
      footer={{
        text: "Already have an account?",
        linkText: "Sign in",
        linkTo: "/login",
      }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <AuthFormField
            control={form.control}
            name="name"
            label="Name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
          />
          <AuthFormField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
          />
          <AuthFormField
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
          />
          {form.formState.errors.root && (
            <p className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
