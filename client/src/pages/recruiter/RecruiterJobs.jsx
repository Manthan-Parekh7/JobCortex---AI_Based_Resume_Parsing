import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit3,
    Trash2,
    Users,
    Calendar,
    MapPin,
    Briefcase,
    TrendingUp,
    Pause,
    Play
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';
import { getMyJobs, deleteJob, updateHiringStatus } from '../../api/recruiterApi';
import useFetch from '../../hooks/useFetch';

const RecruiterJobs = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [jobs, setJobs] = useState([]);

    const { execute: fetchJobs, loading, data: jobsData } = useFetch(getMyJobs);

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (jobsData?.jobs) {
            setJobs(jobsData.jobs);
        }
    }, [jobsData]);

    const handleDeleteJob = async (jobId) => {
        try {
            await deleteJob(jobId);
            setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
            toast.success('Job deleted successfully');
        } catch {
            toast.error('Failed to delete job');
        }
    };

    const handleToggleStatus = async (jobId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? false : true;
            await updateHiringStatus(jobId, newStatus);

            setJobs(prevJobs =>
                prevJobs.map(job =>
                    job._id === jobId
                        ? { ...job, status: newStatus ? 'active' : 'inactive' }
                        : job
                )
            );

            toast.success(`Job ${newStatus ? 'activated' : 'deactivated'} successfully`);
        } catch {
            toast.error('Failed to update job status');
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const JobCard = ({ job }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                            <CardDescription className="flex items-center space-x-4">
                                <span className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {job.location}
                                </span>
                                <span className="flex items-center">
                                    <Briefcase className="h-4 w-4 mr-1" />
                                    {job.jobType}
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(job.status)}>
                                {job.status}
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate(`/recruiter/applications/${job._id}`)}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Applications
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(`/recruiter/edit-job/${job._id}`)}>
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Edit Job
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleStatus(job._id, job.status)}>
                                        {job.status === 'active' ? (
                                            <>
                                                <Pause className="h-4 w-4 mr-2" />
                                                Deactivate
                                            </>
                                        ) : (
                                            <>
                                                <Play className="h-4 w-4 mr-2" />
                                                Activate
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the job posting
                                                    and remove all associated applications.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteJob(job._id)}>
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-2xl font-bold">{job.applicationCount || 0}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Applications</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                                <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-2xl font-bold">{job.viewCount || 0}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Views</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-2xl font-bold">
                                    {Math.ceil((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24))}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">Days Active</p>
                        </div>
                    </div>

                    {job.salary && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Salary</p>
                            <p className="text-lg font-semibold">{job.salary}</p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/recruiter/applications/${job._id}`)}
                            className="flex-1"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            View Applications ({job.applicationCount || 0})
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/recruiter/edit-job/${job._id}`)}
                        >
                            <Edit3 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <BarLoader color="#36d7b7" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">My Jobs</h1>
                    <p className="text-muted-foreground">
                        Manage your job postings and track their performance
                    </p>
                </div>
                <Button onClick={() => navigate('/recruiter/post-job')} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                </Button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                                <p className="text-3xl font-bold">{jobs.length}</p>
                            </div>
                            <Briefcase className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                                <p className="text-3xl font-bold">
                                    {jobs.filter(job => job.status === 'active').length}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                                <p className="text-3xl font-bold">
                                    {jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0)}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                                <p className="text-3xl font-bold">
                                    {jobs.reduce((sum, job) => sum + (job.viewCount || 0), 0)}
                                </p>
                            </div>
                            <Eye className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search jobs by title or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>

            {/* Jobs Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))
                ) : (
                    <div className="col-span-full">
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {jobs.length === 0
                                        ? "You haven't posted any jobs yet."
                                        : "No jobs match your current filters."
                                    }
                                </p>
                                {jobs.length === 0 && (
                                    <Button onClick={() => navigate('/recruiter/post-job')}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Post Your First Job
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default RecruiterJobs;