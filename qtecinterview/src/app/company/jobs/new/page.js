'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { companyJobsAPI } from '../../../../lib/api';

const CATEGORIES = ['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resource'];
const TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Remote', 'Internship'];

export default function CompanyCreateJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', location: '', category: '', type: 'Full-Time', description: '', is_featured: false, deadline: '', tags: [] });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm({ ...form, [name]: inputType === 'checkbox' ? checked : value });
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
    setTagInput('');
  };

  const removeTag = (tag) => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.deadline) delete payload.deadline;
      await companyJobsAPI.create(payload);
      router.push('/company/jobs');
    } catch (err) {
      setErrors(err.data?.errors || [{ message: err.data?.error || 'Failed to create job' }]);
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #D6DDEB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Epilogue', sans-serif" };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#25324B', marginBottom: '8px' };

  return (
    <div style={{ maxWidth: '720px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#25324B', margin: '0 0 28px', fontFamily: "'Clash Display', sans-serif" }}>Post a New Job</h1>

      {errors.length > 0 && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
          {errors.map((e, i) => <p key={i} style={{ color: '#DC2626', fontSize: '13px', margin: i ? '4px 0 0' : 0 }}>{e.field ? `${e.field}: ` : ''}{e.message}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E9EBEE', padding: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>Job Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} placeholder="e.g. Senior UX Designer" />
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input name="location" value={form.location} onChange={handleChange} style={inputStyle} placeholder="e.g. Madrid, Spain" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <select name="type" value={form.type} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Deadline</label>
            <input name="deadline" type="date" value={form.deadline} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} placeholder="Describe the role..." />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} style={{ ...inputStyle, flex: 1 }} placeholder="e.g. remote, senior, urgent" />
            <button type="button" onClick={addTag} style={{ padding: '12px 20px', background: '#F0F0FF', color: '#4640DE', border: '1px solid #D6DDEB', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Add</button>
          </div>
          {form.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {form.tags.map((tag) => (
                <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F0F0FF', color: '#4640DE', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: '#4640DE', cursor: 'pointer', fontSize: '14px', padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Featured Toggle */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#4640DE' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#25324B', margin: 0 }}>⭐ Feature this job</p>
              <p style={{ fontSize: '12px', color: '#7C8493', margin: '2px 0 0' }}>Featured jobs appear at the top of search results</p>
            </div>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" disabled={loading} style={{ padding: '12px 32px', background: loading ? '#7C7AED' : '#4640DE', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
          <button type="button" onClick={() => router.back()} style={{ padding: '12px 24px', background: '#fff', color: '#515B6F', border: '1px solid #D6DDEB', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
