import React from 'react';
import Button from '../ui/Button';

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

const ChevronDown = (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const SearchBar = () => {
    return (
        <div className="bg-white p-2 shadow-xl shadow-gray-200/60 rounded-lg flex flex-col md:flex-row items-stretch w-full border border-gray-100">
            {/* Job title input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                    type="text"
                    placeholder="Job title or keyword"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-200 my-2"></div>

            {/* Location input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <LocationIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                    type="text"
                    defaultValue="Florence, Italy"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>

            {/* Search button */}
            <Button variant="primary" className="h-12 px-6 rounded-md text-sm whitespace-nowrap mt-2 md:mt-0">
                Search my job
            </Button>
        </div>
    );
};

export default SearchBar;
