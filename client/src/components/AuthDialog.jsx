// src/components/AuthDialog.jsx
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
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AuthDialog = ({ open, onOpenChange }) => {
    const { login, signup, loginWithGoogle, loginWithGithub, setOtpDialogOpen, setPendingUser } =
        useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(isLogin ? loginSchema : signupSchema),
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
            });
            if (success) {
                toast.success("Login successful!");
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
                // Role will be selected during onboarding
            });

            if (success) {
                toast.success("Signup successful! Please verify your email.");
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
                        {isLogin ? "Login" : "Create an account"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {isLogin
                            ? "Login to your account"
                            : "Enter your details below to create your account"}
                    </DialogDescription>
                </DialogHeader>


                {/* Social buttons */}
                <div className="flex gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={loginWithGoogle}
                        disabled={loading}
                        className="flex-1 bg-secondary border-border hover:bg-secondary/80 rounded-xl flex items-center gap-2 justify-center"
                    >
                        <FcGoogle className="text-lg" />
                        Google
                    </Button>
                    <Button
                        variant="outline"
                        onClick={loginWithGithub}
                        disabled={loading}
                        className="flex-1 bg-secondary border-border hover:bg-secondary/80 rounded-xl flex items-center gap-2 justify-center" S
                    >
                        <FaGithub className="text-lg" />
                        GitHub
                    </Button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2 my-6">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-muted-foreground text-xs">OR CONTINUE WITH</span>
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

export default AuthDialog;
