"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="w-full bg-white/95 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex justify-between items-center h-20">

                    {/* Logo & Main Nav */}
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-gray-900">QuickHire</span>
                        </Link>

                        <nav className="hidden md:flex gap-8">
                            <Link href="/jobs" className="text-gray-600 hover:text-primary font-medium transition-colors">
                                Find Jobs
                            </Link>
                            <Link href="/companies" className="text-gray-600 hover:text-primary font-medium transition-colors">
                                Browse Companies
                            </Link>
                        </nav>
                    </div>

                    {/* Right actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Button href="/company/login" variant="ghost" className="text-primary font-bold text-base">Login</Button>
                        <Button href="/company/register" variant="primary" className="px-6">Sign Up</Button>
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
                        <Link href="/companies" className="text-gray-600 hover:text-primary font-medium">Browse Companies</Link>
                        <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                            <Button href="/company/login" variant="ghost" className="w-full">Login</Button>
                            <Button href="/company/register" variant="primary" className="w-full">Sign Up</Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
