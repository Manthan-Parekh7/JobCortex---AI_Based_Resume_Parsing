import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import api from "../api/api";
import { toast } from "sonner";
import MultiSelect from "./MultiSelect";
import { useAuth } from "../hooks/useAuth";
import { BarLoader } from "react-spinners";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { technicalSkills, managementSkills } from "../data/skills";
import DatePicker from "./DatePicker";


const groupedSkills = [
    {
        label: "Technical Skills",
        options: technicalSkills,
    },
    {
        label: "Management Skills",
        options: managementSkills,
    },
];

const EditProfileDialog = ({ open, onOpenChange, currentUser, onSave }) => {
    const { user: authUser, setUser: setGlobalUser } = useAuth();
    const [user, setUser] = useState(currentUser);
    const [username, setUsername] = useState(currentUser?.username || "");
    const [about, setAbout] = useState(currentUser?.about || "");
    const [skills, setSkills] = useState(currentUser?.skills?.map(skill => ({ label: skill.name, value: skill.name })) || []);
    const [experience, setExperience] = useState(currentUser?.experience || []);
    const [education, setEducation] = useState(currentUser?.education || []);
    const [projects, setProjects] = useState(currentUser?.projects || []);
    const [certifications, setCertifications] = useState(currentUser?.certifications || []);
    const [profileImage, setProfileImage] = useState(null);
    const [phone, setPhone] = useState(currentUser?.phone || "");
    const [location, setLocation] = useState(currentUser?.location || "");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setUser(currentUser);
            setUsername(currentUser.username || "");
            setAbout(currentUser.about || "");
            setSkills(currentUser.skills?.map(skill => ({ label: skill.name, value: skill.name })) || []);
            setExperience(currentUser.experience || []);
            setEducation(currentUser.education || []);
            setProjects(currentUser.projects || []);
            setCertifications(currentUser.certifications || []);
            setPhone(currentUser.phone || "");
            setLocation(currentUser.location || "");
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData();
        formData.append("username", username);
        formData.append("about", about);
        formData.append("skills", JSON.stringify(skills.map(skill => ({ name: skill.value }))));
        formData.append("phone", phone);
        formData.append("location", location);
        formData.append("experience", JSON.stringify(experience));
        formData.append("education", JSON.stringify(education));
        formData.append("projects", JSON.stringify(projects));
        formData.append("certifications", JSON.stringify(certifications));
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        try {
            const endpoint = isRecruiter ? "/recruiter/me/profile" : "/candidate/me/profile";
            const res = await api.put(endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(res.data.message);
            setGlobalUser(res.data.user);
            onSave(res.data.user); // Notify parent of save
            onOpenChange(false); // Close dialog
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return null; // Or a loading spinner if currentUser can be null initially
    }

    const isRecruiter = authUser?.role === 'recruiter';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl overflow-y-auto max-h-[90vh]">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
                </DialogHeader>
                <form id="edit-profile-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 py-4">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="name" className="mb-2">Full Name</Label>
                                <Input id="name" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="email" className="mb-2">Email</Label>
                                <Input id="email" type="email" value={user.email} disabled />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="phone" className="mb-2">Phone</Label>
                                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="location" className="mb-2">Location</Label>
                                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="bio" className="mb-2">About</Label>
                            <Textarea id="bio" value={about} onChange={(e) => setAbout(e.target.value)} />
                        </div>
                        {!isRecruiter && (
                            <>
                                <div>
                                    <Label className="mb-2">Skills</Label>
                                    <MultiSelect value={skills} onChange={setSkills} options={groupedSkills} placeholder="Add skills..." />
                                </div>
                                <ExperienceSection experience={experience} setExperience={setExperience} />
                                <EducationSection education={education} setEducation={setEducation} />
                                <ProjectsSection projects={projects} setProjects={setProjects} />
                                <CertificationsSection certifications={certifications} setCertifications={setCertifications} />
                            </>
                        )}
                        {/* Profile Picture and Resume side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Profile Picture</Label>
                                <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                                    {profileImage ? (
                                        <img src={URL.createObjectURL(profileImage)} alt="New Profile Preview" className="w-32 h-32 rounded-full mb-4 object-cover" />
                                    ) : user.image ? (
                                        <img src={user.image} alt="Current Profile" className="w-32 h-32 rounded-full mb-4 object-cover" />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold mb-4">
                                            {user.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    <Input type="file" onChange={(e) => setProfileImage(e.target.files[0])} className="mb-4" accept="image/*" />
                                    <p className="text-sm text-gray-500">Upload a new profile picture.</p>
                                </div>
                            </div>
                            {!isRecruiter && (
                                <div>
                                    <ResumeSection user={user} setGlobalUser={setGlobalUser} />
                                </div>
                            )}
                        </div>
                    </div>
                </form>
                <DialogFooter className="flex justify-center">
                    <Button type="submit" form="edit-profile-form" disabled={isSaving} className="px-8 py-2">
                        {isSaving ? <BarLoader color="#ffffff" /> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
const ResumeSection = ({ user, setGlobalUser }) => {
    const [resumeFile, setResumeFile] = useState(null);
    const [resumePreview, setResumePreview] = useState(user?.resume || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setResumeFile(file);
        setResumePreview(null); // Clear the preview when a new file is selected
    };

    const handleUploadResume = async () => {
        if (!resumeFile) {
            toast.error("Please select a resume file to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("resume", resumeFile);

        try {
            const res = await api.post("/candidate/me/resume", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(res.data.message);
            setGlobalUser({ ...user, resume: res.data.resume });
            setResumePreview(res.data.resume);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteResume = async () => {
        try {
            const res = await api.delete("/candidate/me/resume");
            toast.success(res.data.message);
            setGlobalUser({ ...user, resume: null });
            setResumePreview(null);
            setResumeFile(null);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div>
            <Label className="mb-2">Resume</Label>
            <div className="border rounded-lg p-6">
                <Input type="file" onChange={handleFileChange} className="mb-4" accept=".pdf,.docx" />
                {resumeFile && <p className="text-sm text-muted-foreground mb-4">New resume selected. Click "Upload Resume" to save it.</p>}
                {resumePreview && (
                    <div className="mb-4">
                        <iframe src={`https://docs.google.com/gview?url=${resumePreview}&embedded=true`} title="Resume Preview" className="w-full h-64 border" />
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <Button type="button" onClick={handleUploadResume} className="w-full">Upload Resume</Button>
                    {user.resume && <Button type="button" variant="destructive" onClick={handleDeleteResume} className="w-full">Delete Resume</Button>}
                </div>
            </div>
        </div>
    );
}



const ExperienceSection = ({ experience, setExperience }) => {
    const addExperience = () => setExperience([...experience, { company: "", position: "", startDate: null, endDate: null, description: "", isCurrentJob: false }]);
    const removeExperience = (index) => setExperience(experience.filter((_, i) => i !== index));
    const handleChange = (index, field, value) => {
        const newExperience = [...experience];
        newExperience[index][field] = value;
        setExperience(newExperience);
    };

    return (
        <div>
            <Label className="mb-2">Experience</Label>
            {experience.map((exp, index) => (
                <div key={index} className="border rounded-lg p-4 mt-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Company" value={exp.company} onChange={(e) => handleChange(index, "company", e.target.value)} />
                        <Input placeholder="Position" value={exp.position} onChange={(e) => handleChange(index, "position", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DatePicker
                            date={exp.startDate ? new Date(exp.startDate) : null}
                            setDate={(date) => handleChange(index, "startDate", date)}
                            placeholder="Start Date"
                        />
                        <DatePicker
                            date={exp.isCurrentJob ? null : (exp.endDate ? new Date(exp.endDate) : null)}
                            setDate={(date) => handleChange(index, "endDate", date)}
                            placeholder="End Date"
                            disabled={exp.isCurrentJob}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={`current-job-${index}`}
                            checked={exp.isCurrentJob || false}
                            onCheckedChange={(checked) => {
                                const newExperience = [...experience];
                                newExperience[index].isCurrentJob = checked;
                                if (checked) {
                                    newExperience[index].endDate = null;
                                }
                                setExperience(newExperience);
                            }}
                        />
                        <label
                            htmlFor={`current-job-${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            I currently work here
                        </label>
                    </div>
                    <Textarea placeholder="Description" value={exp.description} onChange={(e) => handleChange(index, "description", e.target.value)} />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeExperience(index)}>Remove</Button>
                </div>
            ))}
            <Button type="button" onClick={addExperience} className="mt-2">Add Experience</Button>
        </div>
    );
};

const EducationSection = ({ education, setEducation }) => {
    const addEducation = () => setEducation([...education, { institution: "", degree: "", field: "", startDate: null, endDate: null }]);
    const removeEducation = (index) => setEducation(education.filter((_, i) => i !== index));
    const handleChange = (index, field, value) => {
        const newEducation = [...education];
        newEducation[index][field] = value;
        setEducation(newEducation);
    };

    return (
        <div>
            <Label className="mb-2">Education</Label>
            {education.map((edu, index) => (
                <div key={index} className="border rounded-lg p-4 mt-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Institution" value={edu.institution} onChange={(e) => handleChange(index, "institution", e.target.value)} />
                        <Input placeholder="Degree" value={edu.degree} onChange={(e) => handleChange(index, "degree", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Field of Study" value={edu.field} onChange={(e) => handleChange(index, "field", e.target.value)} />
                        <DatePicker date={edu.startDate ? new Date(edu.startDate) : null} setDate={(date) => handleChange(index, "startDate", date)} placeholder="Start Date" />
                        <DatePicker date={edu.endDate ? new Date(edu.endDate) : null} setDate={(date) => handleChange(index, "endDate", date)} placeholder="End Date" />
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeEducation(index)}>Remove</Button>
                </div>
            ))}
            <Button type="button" onClick={addEducation} className="mt-2">Add Education</Button>
        </div>
    );
};

const ProjectsSection = ({ projects, setProjects }) => {
    const addProject = () => setProjects([...projects, { title: "", description: "" }]);
    const removeProject = (index) => setProjects(projects.filter((_, i) => i !== index));
    const handleChange = (index, field, value) => {
        const newProjects = [...projects];
        newProjects[index][field] = value;
        setProjects(newProjects);
    };

    return (
        <div>
            <Label className="mb-2">Projects</Label>
            {projects.map((proj, index) => (
                <div key={index} className="border rounded-lg p-4 mt-2 space-y-4">
                    <Input placeholder="Project Title" value={proj.title} onChange={(e) => handleChange(index, "title", e.target.value)} />
                    <Textarea placeholder="Project Description" value={proj.description} onChange={(e) => handleChange(index, "description", e.target.value)} />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeProject(index)}>Remove</Button>
                </div>
            ))}
            <Button type="button" onClick={addProject} className="mt-2">Add Project</Button>
        </div>
    );
};

const CertificationsSection = ({ certifications, setCertifications }) => {
    const addCertification = () => setCertifications([...certifications, { name: "", issuer: "" }]);
    const removeCertification = (index) => setCertifications(certifications.filter((_, i) => i !== index));
    const handleChange = (index, field, value) => {
        const newCertifications = [...certifications];
        newCertifications[index][field] = value;
        setCertifications(newCertifications);
    };

    return (
        <div>
            <Label className="mb-2">Certifications</Label>
            {certifications.map((cert, index) => (
                <div key={index} className="border rounded-lg p-4 mt-2 space-y-4">
                    <Input placeholder="Certification Name" value={cert.name} onChange={(e) => handleChange(index, "name", e.target.value)} />
                    <Input placeholder="Issuer" value={cert.issuer} onChange={(e) => handleChange(index, "issuer", e.target.value)} />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeCertification(index)}>Remove</Button>
                </div>
            ))}
            <Button type="button" onClick={addCertification} className="mt-2">Add Certification</Button>
        </div>
    );
};

export default EditProfileDialog;
