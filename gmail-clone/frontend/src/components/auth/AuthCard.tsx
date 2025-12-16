import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: {
    text: string;
    linkText: string;
    linkTo: string;
  };
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            {footer.text}{" "}
            <Link to={footer.linkTo} className="text-primary hover:underline">
              {footer.linkText}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
