// src/components/RecruiterAuthDialog.jsx
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const recruiterLoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const recruiterSignupSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    companyName: z.string().min(1, { message: "Company name is required" }),
});

const RecruiterAuthDialog = ({ open, onOpenChange }) => {
    const { login, signup, setOtpDialogOpen, setPendingUser } =
        useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(isLogin ? recruiterLoginSchema : recruiterSignupSchema),
    });

    useEffect(() => {
        if (!open) {
            reset(); // Reset form when dialog closes
        }
        // Reset resolver when isLogin changes
        reset();
    }, [open, isLogin, reset]);

    const onSubmit = async (data) => {
        setLoading(true);

        if (isLogin) {
            const { success, error } = await login({
                email: data.email,
                password: data.password,
                role: "recruiter", // Specify role for login
            });
            if (success) {
                toast.success("Recruiter Login successful!");
                onOpenChange(false);
            } else {
                toast.error(error);
            }
        } else {
            // ---- Signup flow ----
            const { success, error } = await signup({
                username: data.username,
                email: data.email,
                password: data.password,
                companyName: data.companyName,
                role: "recruiter",
            });

            if (success) {
                toast.success("Recruiter Signup successful! Please verify your email.");
                // keep pending user so VerifyOtpDialog knows email
                setPendingUser({ email: data.email });
                // open OTP dialog
                setOtpDialogOpen(true);
                // close auth dialog
                onOpenChange(false);
            } else {
                toast.error(error);
            }
        }

        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-background text-foreground border-border rounded-2xl shadow-2xl max-w-sm w-full p-6">
                <DialogHeader className="space-y-1 text-center">
                    <DialogTitle className="text-2xl font-bold">
                        {isLogin ? "Recruiter Login" : "Create Recruiter Account"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {isLogin
                            ? "Login to your recruiter account"
                            : "Enter your details below to create your recruiter account"}
                    </DialogDescription>
                </DialogHeader>

                {/* Divider */}
                <div className="flex items-center gap-2 my-6">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-muted-foreground text-xs">CONTINUE WITH EMAIL</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                {/* Email/Password form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    {!isLogin && (
                        <>
                            <Input
                                type="text"
                                placeholder="Username"
                                disabled={loading}
                                {...register("username")}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm">{errors.username.message}</p>
                            )}
                            <Input
                                type="text"
                                placeholder="Company Name"
                                disabled={loading}
                                {...register("companyName")}
                            />
                            {errors.companyName && (
                                <p className="text-red-500 text-sm">{errors.companyName.message}</p>
                            )}
                        </>
                    )}
                    <Input
                        type="email"
                        placeholder="Email"
                        disabled={loading}
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                    <Input
                        type="password"
                        placeholder="Password"
                        disabled={loading}
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}

                    {/* Submit button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-xl py-2 mt-3"
                    >
                        {isLogin ? "Login" : "Create account"}
                    </Button>
                </form>

                <DialogFooter className="mt-4">
                    <p
                        className="cursor-pointer text-sm text-muted-foreground hover:text-foreground text-center w-full"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin
                            ? "Don't have an account? Sign Up"
                            : "Already have an account? Login"}
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RecruiterAuthDialog;