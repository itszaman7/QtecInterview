import React from 'react';
import Link from 'next/link';

const Button = ({
    children,
    variant = 'primary',
    size = 'default',
    className = '',
    href,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer no-underline block';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark rounded-sm',
        secondary: 'bg-blue-50 text-primary hover:bg-blue-100 rounded-sm',
        outline: 'border-2 border-primary text-primary hover:bg-primary/5 rounded-sm',
        ghost: 'text-primary hover:text-primary-dark font-bold',
        link: 'text-primary hover:underline underline-offset-4'
    };

    const sizes = {
        sm: 'h-9 px-4 text-sm',
        default: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10'
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedClassName} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button
            className={combinedClassName}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
