import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MarkdownEditor } from "../../components/ui/markdown-editor";
import { State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Building2, Plus, Briefcase, AlertCircle } from "lucide-react";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import useFetch from "../../hooks/useFetch";
import { addNewJob, getMyCompany } from "../../api/recruiterApi";
import { useAuth } from "../../hooks/useAuth";
import { BarLoader } from "react-spinners";
import AddCompanyDrawer from "../../components/AddCompanyDrawer";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  responsibilities: z.string().optional(),
  requirements: z.string().min(1, { message: "Requirements are required" }),
  salary: z.string().optional(),
  location: z.string().min(1, { message: "Select a location" }),
  jobType: z.string().min(1, { message: "Select job type" }),
});

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      location: "",
      jobType: "Full-time",
      requirements: "",
      responsibilities: "",
      salary: "",
      title: "",
      description: ""
    },
    resolver: zodResolver(schema),
  });

  const { execute: createJob, loading: loadingCreateJob, error: errorCreateJob, data: dataCreateJob } = useFetch(addNewJob);
  const { execute: fetchMyCompany, loading: loadingCompany, data: myCompany } = useFetch(getMyCompany);
  const [openCompanyDrawer, setOpenCompanyDrawer] = useState(false);

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const indianStates = State.getStatesOfCountry("IN");



  useEffect(() => {
    fetchMyCompany();
  }, [fetchMyCompany]);

  useEffect(() => {
    if (dataCreateJob) {
      toast.success("Job posted successfully!");
      navigate("/recruiter");
    }
    if (errorCreateJob) {
      toast.error(errorCreateJob);
    }
  }, [dataCreateJob, errorCreateJob, navigate]);

  const onSubmit = async (data) => {
    if (!myCompany?._id) {
      toast.error("Please create a company profile first");
      setOpenCompanyDrawer(true);
      return;
    }

    await createJob({
      ...data,
      company: myCompany._id,
      recruiter: user._id,
    });
  };

  const handleCompanyCreated = () => {
    fetchMyCompany();
    setOpenCompanyDrawer(false);
  };

  if (loadingCompany) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BarLoader color="#36d7b7" />
      </div>
    );
  }

  const needsCompany = !myCompany?._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto my-4 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Post a New Job</h1>
              <p className="text-muted-foreground">Create and publish a job posting to attract top talent</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/recruiter")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Post a New Job</h1>
            <p className="text-muted-foreground">
              Create a detailed job posting to attract the best candidates
            </p>
          </motion.div>

          {/* Company Warning */}
          {needsCompany && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        Company Profile Required
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        You need to create a company profile before posting jobs.
                      </p>
                    </div>
                    <Button
                      onClick={() => setOpenCompanyDrawer(true)}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Company
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Job Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Details
                </CardTitle>
                <CardDescription>
                  Fill in the information below to create your job posting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g. Senior Frontend Developer"
                          {...register("title")}
                        />
                        {errors.title && (
                          <p className="text-red-500 text-sm">{errors.title.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobType">Job Type *</Label>
                        <Controller
                          name="jobType"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {jobTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.jobType && (
                          <p className="text-red-500 text-sm">{errors.jobType.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Controller
                          name="location"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {indianStates.map((state) => (
                                    <SelectItem key={state.isoCode} value={state.name}>
                                      {state.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.location && (
                          <p className="text-red-500 text-sm">{errors.location.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salary">Salary Range</Label>
                        <Input
                          id="salary"
                          placeholder="e.g. ₹8-12 LPA"
                          {...register("salary")}
                        />
                        {errors.salary && (
                          <p className="text-red-500 text-sm">{errors.salary.message}</p>
                        )}
                      </div>
                    </div>

                    {myCompany && (
                      <div className="p-3 bg-accent rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Posting for: <span className="font-medium text-foreground">{myCompany.name}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Job Description */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Job Description</h3>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <MarkdownEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter job description..."
                            className="min-h-[200px]"
                          />
                        )}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Responsibilities</h3>
                    <div className="space-y-2">
                      <Label htmlFor="responsibilities">Key Responsibilities</Label>
                      <Controller
                        name="responsibilities"
                        control={control}
                        render={({ field }) => (
                          <MarkdownEditor
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Enter key responsibilities for this position..."
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Requirements</h3>
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requirements & Qualifications *</Label>
                      <Controller
                        name="requirements"
                        control={control}
                        render={({ field }) => (
                          <MarkdownEditor
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Enter requirements and qualifications..."
                          />
                        )}
                      />
                      {errors.requirements && (
                        <p className="text-red-500 text-sm">{errors.requirements.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Loading State */}
                  {loadingCreateJob && (
                    <div className="flex justify-center py-4">
                      <BarLoader color="#36d7b7" />
                    </div>
                  )}

                  {/* Error State */}
                  {errorCreateJob && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm">{errorCreateJob}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={loadingCreateJob || needsCompany}
                      className="flex-1"
                    >
                      {loadingCreateJob ? "Posting Job..." : "Post Job"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/recruiter")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Company Creation Drawer */}
          <AddCompanyDrawer
            open={openCompanyDrawer}
            onOpenChange={setOpenCompanyDrawer}
            onSuccess={handleCompanyCreated}
          />
        </div>
      </div>
    </div>
  );
};

export default PostJob;
