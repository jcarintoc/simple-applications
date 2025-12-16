import { useParams } from "react-router-dom";
import { Sidebar } from "@/components/email/Sidebar";
import { EmailView } from "@/components/email/EmailView";
import { ComposeDialog } from "@/components/email/ComposeDialog";
import { useEmail } from "@/lib/query/emails";
import { useState } from "react";

export function EmailDetailPage() {
  const { id } = useParams<{ id: string }>();
  const emailId = id ? parseInt(id, 10) : 0;
  const { data: email, isLoading } = useEmail(emailId);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar onComposeClick={() => setIsComposeOpen(true)} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading email...</p>
        </div>
        <ComposeDialog open={isComposeOpen} onOpenChange={setIsComposeOpen} />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex h-screen">
        <Sidebar onComposeClick={() => setIsComposeOpen(true)} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Email not found</p>
        </div>
        <ComposeDialog open={isComposeOpen} onOpenChange={setIsComposeOpen} />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar onComposeClick={() => setIsComposeOpen(true)} />
      <EmailView email={email} />
      <ComposeDialog open={isComposeOpen} onOpenChange={setIsComposeOpen} />
    </div>
  );
}