import { useState, useCallback } from "react";
import { Copy, Trash2, Check, Eye, EyeOff, History, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSavedPasswords, useDeletePassword, useDeleteAllPasswords } from "@/lib/query";
import type { SavedPassword } from "@/lib/api/types";

function PasswordItem({ password, onDelete }: { password: SavedPassword; onDelete: (id: number) => void }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(password.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password.password]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-center gap-2">
          {password.label ? (
            <span className="font-medium truncate">{password.label}</span>
          ) : (
            <span className="text-muted-foreground italic">No label</span>
          )}
          <Badge variant="secondary" className="text-xs shrink-0">
            {password.length} chars
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <code className="font-mono text-sm text-muted-foreground truncate max-w-[200px]">
            {visible ? password.password : "•".repeat(Math.min(password.length, 20))}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {password.hasUppercase && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">A-Z</Badge>
          )}
          {password.hasLowercase && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">a-z</Badge>
          )}
          {password.hasNumbers && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">0-9</Badge>
          )}
          {password.hasSymbols && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">!@#</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          {formatDate(password.createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-8 w-8"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(password.id)}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function SavedPasswords() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState<number | null>(null);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  const { data: passwords, isLoading, error } = useSavedPasswords();
  const deleteMutation = useDeletePassword();
  const deleteAllMutation = useDeleteAllPasswords();

  const handleDeleteClick = (id: number) => {
    setPasswordToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (passwordToDelete === null) return;
    
    try {
      await deleteMutation.mutateAsync(passwordToDelete);
      setDeleteDialogOpen(false);
      setPasswordToDelete(null);
    } catch (error) {
      console.error("Failed to delete password:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllMutation.mutateAsync();
      setDeleteAllDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete all passwords:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Saved Passwords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Saved Passwords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Failed to load saved passwords
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <History className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Saved Passwords</CardTitle>
              <CardDescription>
                {passwords?.length || 0} password{passwords?.length !== 1 ? "s" : ""} saved
              </CardDescription>
            </div>
          </div>
          {passwords && passwords.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteAllDialogOpen(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!passwords || passwords.length === 0 ? (
            <div className="text-center py-12">
              <History className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">No saved passwords yet</p>
              <p className="text-sm text-muted-foreground/70">
                Generate and save passwords to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {passwords.map((password) => (
                <PasswordItem
                  key={password.id}
                  password={password}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Single Password Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Password
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this saved password? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete All Passwords Dialog */}
      <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete All Passwords
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all {passwords?.length} saved password{passwords?.length !== 1 ? "s" : ""}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteAllDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={deleteAllMutation.isPending}
            >
              {deleteAllMutation.isPending ? "Deleting..." : "Delete All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

