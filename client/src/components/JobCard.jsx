import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import JobDetailsDialog from "./JobDetailsDialog";
import ApplyJobDialog from "./ApplyJobDialog";
import { useAuth } from "../hooks/useAuth";

const JobCard = ({ job, onRefresh }) => {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isApplyJobDialogOpen, setIsApplyJobDialogOpen] = useState(false);

  const { user } = useAuth();

  const handleViewDetailsClick = () => {
    setSelectedJobId(job._id);
    setIsDetailsDialogOpen(true);
  };

  const handleApplyNowClick = () => {
    setSelectedJobId(job._id);
    setIsApplyJobDialogOpen(true);
  };

  return (
    <div className="relative z-10 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold">{job.title}</h3>
        <p className="text-muted-foreground">{job.company?.name || 'Company Name'}</p>
        <p className="text-sm text-muted-foreground mt-2">{job.location}</p>
        <p className="mt-4">{job.description?.replace(/[#*`_[\]]/g, '').substring(0, 150)}...</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.salary && <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">{job.salary}</Badge>}
          {job.location && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200">{job.location}</Badge>}
          {job.jobType && <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-800 dark:text-purple-200">{job.jobType}</Badge>}
          {job.tags && Array.isArray(job.tags) && job.tags.map((tag, index) => (
            <Badge key={index} className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        {job.hasApplied ? (
          <Button disabled className="bg-green-600 text-white hover:bg-green-600">
            Applied
          </Button>
        ) : (
          <Button onClick={handleApplyNowClick}>Apply Now</Button>
        )}
        <Button variant="outline" onClick={handleViewDetailsClick}>View Details</Button>
      </div>

      <JobDetailsDialog
        jobId={selectedJobId}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        onRefresh={onRefresh}
      />

      <ApplyJobDialog
        jobId={selectedJobId}
        job={job}
        open={isApplyJobDialogOpen}
        onOpenChange={setIsApplyJobDialogOpen}
        userProfileResume={user?.resume}
        onApplicationSuccess={onRefresh}
      />
    </div>
  );
};

export default JobCard;
