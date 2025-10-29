import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BarLoader } from "react-spinners";
import { Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import RecruiterNavigation from '../components/RecruiterNavigation';

const RecruiterLayout = () => {
    const { user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <BarLoader color="#36d7b7" />
            </div>
        );
    }

    // Redirect if not a recruiter or not logged in
    if (!user || user.role !== 'recruiter') {
        return <div className="text-center py-8">Access Denied. Please login as a recruiter.</div>;
    }

    return (
        <div className="flex h-screen">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
                </div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 transform bg-background border-r border-border lg:relative lg:translate-x-0 lg:bg-transparent
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                transition-transform duration-200 ease-in-out
            `}>
                <RecruiterNavigation />
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                    <h1 className="text-lg font-semibold">Recruiter Panel</h1>
                    <div></div>
                </div>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet /> {/* This is where nested routes will render */}
                </main>
            </div>
        </div>
    );
};

export default RecruiterLayout;
