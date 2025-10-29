import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { getMe } from "../../api/api";
import { getRecruiterProfile } from "../../api/recruiterApi";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import EditProfileDialog from "../../components/EditProfileDialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";
import { User, Mail, Phone, MapPin, FileText } from "lucide-react"; const RecruiterProfile = () => {
    const { user: globalUser, setUser: setGlobalUser } = useAuth();
    const [user, setUser] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Try the specific recruiter profile endpoint first
                let res;
                try {
                    res = await getRecruiterProfile();
                    console.log("Recruiter profile API response:", res);
                    setUser(res.user);
                } catch (recruiterError) {
                    console.warn("Recruiter profile API failed, falling back to general getMe:", recruiterError);
                    // Fallback to general getMe if recruiter endpoint fails
                    res = await getMe();
                    setUser(res.user);
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
                toast.error("Failed to load profile data. Please check your permissions.");
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
                    Recruiter Profile
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Manage your recruiter profile and contact information
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

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Picture and Basic Info */}
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
                            <p className="text-primary font-semibold text-lg mb-4">Recruiter</p>

                            {/* Contact Information */}
                            <div className="space-y-3 w-full">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm">{user.phone}</span>
                                    </div>
                                )}
                                {user.location && (
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-sm">{user.location}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* About Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                                <FileText className="h-6 w-6" />
                                About Me
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {user.about || "No 'About Me' section provided. Click 'Edit Profile' to add information about yourself and your recruiting experience."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Company Information */}
                    {user.companyName && (
                        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                                    <User className="h-6 w-6" />
                                    Company Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-semibold text-primary">{user.companyName}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Profile Completion Status */}
                    <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl text-foreground">Profile Completion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Basic Information</span>
                                    <span className="text-sm font-semibold text-green-600">✓ Complete</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Profile Picture</span>
                                    <span className={`text-sm font-semibold ${user.image ? 'text-green-600' : 'text-amber-600'}`}>
                                        {user.image ? '✓ Complete' : '⚠ Missing'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">About Section</span>
                                    <span className={`text-sm font-semibold ${user.about ? 'text-green-600' : 'text-amber-600'}`}>
                                        {user.about ? '✓ Complete' : '⚠ Missing'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Contact Information</span>
                                    <span className={`text-sm font-semibold ${user.phone && user.location ? 'text-green-600' : 'text-amber-600'}`}>
                                        {user.phone && user.location ? '✓ Complete' : '⚠ Incomplete'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <EditProfileDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                currentUser={user}
                onSave={(updatedUser) => {
                    setUser(updatedUser);
                    setGlobalUser(updatedUser);
                }}
            />
        </div>
    );
};

export default RecruiterProfile;