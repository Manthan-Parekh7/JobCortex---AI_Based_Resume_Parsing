import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    Plus,
    TrendingUp,
    Users,
    Briefcase,
    Calendar,
    Eye,
    Search,
    Filter,
    MoreVertical,
    Edit3,
    Trash2,
    MapPin,
    Pause,
    Play,
    Star,
    Clock,
    CheckCircle,
    XCircle,
    ArrowUpRight,
    Target,
    Award,
    Activity
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
import { getMyJobs, deleteJob, updateHiringStatus, getMyCompany, getApplicationStats } from '../../api/recruiterApi';
import useFetch from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';

const UnifiedRecruiterDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        newApplications: 0,
        pendingApplications: 0,
        acceptedApplications: 0,
        rejectedApplications: 0,
        interviewsScheduled: 0,
        hiredCandidates: 0
    });

    const { execute: fetchJobs, loading: loadingJobs, data: jobsData } = useFetch(getMyJobs);
    const { execute: fetchCompany, loading: loadingCompany, data: company } = useFetch(getMyCompany);

    useEffect(() => {
        fetchDashboardData();

        // Refresh when window regains focus (returning from applications page)
        const handleFocus = () => {
            refreshDashboard();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        console.log('jobsData received:', jobsData, 'type:', typeof jobsData, 'isArray:', Array.isArray(jobsData));
        if (jobsData) {
            updateStats(jobsData);
        }
    }, [jobsData]);

    const fetchDashboardData = async () => {
        try {
            console.log('Fetching dashboard data...');
            const [companyResult, jobsResult, applicationStatsResult] = await Promise.all([
                fetchCompany(),
                fetchJobs(),
                getApplicationStats()
            ]);
            console.log('Company result:', companyResult);
            console.log('Jobs result:', jobsResult);
            console.log('Application stats result:', applicationStatsResult);

            // Update stats with application data
            if (applicationStatsResult && jobsResult) {
                updateStatsWithApplicationData(jobsResult, applicationStatsResult);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        }
    };

    const updateStatsWithApplicationData = (jobs, applicationStats) => {
        console.log('Updating stats with jobs and application data:', jobs, applicationStats);
        const jobsArray = Array.isArray(jobs) ? jobs : [];
        const totalJobs = jobsArray.length;
        const activeJobs = jobsArray.filter(job => job.status === 'active').length;

        setStats(prev => ({
            ...prev,
            totalJobs,
            activeJobs,
            totalApplications: applicationStats.totalApplications || 0,
            pendingApplications: applicationStats.pendingApplications || 0,
            acceptedApplications: applicationStats.acceptedApplications || 0,
            rejectedApplications: applicationStats.rejectedApplications || 0,
            newApplications: applicationStats.pendingApplications || 0, // Use pending as "new"
            interviewsScheduled: Math.floor((applicationStats.acceptedApplications || 0) * 0.6), // Mock: 60% of accepted move to interviews
            hiredCandidates: applicationStats.acceptedApplications || 0 // Use accepted as hired for now
        }));
    };

    const updateStats = (jobs) => {
        const jobsArray = Array.isArray(jobs) ? jobs : [];
        const totalJobs = jobsArray.length;
        const activeJobs = jobsArray.filter(job => job.status === 'active').length;
        const totalApplications = jobsArray.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
        const newApplications = jobsArray.reduce((sum, job) => {
            // Mock calculation for new applications in last 3 days
            return sum + Math.floor((job.applicationCount || 0) * 0.3);
        }, 0);

        setStats(prev => ({
            ...prev,
            totalJobs,
            activeJobs,
            totalApplications,
            newApplications,
            interviewsScheduled: Math.floor(totalApplications * 0.15), // Mock data
            hiredCandidates: Math.floor(totalApplications * 0.08) // Mock data
        }));
    };

    const refreshDashboard = async () => {
        console.log('Refreshing dashboard data...');
        await fetchDashboardData();
    };

    const handleDeleteJob = async (jobId) => {
        try {
            await deleteJob(jobId);
            toast.success('Job deleted successfully!');
            fetchJobs(); // Refresh the jobs list
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error('Failed to delete job');
        }
    };

    const handleToggleStatus = async (jobId, currentStatus) => {
        try {
            // Convert frontend status to backend status
            const newBackendStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await updateHiringStatus(jobId, newBackendStatus);
            toast.success(`Job ${newBackendStatus === 'active' ? 'activated' : 'paused'} successfully!`);
            fetchJobs(); // Refresh the jobs list
        } catch (error) {
            console.error('Error updating job status:', error);
            toast.error('Failed to update job status');
        }
    };

    const filteredJobs = (Array.isArray(jobsData) ? jobsData : []).filter(job => {
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        // Map backend status to frontend filter
        const jobFilterStatus = job.status === 'active' ? 'open' : 'closed';
        const matchesFilter = filterStatus === 'all' || jobFilterStatus === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const tabs = [
        { id: 'overview', label: 'Dashboard Overview', icon: Activity },
        { id: 'jobs', label: 'My Jobs', icon: Briefcase },
        { id: 'company', label: 'Company Profile', icon: Building2 }
    ];

    const quickActions = [
        {
            title: 'Post New Job',
            description: 'Create and publish a new job posting',
            action: () => navigate('/recruiter/post-job'),
            icon: Plus,
            color: 'bg-primary text-primary-foreground'
        },
        {
            title: 'View Applications',
            description: 'Review and manage job applications',
            action: () => navigate('/recruiter/applications'),
            icon: Users,
            color: 'bg-green-500 text-white'
        },
        {
            title: 'Find Candidates',
            description: 'Search candidates by skills and profile',
            action: () => navigate('/recruiter/find-candidates'),
            icon: Search,
            color: 'bg-amber-500 text-white'
        },
        {
            title: 'My Profile',
            description: 'Manage your recruiter profile',
            action: () => navigate('/recruiter/profile'),
            icon: Eye,
            color: 'bg-slate-600 text-white'
        },
        {
            title: 'Company Profile',
            description: 'Update your company information',
            action: () => navigate('/recruiter/company-profile'),
            icon: Building2,
            color: 'bg-blue-500 text-white'
        }
    ];

    const statCards = [
        {
            title: 'Total Jobs Posted',
            value: stats.totalJobs,
            change: `${stats.activeJobs} active`,
            icon: Briefcase,
            color: 'text-blue-600'
        },
        {
            title: 'Total Applications',
            value: stats.totalApplications,
            change: `${stats.pendingApplications} pending review`,
            icon: Users,
            color: 'text-purple-600'
        },
        {
            title: 'Applications Accepted',
            value: stats.acceptedApplications,
            change: 'Successful candidates',
            icon: Award,
            color: 'text-green-600'
        },
        {
            title: 'Applications Rejected',
            value: stats.rejectedApplications,
            change: 'Filtered out',
            icon: XCircle,
            color: 'text-red-600'
        },
        {
            title: 'Response Rate',
            value: stats.totalApplications > 0 ? `${Math.round((stats.newApplications / stats.totalApplications) * 100)}%` : '0%',
            change: 'Last 30 days',
            icon: TrendingUp,
            color: 'text-rose-600'
        }
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
                <div className="container mx-auto my-4 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
                            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => navigate('/recruiter/post-job')}
                                className="h-10"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Post Job
                            </Button>
                            <Button variant="outline" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="container mx-auto px-6 py-4">
                <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all
                                ${activeTab === tab.id
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }
                            `}
                        >
                            <tab.icon className="h-4 w-4 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 pb-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {statCards.map((stat, index) => (
                                    <motion.div
                                        key={stat.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <Card className="relative overflow-hidden">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-muted-foreground">
                                                            {stat.title}
                                                        </p>
                                                        <p className="text-2xl font-bold">{stat.value}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {stat.change}
                                                        </p>
                                                    </div>
                                                    <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                                                        <stat.icon className="h-6 w-6" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>
                                        Get started with common recruiter tasks
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {quickActions.map((action) => (
                                            <motion.div
                                                key={action.title}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Card
                                                    className="cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all"
                                                    onClick={action.action}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className={`p-2 rounded-lg ${action.color}`}>
                                                                <action.icon className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-sm">
                                                                    {action.title}
                                                                </h3>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {action.description}
                                                                </p>
                                                            </div>
                                                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Job Postings</CardTitle>
                                    <CardDescription>
                                        Your latest job postings and their performance
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loadingJobs ? (
                                        <BarLoader className="w-full" color="#36d7b7" />
                                    ) : (
                                        <div className="space-y-4">
                                            {(Array.isArray(jobsData) ? jobsData : []).slice(0, 5).map((job) => (
                                                <div
                                                    key={job._id}
                                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg">
                                                            <Briefcase className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">{job.title}</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {job.applicationCount || 0} applications •{' '}
                                                                {new Date(job.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant={job.status === 'active' ? 'default' : 'secondary'}
                                                        >
                                                            {job.status === 'active' ? 'Active' : 'Paused'}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => navigate(`/recruiter/applications/${job._id}`)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!Array.isArray(jobsData) || jobsData.length === 0) && (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                    <p>No jobs posted yet</p>
                                                    <Button
                                                        onClick={() => navigate('/recruiter/post-job')}
                                                        className="mt-2"
                                                        size="sm"
                                                    >
                                                        Post Your First Job
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === 'jobs' && (
                        <motion.div
                            key="jobs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Jobs Header with Search and Filter */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">My Job Postings</h2>
                                    <p className="text-muted-foreground">
                                        Manage all your job postings in one place
                                    </p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:w-64">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search jobs..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-32">
                                            <Filter className="h-4 w-4 mr-2" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Jobs</SelectItem>
                                            <SelectItem value="open">Active</SelectItem>
                                            <SelectItem value="closed">Paused</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Jobs List */}
                            {loadingJobs ? (
                                <Card>
                                    <CardContent className="p-6">
                                        <BarLoader className="w-full" color="#36d7b7" />
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {filteredJobs.map((job, index) => (
                                        <motion.div
                                            key={job._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <Card className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="text-lg font-semibold">
                                                                    {job.title}
                                                                </h3>
                                                                <Badge
                                                                    variant={
                                                                        job.status === 'active'
                                                                            ? 'default'
                                                                            : 'secondary'
                                                                    }
                                                                >
                                                                    {job.status === 'active' ? (
                                                                        <>
                                                                            <Play className="h-3 w-3 mr-1" />
                                                                            Active
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Pause className="h-3 w-3 mr-1" />
                                                                            Paused
                                                                        </>
                                                                    )}
                                                                </Badge>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                                                                <div className="flex items-center gap-1">
                                                                    <Building2 className="h-4 w-4" />
                                                                    {job.company?.name || 'Company Name'}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="h-4 w-4" />
                                                                    {job.location || 'Location not specified'}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="h-4 w-4" />
                                                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Users className="h-4 w-4" />
                                                                    {job.applicationCount || 0} applications
                                                                </div>
                                                            </div>

                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {job.description?.replace(/[#*`_[\]]/g, '').substring(0, 200) || 'No description available'}
                                                            </p>
                                                        </div>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        navigate(`/recruiter/applications/${job._id}`)
                                                                    }
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View Applications
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleToggleStatus(job._id, job.status)}
                                                                >
                                                                    {job.status === 'active' ? (
                                                                        <>
                                                                            <Pause className="h-4 w-4 mr-2" />
                                                                            Pause Job
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Play className="h-4 w-4 mr-2" />
                                                                            Activate Job
                                                                        </>
                                                                    )}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <DropdownMenuItem
                                                                            onSelect={(e) => e.preventDefault()}
                                                                            className="text-destructive"
                                                                        >
                                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                                            Delete Job
                                                                        </DropdownMenuItem>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>
                                                                                Delete Job Posting?
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This action cannot be undone. This will permanently delete the job posting "{job.title}" and all associated applications.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleDeleteJob(job._id)}
                                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                            >
                                                                                Delete Job
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}

                                    {filteredJobs.length === 0 && (
                                        <Card>
                                            <CardContent className="p-8 text-center">
                                                <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                                                <h3 className="text-lg font-semibold mb-2">
                                                    {searchTerm || filterStatus !== 'all'
                                                        ? 'No jobs match your search'
                                                        : 'No jobs posted yet'}
                                                </h3>
                                                <p className="text-muted-foreground mb-4">
                                                    {searchTerm || filterStatus !== 'all'
                                                        ? 'Try adjusting your search criteria'
                                                        : 'Start by creating your first job posting'}
                                                </p>
                                                <Button onClick={() => navigate('/recruiter/post-job')}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Post a Job
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'company' && (
                        <motion.div
                            key="company"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">Company Profile</h2>
                                    <p className="text-muted-foreground">
                                        Manage your company information and branding
                                    </p>
                                </div>
                                <Button onClick={() => navigate('/recruiter/company-profile')}>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>

                            {loadingCompany ? (
                                <Card>
                                    <CardContent className="p-6">
                                        <BarLoader className="w-full" color="#36d7b7" />
                                    </CardContent>
                                </Card>
                            ) : company ? (
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="space-y-6">
                                            <div className="flex items-start gap-6">
                                                {company.logo ? (
                                                    <img
                                                        src={company.logo}
                                                        alt={company.name}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                                        <Building2 className="h-8 w-8 text-primary" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold mb-1">{company.name}</h3>
                                                    {company.industry && (
                                                        <Badge variant="secondary" className="mb-2">
                                                            {company.industry}
                                                        </Badge>
                                                    )}
                                                    <p className="text-muted-foreground">{company.description}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {company.website && (
                                                    <div>
                                                        <h4 className="font-medium mb-1">Website</h4>
                                                        <p className="text-muted-foreground">{company.website}</p>
                                                    </div>
                                                )}
                                                {company.contactEmail && (
                                                    <div>
                                                        <h4 className="font-medium mb-1">Contact Email</h4>
                                                        <p className="text-muted-foreground">{company.contactEmail}</p>
                                                    </div>
                                                )}
                                                {company.contactPhone && (
                                                    <div>
                                                        <h4 className="font-medium mb-1">Phone</h4>
                                                        <p className="text-muted-foreground">{company.contactPhone}</p>
                                                    </div>
                                                )}
                                                {company.size && (
                                                    <div>
                                                        <h4 className="font-medium mb-1">Company Size</h4>
                                                        <p className="text-muted-foreground">{company.size}</p>
                                                    </div>
                                                )}
                                                {company.address && (
                                                    <div className="md:col-span-2">
                                                        <h4 className="font-medium mb-1">Address</h4>
                                                        <p className="text-muted-foreground">{company.address}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                                        <h3 className="text-lg font-semibold mb-2">No Company Profile</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Create a company profile to attract top talent and showcase your organization
                                        </p>
                                        <Button onClick={() => navigate('/recruiter/company-profile')}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Company Profile
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UnifiedRecruiterDashboard;