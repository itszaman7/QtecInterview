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
      {/* Hero Banner */}
      <div className="hero-banner" style={{ marginBottom: '40px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          margin: '0 0 12px',
          fontFamily: "'Clash Display', sans-serif",
          position: 'relative',
          zIndex: 10
        }}>
          Manage Your Talent Pipeline
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.9, margin: '0 0 24px', maxWidth: '500px', position: 'relative', zIndex: 10 }}>
          Welcome back to {company?.name}. Track applications, post new opportunities, and find your next great hire.
        </p>
        <Link href="/company/jobs/new" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          color: '#3b82f6',
          padding: '12px 24px',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '15px',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          Post New Job <span style={{ fontSize: '18px' }}>→</span>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Main Content Area */}
        <div style={{ flex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Company Statistics</h2>
            <span style={{ fontSize: '24px', color: '#cbd5e1', cursor: 'pointer' }}>⋮</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
            {cards.map((card, index) => (
              <div key={card.label} className="dashboard-card" style={{ padding: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, fontSize: '18px', marginBottom: '16px' }}>
                  {index === 0 ? '💼' : index === 1 ? '⭐' : '📄'}
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px', fontWeight: '600' }}>{card.label}</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0, lineHeight: 1 }}>
                    {loading ? '—' : card.value}
                  </p>
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', marginBottom: '4px' }}>↑ 12%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-card" style={{ padding: '32px', textAlign: 'center', background: '#f8fafc', borderStyle: 'dashed' }}>
             <div style={{ width: '64px', height: '64px', background: '#e0e7ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px', color: '#4f46e5' }}>
               📈
             </div>
             <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>Applicant Analytics</h3>
             <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px', maxWidth: '400px', marginInline: 'auto' }}>
               Track your hiring pipeline performance and application trends over time.
             </p>
             <button style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
               View full report
             </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="dashboard-card">
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Hiring Team</h3>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>+</div>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: i===1 ? '#e2e8f0' : i===2 ? '#fef3c7' : '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                       {i===1 ? '👨‍💼' : i===2 ? '👩‍💻' : '🧑‍🎨'}
                     </div>
                     <div style={{ flex: 1 }}>
                       <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                         {i===1 ? company?.email || 'Sarah Jenkins' : i===2 ? 'Michael Chen' : 'Jessica Wong'}
                       </p>
                       <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                         {i===1 ? 'HR Director' : i===2 ? 'Tech Lead' : 'Recruiter'}
                       </p>
                     </div>
                     <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Message</button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
