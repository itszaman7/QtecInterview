'use client';

import { useState } from 'react';
import { useCompany } from '../layout';
import Button from '../../../components/ui/Button';

export default function CompanySettingsPage() {
  const company = useCompany();
  const [form, setForm] = useState({
    name: company?.name || '',
    website_url: company?.website_url || '',
    location: company?.location || '',
    industry: company?.industry || '',
    description: company?.description || ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Epilogue', sans-serif"
  };

  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px', fontFamily: "'Clash Display', sans-serif" }}>Company Settings</h1>
        <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Manage your company profile and preferences.</p>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '24px' }}>Company Information</h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Company Name</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Enter company name" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Website URL</label>
              <input name="website_url" value={form.website_url} onChange={handleChange} style={inputStyle} placeholder="https://" />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input name="location" value={form.location} onChange={handleChange} style={inputStyle} placeholder="e.g. San Francisco, CA" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Industry</label>
            <input name="industry" value={form.industry} onChange={handleChange} style={inputStyle} placeholder="e.g. Technology" />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Brief description about your company..." />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <Button type="button" variant="primary" onClick={() => alert('Settings update functionality to be implemented')} className="px-6">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
