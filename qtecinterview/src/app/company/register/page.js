'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { companyAuthAPI } from '../../../lib/api';

import AuthLayout from '../../../components/layout/AuthLayout';
import RoleToggle from '../../../components/ui/RoleToggle';

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

  const inputStyle = { width: '100%', padding: '14px 16px', border: '1px solid #D6DDEB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Epilogue', sans-serif" };

  return (
    <AuthLayout isCompany={true}>
      <div style={{ maxWidth: '420px', margin: '0 auto', width: '100%' }}>
        <RoleToggle isRegister={true} />

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#25324B', margin: '0 0 8px', fontFamily: "'Clash Display', sans-serif" }}>Register Your Company</h1>
          <p style={{ color: '#7C8493', fontSize: '15px', margin: 0 }}>Start posting jobs and manage your candidates</p>
        </div>

        {errors.length > 0 && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px' }}>
            {errors.map((e, i) => <p key={i} style={{ color: '#DC2626', fontSize: '13px', margin: i ? '4px 0 0' : 0 }}>{e.field ? `${e.field}: ` : ''}{e.message}</p>)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Company Name*</label>
            <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} placeholder="E.g. Acme Inc." />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Work Email*</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="hr@acme.com" />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Password*</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="Min. 6 characters" />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#7C7AED' : '#4640DE', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 6px rgba(70, 64, 222, 0.2)' }}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '15px', color: '#515B6F' }}>
          Already have an account?{' '}
          <Link href="/company/login" style={{ color: '#4640DE', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
