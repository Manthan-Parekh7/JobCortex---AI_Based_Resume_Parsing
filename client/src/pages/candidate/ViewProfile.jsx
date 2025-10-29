import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { getMe } from "../../api/api";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import EditProfileDialog from "../../components/EditProfileDialog"; // Import the new dialog component
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"; // Assuming these are needed for display
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog"; // Import Dialog components

const ViewProfile = () => {
    const { user: globalUser, setUser: setGlobalUser } = useAuth(); // Get global user and setter
    const [user, setUser] = useState(null); // Local state for displayed profile
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for dialog visibility
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false); // State for image preview dialog visibility

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                setUser(res.user);
            } catch (error) {
                console.error("Failed to fetch user data", error);
                toast.error("Failed to load profile data.");
            }
        };
        fetchUser();
    }, []);

    // Update local user state if global user changes (e.g., after dialog save)
    useEffect(() => {
        if (globalUser) {
            setUser(globalUser);
        }
    }, [globalUser]);


    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 container mx-auto px-4 md:px-8 lg:px-16">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    My Profile
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Manage your professional profile and showcase your experience
                </p>
            </div>

            <div className="flex justify-center mb-8">
                <Button
                    onClick={() => setIsEditDialogOpen(true)}
                    size="lg"
                    className="px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                    Edit Profile
                </Button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                        <CardContent className="flex flex-col items-center text-center p-8">
                            <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
                                <DialogTrigger asChild>
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full object-cover mb-6 cursor-pointer hover:shadow-xl transition-shadow border-4 border-primary/20"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-muted text-foreground flex items-center justify-center text-5xl font-bold mb-6 cursor-pointer hover:shadow-xl transition-shadow border-4 border-border">
                                            {user.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </DialogTrigger>
                                <DialogContent className="max-w-md border-border bg-card rounded-2xl">
                                    <img src={user.image} alt="Profile Preview" className="w-full h-full rounded-xl object-cover" />
                                </DialogContent>
                            </Dialog>
                            <h2 className="text-3xl font-bold text-foreground mb-2">{user.username}</h2>
                            <p className="text-muted-foreground text-lg">{user.email}</p>
                            {user.phone && (
                                <p className="text-muted-foreground text-sm mt-1">{user.phone}</p>
                            )}
                            {user.location && (
                                <p className="text-muted-foreground text-sm">{user.location}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl text-foreground">About Me</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {user.about || "No 'About Me' section provided. Click 'Edit Profile' to add information about yourself."}
                            </p>
                        </CardContent>
                    </Card>

                    {user.skills && user.skills.length > 0 && (
                        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-foreground">Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-3">
                                    {user.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {user.experience && user.experience.length > 0 && (
                        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-foreground">Experience</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {user.experience.map((exp, index) => (
                                    <div key={index} className="border-b border-border/50 pb-6 last:border-b-0 last:pb-0">
                                        <h3 className="font-bold text-xl text-foreground mb-2">{exp.position}</h3>
                                        <p className="font-semibold text-lg text-primary mb-1">{exp.company}</p>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                                        </p>
                                        <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {user.education && user.education.length > 0 && (
                        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-foreground">Education</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {user.education.map((edu, index) => (
                                    <div key={index} className="border-b border-border/50 pb-6 last:border-b-0 last:pb-0">
                                        <h3 className="font-bold text-xl text-foreground mb-2">{edu.degree} in {edu.field}</h3>
                                        <p className="font-semibold text-lg text-primary mb-1">{edu.institution}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {user.projects && user.projects.length > 0 && (
                        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-foreground">Projects</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {user.projects.map((proj, index) => (
                                    <div key={index} className="border-b border-border/50 pb-6 last:border-b-0 last:pb-0">
                                        <h3 className="font-bold text-xl text-foreground mb-3">{proj.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{proj.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {user.certifications && user.certifications.length > 0 && (
                        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-foreground">Certifications</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {user.certifications.map((cert, index) => (
                                    <div key={index} className="border-b border-border/50 pb-6 last:border-b-0 last:pb-0">
                                        <h3 className="font-bold text-xl text-foreground mb-1">{cert.name}</h3>
                                        <p className="text-primary font-semibold">{cert.issuer}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <EditProfileDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                currentUser={user}
                onSave={(updatedUser) => {
                    setUser(updatedUser); // Update local state
                    setGlobalUser(updatedUser); // Update global state
                }}
            />
        </div>
    );
};

export default ViewProfile;