'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { companyAuthAPI } from '../../../lib/api';

export default function CompanyRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      await companyAuthAPI.register(form);
      router.push('/company');
    } catch (err) {
      setErrors(err.data?.errors || [{ message: err.data?.error || 'Registration failed' }]);
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #D6DDEB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Epilogue', sans-serif" };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4640DE 0%, #26A4FF 100%)', fontFamily: "'Epilogue', sans-serif", padding: '40px 20px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '520px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#25324B', margin: '0 0 8px', fontFamily: "'Clash Display', sans-serif" }}>Register Your Company</h1>
          <p style={{ color: '#7C8493', fontSize: '14px', margin: 0 }}>Start posting jobs on QuickHire</p>
        </div>

        {errors.length > 0 && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
            {errors.map((e, i) => <p key={i} style={{ color: '#DC2626', fontSize: '13px', margin: i ? '4px 0 0' : 0 }}>{e.field ? `${e.field}: ` : ''}{e.message}</p>)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#25324B', marginBottom: '6px' }}>Company Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} placeholder="Acme Inc." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#25324B', marginBottom: '6px' }}>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="hr@acme.com" />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#25324B', marginBottom: '6px' }}>Password *</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="Min. 6 characters" />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#7C7AED' : '#4640DE', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#7C8493' }}>
          Already have an account?{' '}
          <Link href="/company/login" style={{ color: '#4640DE', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
