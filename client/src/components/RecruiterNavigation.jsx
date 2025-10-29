import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Building2,
    BarChart3,
    Settings,
    LogOut,
    Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

const RecruiterNavigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navigationItems = [
        {
            name: 'Dashboard',
            href: '/recruiter/dashboard',
            icon: LayoutDashboard,
            count: null
        },
        {
            name: 'My Jobs',
            href: '/recruiter/jobs',
            icon: Briefcase,
            count: null // We can add job count here later
        },
        {
            name: 'Applications',
            href: '/recruiter/applications',
            icon: Users,
            count: null // We can add application count here later
        },
        {
            name: 'Company Profile',
            href: '/recruiter/company-profile',
            icon: Building2,
            count: null
        },
        {
            name: 'Analytics',
            href: '/recruiter/analytics',
            icon: BarChart3,
            count: null
        },
        {
            name: 'Settings',
            href: '/recruiter/settings',
            icon: Settings,
            count: null
        }
    ];

    const handleLogout = () => {
        logout();
        // Remove the duplicate navigate('/') since logout() already handles navigation
    }; return (
        <div className="bg-background border-r border-border flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold">Recruiter Panel</h2>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>

                <Button
                    onClick={() => navigate('/recruiter/post-job')}
                    className="w-full mt-4"
                    size="sm"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navigationItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )
                                }
                            >
                                <div className="flex items-center">
                                    <item.icon className="h-4 w-4 mr-3" />
                                    {item.name}
                                </div>
                                {item.count && (
                                    <Badge variant="secondary" className="ml-auto">
                                        {item.count}
                                    </Badge>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default RecruiterNavigation;