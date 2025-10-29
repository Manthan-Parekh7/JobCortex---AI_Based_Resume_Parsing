import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

import useFetch from "../../hooks/useFetch";
import { getMyCompany, createOrUpdateCompanyProfile } from "../../api/recruiterApi";
import { useAuth } from "../../hooks/useAuth";
import { BarLoader } from "react-spinners";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  description: z.string().optional(),
  logo: z.string().url({ message: "Logo must be a valid URL" }).optional().or(z.literal("")),
  contactEmail: z.string().email({ message: "Invalid email" }),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
  industry: z.string().optional(),
  size: z.string().optional(),
});

const CompanyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      logo: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      website: "",
      industry: "",
      size: "",
    },
  });

  const { execute: fetchCompany, loading: loadingFetch, data: companyDetails } = useFetch(getMyCompany);
  const { execute: createOrUpdateProfile, loading: loadingUpsert, error: errorUpsert } = useFetch(createOrUpdateCompanyProfile);

  useEffect(() => {
    if (user?.role === "recruiter") {
      fetchCompany();
    }
  }, [user, fetchCompany]);

  useEffect(() => {
    if (companyDetails) {
      console.log("Loading company details:", companyDetails); // Debug log
      setValue("name", companyDetails.name || "");
      setValue("description", companyDetails.description || "");
      setValue("logo", companyDetails.logo || "");
      setValue("contactEmail", companyDetails.contactEmail || user?.email || "");
      setValue("contactPhone", companyDetails.contactPhone || "");
      setValue("address", companyDetails.address || "");
      setValue("website", companyDetails.website || "");
      setValue("industry", companyDetails.industry || "");
      setValue("size", companyDetails.size || "");
      console.log("Set company size to:", companyDetails.size); // Debug log
    }
  }, [companyDetails, setValue, user?.email]);  // When creating a company, prefill contact email from logged-in user
  useEffect(() => {
    if (!user?.companyId && user?.email) {
      setValue("contactEmail", user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    const payload = { ...data };

    // Use the upsert functionality for both create and update
    const res = await createOrUpdateProfile(payload);
    if (res.success) {
      if (user?.companyId) {
        toast.success("Company profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.success("Company created successfully!");
        // Refresh company details to get the new company data
        setTimeout(() => {
          fetchCompany();
          window.location.reload(); // Refresh to update user context
        }, 1000);
      }
    } else {
      toast.error(res.message || res.error || "Something went wrong");
    }
  }; if (loadingFetch) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BarLoader color="#36d7b7" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto my-4 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">
                  {user?.companyId ? "Manage Company Profile" : "Create Company Profile"}
                </h1>
                <p className="text-muted-foreground">
                  {user?.companyId ? "Update your company information" : "Set up your company profile to start posting jobs"}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/recruiter")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                placeholder="Enter company name"
                {...register("name")}
                disabled={!isEditing && user?.companyId}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-1">Company Description</label>
              <Textarea
                id="description"
                placeholder="Company Description"
                {...register("description")}
                disabled={!isEditing && user?.companyId}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-semibold text-foreground mb-1">Logo URL</label>
              <Input
                id="logo"
                placeholder="https://.../logo.png"
                {...register("logo")}
                disabled={!isEditing && user?.companyId}
              />
              {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-semibold text-foreground mb-1">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="contactEmail"
                  placeholder="hr@company.com"
                  type="email"
                  {...register("contactEmail")}
                  disabled={!isEditing && user?.companyId}
                  className={errors.contactEmail ? "border-red-500" : ""}
                />
                {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>}
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-semibold text-foreground mb-1">Contact Phone</label>
                <Input
                  id="contactPhone"
                  placeholder="+1 555 123 4567"
                  {...register("contactPhone")}
                  disabled={!isEditing && user?.companyId}
                />
                {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-foreground mb-1">Address</label>
              <Textarea
                id="address"
                placeholder="Company address"
                {...register("address")}
                disabled={!isEditing && user?.companyId}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-semibold text-foreground mb-1">Website URL</label>
              <Input
                id="website"
                placeholder="Website URL"
                {...register("website")}
                disabled={!isEditing && user?.companyId}
              />
              {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Industry</label>
                <Input
                  placeholder="e.g., Software, Finance"
                  {...register("industry")}
                  disabled={!isEditing && user?.companyId}
                />
                {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Company Size</label>
                <Select
                  onValueChange={(value) => {
                    setValue("size", value, { shouldValidate: true });
                  }}
                  value={watch("size") || ""}
                  disabled={!isEditing && user?.companyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value=">1000">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
                {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              {user?.companyId && !isEditing && (
                <Button type="button" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                  Edit Profile
                </Button>
              )}
              {isEditing && (
                <>
                  <Button type="submit" disabled={loadingUpsert} className="w-full sm:w-auto">
                    {loadingUpsert ? <BarLoader color="#fff" height={4} width={50} /> : "Save Profile"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </>
              )}
              {!user?.companyId && (
                <Button type="submit" disabled={loadingUpsert} className="w-full sm:w-auto">
                  {loadingUpsert ? <BarLoader color="#fff" height={4} width={50} /> : "Create Company"}
                </Button>
              )}
            </div>

            {errorUpsert && (
              <p className="text-red-500 text-center">Error: {errorUpsert}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
