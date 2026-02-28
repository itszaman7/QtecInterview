'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobsAPI } from '../../../../lib/api';

const CATEGORIES = ['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resource'];
const TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Remote', 'Internship'];

export default function CreateJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    category: '',
    type: 'Full-Time',
    description: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      await jobsAPI.create(form);
      router.push('/admin/jobs');
    } catch (err) {
      if (err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        setErrors([{ message: err.data?.error || 'Failed to create job' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #D6DDEB',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Epilogue', sans-serif",
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#25324B',
    marginBottom: '8px',
  };

  return (
    <div style={{ maxWidth: '720px' }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#25324B',
        margin: '0 0 28px',
        fontFamily: "'Clash Display', 'Epilogue', sans-serif",
      }}>
        Create New Job
      </h1>

      {errors.length > 0 && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          {errors.map((err, i) => (
            <p key={i} style={{ color: '#DC2626', fontSize: '13px', margin: i === 0 ? 0 : '4px 0 0' }}>
              {err.field ? `${err.field}: ` : ''}{err.message}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #E9EBEE',
        padding: '32px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>Job Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Senior UX Designer" required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Company *</label>
            <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Nomad" required style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <select name="type" value={form.type} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Madrid, Spain" style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={labelStyle}>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, and requirements..."
            required
            rows={6}
            style={{
              ...inputStyle,
              resize: 'vertical',
              lineHeight: '1.6',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 32px',
              background: loading ? '#7C7AED' : '#4640DE',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              padding: '12px 24px',
              background: '#fff',
              color: '#515B6F',
              border: '1px solid #D6DDEB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
