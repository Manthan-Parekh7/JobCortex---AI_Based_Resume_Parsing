import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  ArrowLeft,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { getMyJobs, getApplicationStats } from '../../api/recruiterApi';

const JobApplications = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0
  });

  useEffect(() => {
    fetchJobsData();
  }, []);

  const fetchJobsData = async () => {
    try {
      setLoading(true);
      const [jobsData, applicationStats] = await Promise.all([
        getMyJobs(),
        getApplicationStats()
      ]);
      setJobs(jobsData || []);
      setStats(applicationStats);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs data');
    } finally {
      setLoading(false);
    }
  }; if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Pending Review',
      value: stats.pendingApplications,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Accepted',
      value: stats.acceptedApplications,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Rejected',
      value: stats.rejectedApplications,
      icon: XCircle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto my-4 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Job Applications Overview</h1>
                <p className="text-muted-foreground">Manage applications across all your job postings</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/recruiter")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Jobs with Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Jobs with Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Jobs Posted Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by posting your first job to receive applications.
                </p>
                <Button onClick={() => navigate("/recruiter")}>
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                            {job.status === 'active' ? 'Active' : 'Paused'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.applicationCount || 0} applications
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                          {job.company && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {job.company.name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {(job.applicationCount || 0) > 0 && (
                          <Button
                            onClick={() => navigate(`/recruiter/applications/${job._id}`)}
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Applications
                          </Button>
                        )}
                        {(job.applicationCount || 0) === 0 && (
                          <p className="text-sm text-muted-foreground">No applications yet</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobApplications;
