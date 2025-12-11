import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { AuthCard, AuthFormField } from "@/components/auth";
import { useLogin } from "@/lib/query";
import { loginSchema, type LoginInput, type ErrorResponse } from "@/lib/api";

export function LoginPage() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data, {
      onError: (error) => {
        if (error instanceof AxiosError) {
          const errorData = error.response?.data as ErrorResponse | undefined;
          form.setError("root", {
            message: errorData?.error || "Login failed. Please try again.",
          });
        }
      },
    });
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to access your account"
      footer={{
        text: "Don't have an account?",
        linkText: "Sign up",
        linkTo: "/register",
      }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
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
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          {form.formState.errors.root && (
            <p className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
