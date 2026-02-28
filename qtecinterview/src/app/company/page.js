'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { companyJobsAPI, companyAuthAPI } from '../../lib/api';
import { useCompany } from './layout';

export default function CompanyDashboard() {
  const company = useCompany();
  // If company is in context, their context won't update automatically on save unless we have a setter. 
  // We'll hack it nicely by refreshing the page after saving profile. 
  const [stats, setStats] = useState({ total: 0, featured: 0, applications: 0 });
  const [loading, setLoading] = useState(true);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    logo_url: '',
    location: '',
    website: '',
    description: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    companyJobsAPI.list().then((res) => {
      const jobs = res.data || [];
      setStats({
        total: jobs.length,
        featured: jobs.filter((j) => j.is_featured).length,
        applications: jobs.reduce((sum, j) => sum + (j.applicant_count || 0), 0),
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Jobs', value: stats.total, color: '#4640DE', bg: '#F0F0FF' },
    { label: 'Featured Jobs', value: stats.featured, color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Total Applications', value: stats.applications, color: '#059669', bg: '#ECFDF5' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm({ ...profileForm, logo_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await companyAuthAPI.updateProfile(profileForm);
      window.location.reload(); // Quick way to refresh context
    } catch (err) {
      alert(err.data?.error || 'Failed to update profile');
      setSavingProfile(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #D6DDEB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Epilogue', sans-serif" };

  // Determine if profile is incomplete
  const isProfileIncomplete = company && (!company.logo_url || !company.description || !company.location);

  if (isProfileIncomplete) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#25324B', margin: '0 0 8px', fontFamily: "'Clash Display', sans-serif" }}>Complete Company Profile</h1>
          <p style={{ color: '#7C8493', fontSize: '15px', margin: 0 }}>Please fill out these details before posting jobs.</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #E9EBEE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <form onSubmit={handleProfileSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Company Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {profileForm.logo_url ? (
                  <img src={profileForm.logo_url} alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #E9EBEE' }} />
                ) : (
                  <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: '#F8F8FD', border: '1px dashed #D6DDEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C8493' }}>🏢</div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ flex: 1, padding: '10px', border: '1px solid #D6DDEB', borderRadius: '8px', fontSize: '13px' }} required={!company.logo_url} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Location</label>
                <input required value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} style={inputStyle} placeholder="E.g. San Francisco, CA" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Website</label>
                <input required value={profileForm.website} onChange={e => setProfileForm({...profileForm, website: e.target.value})} style={inputStyle} placeholder="https://example.com" />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' }}>Company Description</label>
              <textarea required rows={4} value={profileForm.description} onChange={e => setProfileForm({...profileForm, description: e.target.value})} style={{ ...inputStyle, resize: 'vertical' }} placeholder="What does your company do?" />
            </div>

            <button type="submit" disabled={savingProfile} style={{ width: '100%', padding: '14px', background: savingProfile ? '#7C7AED' : '#4640DE', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: savingProfile ? 'not-allowed' : 'pointer' }}>
              {savingProfile ? 'Saving...' : 'Save Profile'}
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
          Welcome, {company?.name}
        </h1>
        <p style={{ color: '#7C8493', fontSize: '14px', margin: 0 }}>
          {company?.is_verified
            ? '✅ Your company is verified — you can post and manage jobs.'
            : '⏳ Your company is pending admin verification.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {cards.map((card) => (
          <div key={card.label} style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #E9EBEE' }}>
            <p style={{ fontSize: '13px', color: '#7C8493', margin: '0 0 8px', fontWeight: '500' }}>{card.label}</p>
            <p style={{ fontSize: '36px', fontWeight: '700', color: card.color, margin: 0, fontFamily: "'Clash Display', sans-serif" }}>
              {loading ? '—' : card.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Link href="/company/jobs/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#4640DE', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
          ➕ Post a Job
        </Link>
        <Link href="/company/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#fff', color: '#4640DE', border: '1px solid #4640DE', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
          💼 View My Jobs
        </Link>
      </div>
    </div>
  );
}
