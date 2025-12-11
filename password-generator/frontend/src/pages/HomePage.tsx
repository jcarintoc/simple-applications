import { Link } from "react-router-dom";
import { KeyRound, User, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordGenerator } from "@/components/password";
import { useUser } from "@/lib/query";

export function HomePage() {
  const { data: userData, isLoading } = useUser();
  const isAuthenticated = !!userData?.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-primary to-primary/70 p-2.5">
                <KeyRound className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">SecureGen</h1>
                <p className="text-xs text-muted-foreground">Password Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
              ) : isAuthenticated ? (
                <Button asChild size="sm">
                  <Link to="/dashboard">
                    <History className="h-4 w-4" />
                    My Passwords
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/register">
                      <User className="h-4 w-4" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Generate <span className="text-primary">Secure</span> Passwords
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create strong, random passwords instantly. No sign-up required.
            {!isAuthenticated && (
              <span className="block mt-2 text-base">
                <Link to="/register" className="text-primary hover:underline">
                  Create an account
                </Link>{" "}
                to save your passwords securely.
              </span>
            )}
          </p>
        </div>

        {/* Password Generator */}
        <div className="max-w-xl mx-auto">
          <PasswordGenerator />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="text-center p-6 rounded-xl bg-card border">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Cryptographically Secure</h3>
            <p className="text-sm text-muted-foreground">
              Uses crypto-grade randomization for maximum security
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-card border">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <History className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Save History</h3>
            <p className="text-sm text-muted-foreground">
              Sign in to save and manage your generated passwords
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-card border">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">No Tracking</h3>
            <p className="text-sm text-muted-foreground">
              We never store or log passwords without your permission
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            SecureGen Password Generator — Built with security in mind
          </p>
        </div>
      </footer>
    </div>
  );
}

