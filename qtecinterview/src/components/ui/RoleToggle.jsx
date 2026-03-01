'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RoleToggle({ isRegister = false }) {
    const pathname = usePathname();
    const isCompany = pathname.includes('/company');

    const baseLoginPath = isRegister ? '/register' : '/login';
    const companyLoginPath = isRegister ? '/company/register' : '/company/register'; // Wait, let me check company register path
    // Actually, let's just use the logic based on current path

    const applicantPath = isRegister ? '/register' : '/login';
    const companyPath = isRegister ? '/company/register' : '/company/login';

    const containerStyle = {
        display: 'inline-flex',
        background: '#f1f5f9',
        padding: '4px',
        borderRadius: '30px',
        marginBottom: '32px',
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #e2e8f0'
    };

    const itemStyle = (active, activeColor) => ({
        flex: 1,
        textAlign: 'center',
        padding: '10px 0',
        borderRadius: '26px',
        fontSize: '14px',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        background: active ? activeColor : 'transparent',
        color: active ? '#ffffff' : '#64748b',
        boxShadow: active ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
    });

    return (
        <div style={containerStyle}>
            <Link
                href={applicantPath}
                style={itemStyle(!isCompany, '#56E0B1')}
            >
                Applicant
            </Link>
            <Link
                href={companyPath}
                style={itemStyle(isCompany, '#4640DE')}
            >
                Company
            </Link>
        </div>
    );
}
