import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { getMe } from "../../api/api";
import api from "../../api/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Input } from "../../components/ui/input";

const AISummary = () => {
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const [jobGoal, setJobGoal] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                setUser(res.user);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleGenerateSummary = async () => {
        setGenerating(true);
        try {
            const res = await api.post("/candidate/me/parse-resume-cloudinary", { jobGoal });
            setSummary(res.data.ai_output);
            toast.success("Summary generated successfully!");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <BarLoader color="#36d7b7" />
                <p className="mt-4 text-muted-foreground">Loading your profile...</p>
            </div>
        );
    }

    if (!user?.resume) {
        return (
            <div className="pt-20 container mx-auto px-4 md:px-8 lg:px-16">
                <div className="text-center py-16">
                    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-12 max-w-md mx-auto">
                        <h1 className="text-3xl font-bold text-foreground mb-6">AI-Powered Resume Summary</h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Please upload your resume to generate an AI summary.
                        </p>
                        <Button asChild size="lg" className="rounded-xl px-8 py-3">
                            <Link to="/edit-profile">Go to Edit Profile</Link>
                        </Button>
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
                    AI-Powered Resume Summary
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Get intelligent insights about your resume and discover how to optimize it for your target role
                </p>
            </div>

            {/* Control Section */}
            <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <Input
                            placeholder="Enter your desired job title..."
                            value={jobGoal}
                            onChange={(e) => setJobGoal(e.target.value)}
                            className="flex-1 h-12 rounded-xl border-border bg-background/50"
                        />
                        <Button
                            onClick={handleGenerateSummary}
                            disabled={generating || !jobGoal}
                            size="lg"
                            className="px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                        >
                            {generating ? (
                                <div className="flex items-center gap-2">
                                    <BarLoader color="#ffffff" height={3} width={30} />
                                    <span>Generating...</span>
                                </div>
                            ) : "Generate Summary"}
                        </Button>
                    </div>
                </div>
            </div>

            {summary ? (
                summary.raw ? (
                    <div className="text-center py-16">
                        <div className="bg-card/50 backdrop-blur-sm border border-red-300/40 rounded-2xl p-8 max-w-2xl mx-auto">
                            <p className="text-lg text-red-500 mb-4">Failed to parse AI output. Please try again.</p>
                            <p className="text-sm text-muted-foreground mb-4">Raw output:</p>
                            <pre className="p-4 bg-muted rounded-xl text-left whitespace-pre-wrap text-sm overflow-auto max-h-64">{summary.raw}</pre>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Overall Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">{summary.summary}</p>
                                </CardContent>
                            </Card>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-green-600">Strengths</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {summary.strengths && summary.strengths.map((s, i) =>
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                                    <span className="text-muted-foreground">{s}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </CardContent>
                                </Card>
                                <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-orange-600">Areas for Improvement</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {summary.weaknesses && summary.weaknesses.map((w, i) =>
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                                    <span className="text-muted-foreground">{w}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl text-blue-600">Improvement Suggestions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {summary.improvement_suggestions && summary.improvement_suggestions.map((s, i) =>
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">{i + 1}</span>
                                                <span className="text-muted-foreground">{s}</span>
                                            </li>
                                        )}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <Card className="text-center border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl">ATS Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative w-48 h-48 mx-auto">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                            <path
                                                className="text-muted/20"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                            />
                                            <path
                                                className="text-primary"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                strokeDasharray={`${summary.ats_score || 0}, 100`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <span className="text-4xl font-bold text-foreground">{summary.ats_score || 0}%</span>
                                                <p className="text-sm text-muted-foreground mt-1">ATS Compatible</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl">Profile Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-3">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {summary.skills && summary.skills.map((s, i) =>
                                                <Badge key={i} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                                                    {s}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-3">Recommended Roles</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {summary.recommended_roles && summary.recommended_roles.map((r, i) =>
                                                <Badge key={i} variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors">
                                                    {r}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-4 bg-muted/50 rounded-xl">
                                            <h4 className="font-semibold text-foreground mb-1">Experience</h4>
                                            <p className="text-muted-foreground">{summary.years_experience}</p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-xl">
                                            <h4 className="font-semibold text-foreground mb-1">Education</h4>
                                            <p className="text-muted-foreground">{summary.education}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )
            ) : (
                <div className="text-center py-16">
                    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-12 max-w-2xl mx-auto">
                        <p className="text-2xl text-muted-foreground mb-4">Ready to analyze your resume?</p>
                        <p className="text-muted-foreground">Enter your desired job title above and click "Generate Summary" to get AI-powered insights about your resume.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AISummary;