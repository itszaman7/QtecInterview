import React from 'react';
import Link from 'next/link';
import Badge from '../ui/Badge';

const JobCard = ({
    id,
    companyLogo,
    companyName,
    title,
    location,
    type = 'Full Time',
    description,
    tags = [],
    isApplied = false
}) => {
    // Map tag names to badge variants
    const tagVariantMap = {
        'Marketing': 'warning',
        'Design': 'success',
        'Business': 'danger',
        'Technology': 'technology',
    };

    return (
        <Link href={`/jobs/${id}`} className="block bg-white border border-gray-200 p-6 rounded-sm hover:shadow-md transition-shadow group no-underline">
            {/* Top row: logo + type badge */}
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg border border-gray-100 bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {companyLogo ? (
                        <img src={companyLogo} alt={`${companyName} logo`} className="w-full h-full object-contain" />
                    ) : (
                        <div className="w-full h-full bg-gray-100 text-gray-600 font-bold text-lg flex items-center justify-center">
                            {companyName.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline">{type}</Badge>
                    {isApplied && (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Applied ✓
                        </span>
                    )}
                </div>
            </div>

            {/* Job title */}
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                {title}
            </h3>

            {/* Company & Location */}
            <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                <span>{companyName}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 inline-block"></span>
                <span>{location}</span>
            </p>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                    <Badge key={i} variant={tagVariantMap[tag] || 'default'}>
                        {tag}
                    </Badge>
                ))}
            </div>
        </Link>
    );
};

export default JobCard;
