import React from 'react';
import Link from 'next/link';

const CategoryCard = ({
    icon: Icon,
    title,
    jobCount,
    isActive = false
}) => {
    return (
        <Link href={`/jobs?category=${encodeURIComponent(title)}`} className={`
            flex flex-col p-6 rounded-sm transition-all duration-300 border group no-underline
            ${isActive
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-white text-gray-900 border-gray-200 hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/20'
            }
        `}>
            <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors
                ${isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary group-hover:bg-white/20 group-hover:text-white'}
            `}>
                {Icon && <Icon className="w-6 h-6" />}
            </div>

            <h3 className={`text-lg font-bold mb-1 ${isActive ? 'text-white' : 'text-gray-900 group-hover:text-white'}`}>
                {title}
            </h3>

            <div className="flex items-center gap-2">
                <p className={`text-sm ${isActive ? 'text-blue-100' : 'text-gray-500 group-hover:text-blue-100'}`}>
                    {jobCount} jobs available
                </p>
                <svg className={`w-4 h-4 transition-all ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </Link>
    );
};

export default CategoryCard;
