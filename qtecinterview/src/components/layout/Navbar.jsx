"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { userAuthAPI, companyAuthAPI } from '../../lib/api';
import Swal from 'sweetalert2';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [authState, setAuthState] = useState({ loading: true, user: null, type: null });

    const checkAuth = async () => {
        try {
            // Try fetching applicant first
            const userRes = await userAuthAPI.getMe();
            setAuthState({ loading: false, user: userRes.data, type: 'applicant' });
        } catch (err) {
            try {
                // Then try company
                const companyRes = await companyAuthAPI.getMe();
                setAuthState({ loading: false, user: companyRes.data, type: 'company' });
            } catch (err2) {
                setAuthState({ loading: false, user: null, type: null });
            }
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4640DE',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, logout'
        });

        if (result.isConfirmed) {
            try {
                if (authState.type === 'company') {
                    await companyAuthAPI.logout();
                } else {
                    await userAuthAPI.logout();
                }

                // Clear cookies manually just in case
                document.cookie = 'user_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'company_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                window.location.href = '/';
            } catch (err) {
                window.location.href = '/';
            }
        }
    };

    const dashboardLink = authState.type === 'company' ? '/company' : '/dashboard';

    return (
        <header className="w-full bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex justify-between items-center h-20">

                    {/* Logo & Main Nav */}
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
                                </svg>
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-[#25324B]" style={{ fontFamily: "'Clash Display', sans-serif" }}>QuickHire</span>
                        </Link>

                        <nav className="hidden md:flex gap-8">
                            <Link href="/jobs" className="text-gray-600 hover:text-primary font-semibold transition-colors">
                                Find Jobs
                            </Link>
                            <Link href="/jobs" className="text-gray-600 hover:text-primary font-semibold transition-colors">
                                Browse Companies
                            </Link>
                        </nav>
                    </div>

                    {/* Right actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {authState.loading ? (
                            <div className="w-24 h-10 bg-gray-50 animate-pulse rounded-xl"></div>
                        ) : authState.user ? (
                            <div className="flex items-center gap-3">
                                <Button href={dashboardLink} variant="primary" className="px-6 rounded-xl font-bold">My Dashboard</Button>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Logout"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <>
                                <Button href="/login" variant="ghost" className="text-primary font-bold text-base hover:bg-primary/5 rounded-xl">Login</Button>
                                <Button href="/register" variant="primary" className="px-7 rounded-xl font-bold shadow-lg shadow-primary/25">Sign Up</Button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 p-4 shadow-lg absolute w-full left-0">
                    <div className="flex flex-col gap-4">
                        <Link href="/jobs" className="text-gray-600 hover:text-primary font-medium">Find Jobs</Link>
                        <Link href="/jobs" className="text-gray-600 hover:text-primary font-medium">Browse Companies</Link>
                        <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                            {authState.user ? (
                                <Button href={dashboardLink} variant="primary" className="w-full">My Dashboard</Button>
                            ) : (
                                <>
                                    <Button href="/login" variant="ghost" className="w-full">Login</Button>
                                    <Button href="/register" variant="primary" className="w-full">Sign Up</Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
