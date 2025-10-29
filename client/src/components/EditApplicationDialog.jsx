import React, { useState, useEffect } from "react";
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
import api from "../api/api";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { MarkdownEditor } from "./ui/markdown-editor";
import useScrollLock from "../hooks/useScrollLock";

const EditApplicationDialog = ({ application, open, onOpenChange, onApplicationUpdated }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [newResumeFile, setNewResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ensure proper scroll management
  useScrollLock(open);

  useEffect(() => {
    if (application) {
      setCoverLetter(application.coverLetter || "");
    }
  }, [application]);

  const handleFileChange = (e) => {
    setNewResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("coverLetter", coverLetter);

    if (newResumeFile) {
      formData.append("resume", newResumeFile);
    }

    try {
      const res = await api.put(`/candidate/applications/${application._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message);
      onApplicationUpdated(); // Callback to refresh the list
      onOpenChange(false); // Close dialog
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Application for {application?.job?.title}</DialogTitle>
          <DialogDescription>at {application?.job?.company?.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <MarkdownEditor
              value={coverLetter}
              onChange={setCoverLetter}
              placeholder="Edit your cover letter..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="newResume">Upload New Resume (Optional, will replace existing)</Label>
            <Input
              id="newResume"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <BarLoader color="#ffffff" /> : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditApplicationDialog;