import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthDialog from '../components/AuthDialog';
import VerifyOtpDialog from '../components/VerifyOtpDialog';
import { useAuth } from '../hooks/useAuth';
import { Toaster } from 'sonner';

const MainLayout = () => {
    const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false); // New state for job details dialog
    const { otpDialogOpen, pendingUser, setOtpDialogOpen } = useAuth();

    return (
        <>
            <Toaster position="top-right" richColors />
            <div
                className={`min-h-screen bg-background text-foreground transition-all duration-300 flex flex-col ${isAuthDialogOpen || otpDialogOpen || isDetailsDialogOpen ? "blur-sm" : ""}`}
            >
                <Navbar onCandidateLoginClick={() => setAuthDialogOpen(true)} />
                <main className="flex-grow pt-16 px-4 sm:px-6 lg:px-8">
                    <Outlet context={{ setIsDetailsDialogOpen }} /> {/* Pass setter via context */}
                </main>
            </div>
            <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
            <VerifyOtpDialog />
            {/* Show a button to reopen OTP dialog if pendingUser exists and dialog is closed */}
            {pendingUser && !otpDialogOpen && (
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        className="bg-primary text-white px-4 py-2 rounded shadow-lg hover:bg-primary/90 transition"
                        onClick={() => setOtpDialogOpen(true)}
                    >
                        Verify Email
                    </button>
                </div>
            )}
        </>
    );
};

export default MainLayout;
