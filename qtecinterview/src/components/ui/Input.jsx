import React, { forwardRef } from 'react';

const Input = forwardRef(({ className = '', icon: Icon, ...props }, ref) => {
    return (
        <div className="relative flex items-center w-full">
            {Icon && (
                <div className="absolute left-4 text-gray-400">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <input
                ref={ref}
                className={`flex h-12 w-full bg-white border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 ${Icon ? 'pl-11' : ''
                    } ${className}`}
                {...props}
            />
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
