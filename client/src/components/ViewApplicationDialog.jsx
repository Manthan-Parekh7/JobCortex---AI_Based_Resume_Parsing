import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MarkdownViewer } from "./ui/markdown-editor";
import useScrollLock from "../hooks/useScrollLock";

const ViewApplicationDialog = ({ application, open, onOpenChange }) => {
  // Ensure proper scroll management
  useScrollLock(open);

  if (!application) return null;

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary";
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      case "withdrawn":
        return "outline";
      default:
        return "outline";
    }
  };

  const formattedDate = new Date(application.appliedAt).toLocaleDateString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Application for {application.job.title}</DialogTitle>
          <DialogDescription>at {application.job.company?.name || 'Company'}</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant={getStatusBadgeVariant(application.status)}>
              {application.status}
            </Badge>
            <p className="text-sm text-muted-foreground">Applied on: {formattedDate}</p>
          </div>

          {application.coverLetter && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Cover Letter</h3>
              <MarkdownViewer value={application.coverLetter} />
            </div>
          )}

          {application.resume && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Resume</h3>
              <a href={application.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View Resume
              </a>
            </div>
          )}

          {application.recruiter && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Recruiter Details</h3>
              <p>Username: {application.recruiter.username}</p>
              <p>Email: {application.recruiter.email}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationDialog;
