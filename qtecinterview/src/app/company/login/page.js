'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { companyAuthAPI } from '../../../lib/api';

import AuthLayout from '../../../components/layout/AuthLayout';
import RoleToggle from '../../../components/ui/RoleToggle';

export default function CompanyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await companyAuthAPI.login(email, password);
      router.push('/company');
    } catch (err) {
      setError(err.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '14px 16px', border: '1px solid #D6DDEB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Epilogue', sans-serif" };

  return (
    <AuthLayout isCompany={true}>
      <div style={{ maxWidth: '420px', margin: '0 auto', width: '100%' }}>
        <RoleToggle />

        <div style={{ marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', background: '#4640DE', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#25324B', margin: '0 0 8px', fontFamily: "'Clash Display', sans-serif" }}>Company Login</h1>
          <p style={{ color: '#7C8493', fontSize: '15px', margin: 0 }}>Welcome back to QuickHire</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Email*</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} placeholder="hr@acme.com" />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Password*</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} placeholder="Enter your password" />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#7C7AED' : '#4640DE', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 6px rgba(70, 64, 222, 0.2)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '15px', color: '#515B6F' }}>
          Don't have an account?{' '}
          <Link href="/company/register" style={{ color: '#4640DE', fontWeight: '700', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
