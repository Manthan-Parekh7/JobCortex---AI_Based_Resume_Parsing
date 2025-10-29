// src/components/VerifyOtpDialog.jsx
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "../components/ui/input-otp";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

const VerifyOtpDialog = () => {
    const { otpDialogOpen, setOtpDialogOpen, pendingUser, verifyOtp } = useAuth();
    const [otp, setOtp] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleVerify = async () => {
        if (!otp || otp.length < 6) {
            toast.error("Please enter the full 6-digit OTP.");
            return;
        }
        if (!pendingUser?.email) {
            toast.error("No user found for OTP verification.");
            return;
        }

        setSubmitting(true);
        const res = await verifyOtp({ email: pendingUser.email, otp });
        setSubmitting(false);

        if (res.success) {
            toast.success("Email verified successfully! You are now logged in.");
            setOtp(""); // clear OTP input
            setOtpDialogOpen(false);
        } else {
            toast.error(res.error);
        }
    };

    // Prevent closing by clicking outside
    const handleOpenChange = (open) => {
        if (open === false) {
            // Only allow closing if user verified (not by clicking outside)
            // Do nothing here to prevent closing by outside click
            return;
        }
        setOtpDialogOpen(open);
    };

    return (
        <Dialog open={otpDialogOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Verify Your Email</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center gap-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        Enter the 6-digit OTP sent to <b>{pendingUser?.email}</b>
                    </p>

                    {/* OTP Input */}
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    <Button
                        className="w-full"
                        onClick={handleVerify}
                        disabled={submitting}
                    >
                        {submitting ? "Verifying..." : "Verify OTP"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VerifyOtpDialog;
