'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from './layout';
import { userAuthAPI } from '../../lib/api';

export default function UserDashboard() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ avatar_url: '', cv_url: '' });

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, [fieldName]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userAuthAPI.updateProfile(form);
      setUser(res.data);
    } catch (err) {
      alert(err.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_profile_complete) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#25324B', margin: '0 0 8px', fontFamily: "'Clash Display', sans-serif" }}>Complete Your Profile</h1>
          <p style={{ color: '#7C8493', fontSize: '15px', margin: 0 }}>To apply for jobs, please upload your CV and a profile picture.</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #E9EBEE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <form onSubmit={handleProfileSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Profile Picture</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {form.avatar_url ? (
                  <img src={form.avatar_url} alt="Avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F8F8FD', border: '1px dashed #D6DDEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C8493' }}>📷</div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar_url')} style={{ flex: 1, padding: '10px', border: '1px solid #D6DDEB', borderRadius: '8px', fontSize: '13px' }} required={!user?.avatar_url} />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>CV / Resume (PDF)</label>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'cv_url')} style={{ width: '100%', padding: '10px', border: '1px solid #D6DDEB', borderRadius: '8px', fontSize: '13px' }} required={!user?.cv_url} />
              <p style={{ fontSize: '12px', color: '#7C8493', margin: '6px 0 0' }}>Please upload a PDF file only.</p>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#7C7AED' : '#4640DE', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Saving Profile...' : 'Save & Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#25324B', margin: '0 0 8px', fontFamily: "'Clash Display', sans-serif" }}>
          Welcome back, {user.name}
        </h1>
        <p style={{ color: '#7C8493', fontSize: '15px', margin: 0 }}>
          Here are the jobs you've applied for.
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #E9EBEE', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: '#F0F0FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#4640DE', fontSize: '24px' }}>
          📝
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#25324B', margin: '0 0 8px' }}>No applications yet</h3>
        <p style={{ color: '#7C8493', fontSize: '14px', margin: '0 0 24px' }}>You haven't applied to any jobs yet.</p>
        <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: '#4640DE', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
          Find Jobs
        </Link>
      </div>
    </div>
  );
}
