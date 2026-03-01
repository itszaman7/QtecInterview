"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { jobsAPI } from '../../lib/api';

const SearchIcon = (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const LocationIcon = (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

const SearchBar = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Debounced search for suggestions
    useEffect(() => {
        if (!title.trim() || title.length < 2) {
            setSuggestions([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                const res = await jobsAPI.list({ title });
                if (res.success && res.data) {
                    setSuggestions(res.data.slice(0, 5));
                }
            } catch (err) {
                console.error('Failed to fetch suggestions', err);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [title]);

    // Close suggestions on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = new URLSearchParams();
        if (title) query.append('title', title);
        if (location) query.append('location', location);
        router.push(`/jobs?${query.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} ref={wrapperRef} className="bg-white p-2 shadow-xl shadow-gray-200/60 rounded-lg flex flex-col md:flex-row items-stretch w-full border border-gray-100 relative">
            {/* Job title input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 relative">
                <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Job title or keyword"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    autoComplete="off"
                />

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-4 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden z-50">
                        {suggestions.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => router.push(`/jobs/${job.id}`)}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex flex-col gap-1 text-left"
                            >
                                <span className="text-sm font-semibold text-gray-900">{job.title}</span>
                                <span className="text-xs text-gray-500">{job.companyProfile?.name || 'Unknown'} • {job.location}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-200 my-2"></div>

            {/* Location input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <LocationIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Florence, Italy"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
            </div>

            {/* Search button */}
            <Button
                type="submit"
                variant="primary"
                className="h-12 px-6 rounded-md text-sm whitespace-nowrap mt-2 md:mt-0"
            >
                Search my job
            </Button>
        </form>
    );
};

export default SearchBar;
