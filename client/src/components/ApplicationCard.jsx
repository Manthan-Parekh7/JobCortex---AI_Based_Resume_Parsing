import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import ViewApplicationDialog from "./ViewApplicationDialog";
import EditApplicationDialog from "./EditApplicationDialog";
import ConfirmationDialog from "./ConfirmationDialog"; // Import the new dialog
import { toast } from "sonner";
import { withdrawApplication, deleteApplication } from "../api/api";

const ApplicationCard = ({ application, onApplicationUpdated }) => {
  const [isViewApplicationDialogOpen, setIsViewApplicationDialogOpen] = useState(false);
  const [isEditApplicationDialogOpen, setIsEditApplicationDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleWithdrawConfirm = async () => {
    try {
      await withdrawApplication(application._id);
      toast.success("Application withdrawn successfully.");
      onApplicationUpdated(); // Refresh the list
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteApplication(application._id);
      toast.success("Application deleted successfully.");
      onApplicationUpdated(); // Refresh the list
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formattedDate = new Date(application.appliedAt).toLocaleDateString();
  const isWithdrawn = application.status.toLowerCase() === "withdrawn";

  return (
    <div className="relative z-10 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row justify-between items-start">
      <div className="flex-grow">
        <h3 className="text-xl font-semibold">{application.job.title}</h3>
        <p className="text-muted-foreground">{application.job.company?.name || 'Company'}</p>
        <p className="text-sm text-muted-foreground mt-2">Applied on: {formattedDate}</p>
      </div>
      <div className="flex flex-col items-end mt-4 md:mt-0">
        <Badge variant={getStatusBadgeVariant(application.status)} className="mb-4">
          {application.status}
        </Badge>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsViewApplicationDialogOpen(true)}>View</Button>
          <Button variant="secondary" onClick={() => setIsEditApplicationDialogOpen(true)} disabled={isWithdrawn}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsWithdrawDialogOpen(true)} disabled={isWithdrawn}>
            Withdraw
          </Button>
          {isWithdrawn && (
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ViewApplicationDialog
        application={application}
        open={isViewApplicationDialogOpen}
        onOpenChange={setIsViewApplicationDialogOpen}
      />
      <EditApplicationDialog
        application={application}
        open={isEditApplicationDialogOpen}
        onOpenChange={setIsEditApplicationDialogOpen}
        onApplicationUpdated={() => {
          onApplicationUpdated();
          setIsEditApplicationDialogOpen(false);
        }}
      />
      <ConfirmationDialog
        open={isWithdrawDialogOpen}
        onOpenChange={setIsWithdrawDialogOpen}
        title="Withdraw Application"
        description="Are you sure you want to withdraw this application? This action cannot be undone."
        onConfirm={handleWithdrawConfirm}
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Application"
        description="Are you sure you want to permanently delete this application? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ApplicationCard;