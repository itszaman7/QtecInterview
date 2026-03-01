import React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children, isCompany = false }) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F8F9FA',
            fontFamily: "'Epilogue', sans-serif",
            padding: '20px'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '1100px',
                minHeight: '600px',
                display: 'flex',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                border: '1px solid #E9EBEE',
                overflow: 'hidden'
            }}>
                {/* Left Form Side */}
                <div style={{ flex: 1, padding: '40px 60px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <Link href="/" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#7C8493',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'color 0.2s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = '#25324B'}
                            onMouseLeave={e => e.currentTarget.style.color = '#7C8493'}
                        >
                            ← Back to Home
                        </Link>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {children}
                    </div>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', color: '#7C8493' }}>2025 QuickHire. All right Reserved</p>
                    </div>
                </div>

                {/* Right Design Side */}
                <div style={{
                    flex: 1,
                    background: '#F1F3FB',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ textAlign: 'center', zIndex: 1, marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#25324B', marginBottom: '8px', fontFamily: "'Clash Display', sans-serif" }}>
                            The Simplest way to Manage<br />your {isCompany ? 'Workforce' : 'Career'}
                        </h2>
                        <p style={{ color: '#515B6F', fontSize: '16px' }}>Enter your credentials to access your account</p>
                    </div>

                    {/* Mockup Graphic mimicking image 1 */}
                    <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '24px',
                        border: '1px solid rgba(255,255,255,0.8)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        zIndex: 1
                    }}>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ flex: 1, background: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7', fontSize: '12px' }}>⌘</div>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#515B6F' }}>Total Jobs</span>
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#25324B', marginBottom: '8px' }}>124</div>
                                <div style={{ fontSize: '10px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ background: '#D1FAE5', padding: '2px 4px', borderRadius: '4px' }}>+8%</span> To the last month
                                </div>
                            </div>
                            <div style={{ flex: 1, background: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', fontSize: '12px' }}>⌘</div>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#515B6F' }}>Applications</span>
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#25324B', marginBottom: '8px' }}>2,840</div>
                                <div style={{ fontSize: '10px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ background: '#D1FAE5', padding: '2px 4px', borderRadius: '4px' }}>+12%</span> To the last month
                                </div>
                            </div>
                        </div>

                        {/* Fake Graph */}
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#25324B' }}>Activity Overview</span>
                                <span style={{ fontSize: '11px', color: '#7C8493', border: '1px solid #E9EBEE', padding: '2px 8px', borderRadius: '4px' }}>Monthly ⌄</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '80px', gap: '8px' }}>
                                <div style={{ flex: 1, background: '#F1F3FB', height: '20%', borderRadius: '4px 4px 0 0' }}></div>
                                <div style={{ flex: 1, background: '#F1F3FB', height: '40%', borderRadius: '4px 4px 0 0' }}></div>
                                <div style={{ flex: 1, background: '#9CA3AF', height: '60%', borderRadius: '4px 4px 0 0' }}></div>
                                <div style={{ flex: 1, background: '#4B5563', height: '100%', borderRadius: '4px 4px 0 0' }}></div>
                                <div style={{ flex: 1, background: '#6B7280', height: '70%', borderRadius: '4px 4px 0 0' }}></div>
                                <div style={{ flex: 1, background: '#F1F3FB', height: '30%', borderRadius: '4px 4px 0 0' }}></div>
                                <div style={{ flex: 1, background: '#F1F3FB', height: '10%', borderRadius: '4px 4px 0 0' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
