import React, { useRef, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { BarLoader } from "react-spinners";

const ProtectedRoute = ({ allowedRoles }) => {
    const toastShownRef = useRef(false);
    const { user, loading, isLoggingOut } = useAuth();

    // Reset toast flag when user changes (login/logout)
    useEffect(() => {
        toastShownRef.current = false;
    }, [user]);

    console.log("ProtectedRoute - User:", user);
    console.log("ProtectedRoute - Loading:", loading);
    console.log("ProtectedRoute - Is Logging Out:", isLoggingOut);
    console.log("ProtectedRoute - Allowed Roles:", allowedRoles);
    console.log("ProtectedRoute - Current Path:", window.location.pathname);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <BarLoader color="#36d7b7" />
            </div>
        ); // Or a spinner
    }

    if (!user) {
        // Don't show error message if user is in the process of logging out or still loading
        if (!isLoggingOut && !loading && !toastShownRef.current) {
            toast.error("You must be logged in to access this page.");
            toastShownRef.current = true;
        }
        console.log("ProtectedRoute - User not logged in, redirecting.");
        return <Navigate to="/" replace />;
    }

    // If user doesn't have a role, redirect to onboarding
    if (!user.role) {
        console.log("ProtectedRoute - User has no role, redirecting to onboarding.");
        return <Navigate to="/onboarding" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.log(`ProtectedRoute - Access Denied for role ${user.role}.`);
        console.log(`ProtectedRoute - Attempted path: ${window.location.pathname}`);
        toast.error("Access Denied: You do not have permission to view this page.");

        // Redirect based on user role
        const redirectPath = user.role === 'recruiter' ? '/recruiter' : '/';
        return <Navigate to={redirectPath} replace />;
    }

    console.log("ProtectedRoute - Access Granted.");
    return <Outlet />;
};

export default ProtectedRoute;
