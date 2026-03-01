'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userAuthAPI } from '../../lib/api';

import AuthLayout from '../../components/layout/AuthLayout';
import RoleToggle from '../../components/ui/RoleToggle';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await userAuthAPI.login(form.email, form.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '14px 16px', border: '1px solid #D6DDEB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Epilogue', sans-serif" };

  return (
    <AuthLayout>
      <div style={{ maxWidth: '420px', margin: '0 auto', width: '100%' }}>
        <RoleToggle />
        
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#25324B', margin: '0 0 8px', fontFamily: "'Clash Display', sans-serif" }}>Welcome Back</h1>
          <p style={{ color: '#7C8493', fontSize: '15px', margin: 0 }}>Enter your credentials to access your account</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px' }}>
            <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Email*</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="Enter your email" />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Password*</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="Enter your password" />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#6EE7B7' : '#56E0B1', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 6px rgba(86, 224, 177, 0.2)' }}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E9EBEE' }}></div>
          <span style={{ padding: '0 16px', color: '#7C8493', fontSize: '14px', fontWeight: '500' }}>Or continue with</span>
          <div style={{ flex: 1, height: '1px', background: '#E9EBEE' }}></div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {['G', 'f', 'A'].map((provider) => (
            <button key={provider} type="button" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #E9EBEE', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', color: '#25324B', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              {provider}
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '15px', color: '#515B6F' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#56E0B1', fontWeight: '700', textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
