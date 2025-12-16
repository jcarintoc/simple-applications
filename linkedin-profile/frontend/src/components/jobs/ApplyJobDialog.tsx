import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApplyToJob } from "@/lib/query/jobs";
import { jobApplicationSchema, type JobApplicationInput, type JobPost } from "@/lib/api/types";

interface ApplyJobDialogProps {
  job: JobPost;
}

export function ApplyJobDialog({ job }: ApplyJobDialogProps) {
  const [open, setOpen] = useState(false);
  const applyToJob = useApplyToJob();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JobApplicationInput>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      cover_letter: "",
    },
  });

  const onSubmit = async (data: JobApplicationInput) => {
    try {
      await applyToJob.mutateAsync({ jobId: job.id, input: data });
      toast.success("Application submitted successfully!");
      setOpen(false);
      reset();
    } catch {
      toast.error("Failed to submit application");
    }
  };

  if (job.has_applied) {
    return (
      <Button disabled>
        <Send className="h-4 w-4" />
        Already Applied
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send className="h-4 w-4" />
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for {job.job_title}</DialogTitle>
          <DialogDescription>
            at {job.company_name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cover_letter">Cover Letter (Optional)</Label>
            <Textarea
              id="cover_letter"
              placeholder="Tell the employer why you're a great fit for this role..."
              rows={6}
              {...register("cover_letter")}
            />
            {errors.cover_letter && (
              <p className="text-sm text-red-500">{errors.cover_letter.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || applyToJob.isPending}>
              {isSubmitting || applyToJob.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
