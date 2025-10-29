import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import useFetch from "../hooks/useFetch";
import { getJobDetails } from "../api/api";
import { BarLoader } from "react-spinners";
import ApplyJobDialog from "./ApplyJobDialog";
import { useAuth } from "../hooks/useAuth";
import useScrollLock from "../hooks/useScrollLock";
import { MarkdownViewer } from "./ui/markdown-editor";

const JobDetailsDialog = ({ jobId, open, onOpenChange, onRefresh }) => {
  const { execute: fetchJob, loading, error, data: jobDetails } = useFetch(getJobDetails);
  const [isApplyJobDialogOpen, setIsApplyJobDialogOpen] = useState(false);

  const { user } = useAuth();

  // Ensure proper scroll management
  useScrollLock(open);

  useEffect(() => {
    if (open && jobId) {
      fetchJob(jobId);
    }
  }, [open, jobId, fetchJob]);

  const handleApplyNowClick = () => {
    setIsApplyJobDialogOpen(true);
  };

  const handleApplicationSuccess = () => {
    // Refresh the job details to show updated application count
    fetchJob(jobId);
    // Also call the parent refresh function if provided
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <BarLoader color="#36d7b7" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-8">Error: {error}</div>
        )}

        {jobDetails && !loading && (
          <>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">{jobDetails.job.title}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {jobDetails.job.company?.name} - {jobDetails.job.location}
              </DialogDescription>

              {/* Job Status and Application Count */}
              <div className="flex items-center gap-4 mt-2">
                <Badge className={`${jobDetails.job.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-800 dark:text-red-200'}`}>
                  {jobDetails.job.status === 'active' ? 'Currently Recruiting' : 'Not Recruiting'}
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200">
                  {jobDetails.job.applicationCount || 0} Application{(jobDetails.job.applicationCount || 0) !== 1 ? 's' : ''}
                </Badge>
              </div>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                {jobDetails.job.salary && <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">{jobDetails.job.salary}</Badge>}
                {jobDetails.job.jobType && <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-800 dark:text-purple-200">{jobDetails.job.jobType}</Badge>}
                {jobDetails.job.tags && Array.isArray(jobDetails.job.tags) && jobDetails.job.tags.map((tag, index) => (
                  <Badge key={index} className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Job Description</h3>
                <MarkdownViewer value={jobDetails.job.description} className="text-muted-foreground" />
              </div>

              {jobDetails.job.responsibilities && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Responsibilities</h3>
                  <MarkdownViewer value={jobDetails.job.responsibilities} className="text-muted-foreground" />
                </div>
              )}

              {jobDetails.job.requirements && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Requirements</h3>
                  <MarkdownViewer value={jobDetails.job.requirements} className="text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              {jobDetails.job.hasApplied ? (
                <Button disabled className="bg-green-600 text-white hover:bg-green-600">
                  Applied
                </Button>
              ) : (
                <Button onClick={handleApplyNowClick}>Apply Now</Button>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </>
        )}
      </DialogContent>

      <ApplyJobDialog
        jobId={jobId}
        job={jobDetails?.job}
        open={isApplyJobDialogOpen}
        onOpenChange={setIsApplyJobDialogOpen}
        userProfileResume={user?.resume}
        onApplicationSuccess={handleApplicationSuccess}
      />
    </Dialog>
  );
};

export default JobDetailsDialog;
