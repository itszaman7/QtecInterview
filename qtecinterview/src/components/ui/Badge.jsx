import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800 border border-gray-200',
        primary: 'bg-primary/10 text-primary border border-primary/20',
        success: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-600 border border-amber-200',
        danger: 'bg-red-50 text-red-600 border border-red-200',
        outline: 'border border-primary text-primary bg-transparent',
        'full-time': 'border border-primary text-primary bg-transparent',
        marketing: 'border border-amber-400 text-amber-600 bg-amber-50',
        design: 'border border-emerald-400 text-emerald-600 bg-emerald-50',
        business: 'border border-red-400 text-red-600 bg-red-50',
        technology: 'border border-indigo-400 text-indigo-600 bg-indigo-50',
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
