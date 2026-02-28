import React from 'react';
import Link from 'next/link';
import Badge from '../ui/Badge';

const LatestJobCard = ({
    id,
    companyLogo,
    companyName,
    title,
    location,
    tags = []
}) => {
    const tagVariantMap = {
        'Full-Time': 'full-time',
        'Marketing': 'marketing',
        'Design': 'design',
        'Business': 'danger',
        'Technology': 'technology',
    };

    return (
        <Link href={`/jobs/${id}`} className="flex items-center gap-5 p-5 bg-white border border-gray-200 rounded-sm hover:shadow-md transition-shadow no-underline">
            {/* Company Logo */}
            <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden bg-white">
                {companyLogo ? (
                    <img src={companyLogo} alt={`${companyName} logo`} className="w-full h-full object-contain" />
                ) : (
                    <div className="w-full h-full bg-gray-100 text-gray-600 font-bold text-xl flex items-center justify-center rounded-lg">
                        {companyName.charAt(0)}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 mb-0.5">{title}</h3>
                <p className="text-sm text-gray-500 mb-2 flex items-center gap-1.5">
                    <span>{companyName}</span>
                    <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{location}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <Badge key={i} variant={tagVariantMap[tag] || 'default'}>
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default LatestJobCard;
