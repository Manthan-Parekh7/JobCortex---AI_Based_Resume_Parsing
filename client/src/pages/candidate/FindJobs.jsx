import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import JobCard from "../../components/JobCard";
import useFetch from "../../hooks/useFetch";
import { getJobs } from "../../api/api";
import useDebounce from "../../hooks/useDebounce"; // Import useDebounce
import LocationDropdown from "../../components/LocationDropdown";

const JOBS_PER_PAGE = 9; // Define how many jobs per page

const FindJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search terms
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay
  const debouncedLocationTerm = useDebounce(locationTerm, 500); // 500ms delay

  const { execute: fetchJobs, loading, error, data: jobsData } = useFetch(getJobs);
  const isDebouncing =
    searchTerm !== debouncedSearchTerm || locationTerm !== debouncedLocationTerm;

  useEffect(() => {
    // Trigger fetch when debounced terms or page change
    fetchJobs({
      page: currentPage,
      limit: JOBS_PER_PAGE,
      search: debouncedSearchTerm,
      location: debouncedLocationTerm,
    });
  }, [fetchJobs, currentPage, debouncedSearchTerm, debouncedLocationTerm]);

  // Reset page to 1 when search terms change (before debouncing)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationTerm]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, jobsData?.totalPages || prev));
  };

  const handleRefresh = () => {
    fetchJobs({
      page: currentPage,
      limit: JOBS_PER_PAGE,
      search: debouncedSearchTerm,
      location: debouncedLocationTerm,
    });
  };

  return (
    <div className="pt-20 pb-16 container mx-auto px-4 md:px-8 lg:px-16">
      {error && (
        <div className="mb-8 rounded-2xl border border-red-300/40 bg-red-50/80 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-6 py-4 backdrop-blur-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover opportunities that match your skills and aspirations with our AI-powered job matching
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Job title or keyword"
                className="pl-12 h-12 rounded-xl border-border bg-background/50 text-foreground placeholder:text-muted-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative flex-grow">
              <LocationDropdown
                value={locationTerm}
                onChange={setLocationTerm}
                placeholder="City or state"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {jobsData?.jobs?.length > 0 ? (
          jobsData.jobs.map((job) => (
            <JobCard key={job._id} job={job} onRefresh={handleRefresh} />
          ))
        ) : (
          isDebouncing ? (
            <></>
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-2xl text-muted-foreground">{loading ? "" : "No jobs found."}</p>
              {!loading && (
                <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
              )}
            </div>
          )
        )}
      </div>

      {/* Pagination Controls */}
      {jobsData && jobsData.totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-16">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            variant="outline"
            size="lg"
            className="px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Previous
          </Button>
          <div className="px-6 py-3 bg-card border border-border rounded-xl">
            <span className="text-foreground font-medium">
              Page {currentPage} of {jobsData.totalPages}
            </span>
          </div>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === jobsData.totalPages}
            variant="outline"
            size="lg"
            className="px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default FindJobs;
