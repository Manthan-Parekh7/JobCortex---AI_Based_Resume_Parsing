import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Briefcase, User, ChevronRight, Building2, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/api";

const roles = [
    {
        id: "candidate",
        title: "Job Seeker",
        description: "Looking for your next career opportunity",
        icon: User,
        features: [
            "Browse thousands of job opportunities",
            "Apply to jobs with one click",
            "AI-powered job matching",
            "Track your applications",
            "Get AI-generated resume summaries"
        ],
        color: "blue",
        bgGradient: "from-blue-500/10 to-purple-500/10",
        borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
        id: "recruiter",
        title: "Recruiter",
        description: "Hiring top talent for your organization",
        icon: Briefcase,
        features: [
            "Post unlimited job openings",
            "Access to candidate database",
            "Application management dashboard",
            "Company profile creation",
            "Advanced filtering and analytics"
        ],
        color: "green",
        bgGradient: "from-green-500/10 to-emerald-500/10",
        borderColor: "border-green-200 dark:border-green-800"
    }
];

const Onboarding = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleRoleSelection = async (roleId) => {
        if (!user) {
            toast.error("No user session found. Please login again.");
            navigate("/");
            return;
        }

        setLoading(true);
        try {
            // Update user role via API
            const response = await api.patch("/auth/update-role", {
                role: roleId
            });

            const data = response.data;

            if (data.success) {
                // Update user in context
                setUser({ ...user, role: roleId });
                toast.success(`Welcome! You're now registered as a ${roleId === "candidate" ? "Job Seeker" : "Recruiter"}`);

                // Redirect based on role
                if (roleId === "candidate") {
                    navigate("/jobs");
                } else {
                    navigate("/recruiter");
                }
            } else {
                toast.error(data.message || "Failed to update role");
            }
        } catch (error) {
            console.error("Role selection error:", error);
            toast.error(error.response?.data?.message || "Failed to update role. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-6xl mx-auto"
            >
                {/* Header */}
                <motion.div
                    variants={cardVariants}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Welcome to JobCortex
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose your path to get started with the best job portal experience
                    </p>
                    {user && (
                        <Badge variant="outline" className="mt-4">
                            Logged in as {user.email}
                        </Badge>
                    )}
                </motion.div>

                {/* Role Selection Cards */}
                <motion.div
                    variants={cardVariants}
                    className="grid md:grid-cols-2 gap-8 mb-12"
                >
                    {roles.map((role) => {
                        const IconComponent = role.icon;
                        const isSelected = selectedRole === role.id;

                        return (
                            <Card
                                key={role.id}
                                className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl ${isSelected
                                        ? `ring-2 ring-primary shadow-lg ${role.borderColor}`
                                        : 'hover:shadow-md border-border'
                                    } bg-gradient-to-br ${role.bgGradient}`}
                                onClick={() => setSelectedRole(role.id)}
                            >
                                <CardHeader className="text-center pb-6">
                                    <div className="mx-auto mb-4 relative">
                                        <div className={`p-4 rounded-full bg-gradient-to-r ${role.id === 'candidate'
                                                ? 'from-blue-500 to-purple-500'
                                                : 'from-green-500 to-emerald-500'
                                            }`}>
                                            <IconComponent className="h-8 w-8 text-white" />
                                        </div>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </motion.div>
                                        )}
                                    </div>
                                    <CardTitle className="text-2xl mb-2">{role.title}</CardTitle>
                                    <CardDescription className="text-base">
                                        {role.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <ul className="space-y-3">
                                        {role.features.map((feature, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="flex items-center text-sm text-muted-foreground"
                                            >
                                                <div className={`w-2 h-2 rounded-full mr-3 ${role.id === 'candidate' ? 'bg-blue-500' : 'bg-green-500'
                                                    }`} />
                                                {feature}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        );
                    })}
                </motion.div>

                {/* Continue Button */}
                {selectedRole && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <Button
                            size="lg"
                            onClick={() => handleRoleSelection(selectedRole)}
                            disabled={loading}
                            className="px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Setting up your account...
                                </>
                            ) : (
                                <>
                                    Continue as {selectedRole === "candidate" ? "Job Seeker" : "Recruiter"}
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>

                        <p className="text-sm text-muted-foreground mt-4">
                            You can change your role anytime in your profile settings
                        </p>
                    </motion.div>
                )}

                {/* Stats Section */}
                <motion.div
                    variants={cardVariants}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
                >
                    <div className="p-6">
                        <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h3 className="text-2xl font-bold text-foreground">50K+</h3>
                        <p className="text-muted-foreground">Active Users</p>
                    </div>
                    <div className="p-6">
                        <Briefcase className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h3 className="text-2xl font-bold text-foreground">10K+</h3>
                        <p className="text-muted-foreground">Job Postings</p>
                    </div>
                    <div className="p-6">
                        <Building2 className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h3 className="text-2xl font-bold text-foreground">1K+</h3>
                        <p className="text-muted-foreground">Companies</p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Onboarding;
