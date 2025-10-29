import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import api from "../api/api";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { MarkdownEditor } from "./ui/markdown-editor";
import useScrollLock from "../hooks/useScrollLock";

const ApplyJobDialog = ({ jobId, job, open, onOpenChange, userProfileResume, onApplicationSuccess }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [jobSpecificResumeFile, setJobSpecificResumeFile] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [loading, setLoading] = useState(false);

  // Ensure proper scroll management
  useScrollLock(open);

  const handleFileChange = (e) => {
    setJobSpecificResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    console.log("Cover Letter (client-side) before sending:", coverLetter);
    formData.append("coverLetter", coverLetter);

    if (!useProfileResume && jobSpecificResumeFile) {
      formData.append("resume", jobSpecificResumeFile);
    } else if (!useProfileResume && !jobSpecificResumeFile) {
      toast.error("Please upload a resume for this application or use your profile resume.");
      setLoading(false);
      return;
    } else if (useProfileResume && !userProfileResume) {
      toast.error("You have not uploaded a resume to your profile. Please upload one or provide a job-specific resume.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(`/candidate/jobs/${jobId}/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message);
      onOpenChange(false); // Close dialog on success
      if (onApplicationSuccess) {
        onApplicationSuccess(); // Refresh parent component
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Apply for {job?.title}</DialogTitle>
          <DialogDescription>at {job?.company?.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <MarkdownEditor
              value={coverLetter}
              onChange={setCoverLetter}
              placeholder="Write a compelling cover letter to introduce yourself..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="useProfileResume"
              checked={useProfileResume}
              onCheckedChange={setUseProfileResume}
            />
            <Label htmlFor="useProfileResume">Use resume from my profile</Label>
          </div>

          {!useProfileResume && (
            <div className="grid gap-2">
              <Label htmlFor="jobSpecificResume">Upload Job-Specific Resume (PDF or DOCX)</Label>
              <Input
                id="jobSpecificResume"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <BarLoader color="#ffffff" /> : "Submit Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobDialog;
