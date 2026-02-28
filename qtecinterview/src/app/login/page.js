'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userAuthAPI } from '../../lib/api';

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

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #D6DDEB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Epilogue', sans-serif" };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4640DE 0%, #26A4FF 100%)', fontFamily: "'Epilogue', sans-serif", padding: '40px 20px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#25324B', margin: '0 0 8px', fontFamily: "'Clash Display', sans-serif" }}>Welcome Back</h1>
          <p style={{ color: '#7C8493', fontSize: '14px', margin: 0 }}>Log in to access your applications</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
            <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#25324B', marginBottom: '6px' }}>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="john@example.com" />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#25324B', marginBottom: '6px' }}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="Password" />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#7C7AED' : '#4640DE', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#7C8493' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#4640DE', fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link>
        </p>
        
        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #E9EBEE', paddingTop: '16px' }}>
            <p style={{ fontSize: '13px', color: '#7C8493', margin: 0 }}>
              Hiring? <Link href="/company/login" style={{ color: '#4640DE', fontWeight: '600', textDecoration: 'none' }}>Company Login</Link>
            </p>
        </div>
      </div>
    </div>
  );
}
