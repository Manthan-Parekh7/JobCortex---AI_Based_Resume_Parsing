import React, { useEffect } from "react";
import ApplicationCard from "../../components/ApplicationCard";
import useFetch from "../../hooks/useFetch";
import api from "../../api/api";
import { BarLoader } from "react-spinners";

const MyApplications = () => {
  const { execute: fetchApplications, loading, error, data: applicationsData } = useFetch(api.get);

  const handleApplicationUpdate = () => {
    fetchApplications("/candidate/applications/me");
  };

  useEffect(() => {
    fetchApplications("/candidate/applications/me");
  }, [fetchApplications]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <BarLoader color="#36d7b7" />
        <p className="mt-4 text-muted-foreground">Loading your applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center py-16">
          <div className="mb-4 rounded-2xl border border-red-300/40 bg-red-50/80 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-6 py-4 backdrop-blur-sm max-w-md mx-auto">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 container mx-auto px-4 md:px-8 lg:px-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          My Applications
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Track and manage all your job applications in one place
        </p>
      </div>

      {/* Applications List */}
      <div className="max-w-4xl mx-auto">
        {applicationsData?.data?.applications?.length > 0 ? (
          <div className="space-y-6">
            {applicationsData.data.applications.map((app) => (
              <ApplicationCard key={app._id} application={app} onApplicationUpdated={handleApplicationUpdate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-12 max-w-md mx-auto">
              <p className="text-2xl text-muted-foreground mb-4">No applications found</p>
              <p className="text-muted-foreground">Start applying to jobs to see them here!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;