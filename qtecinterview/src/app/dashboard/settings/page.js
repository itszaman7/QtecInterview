'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../layout';
import { userAuthAPI } from '../../../lib/api';
import { PDFDocument } from 'pdf-lib';

export default function SettingsPage() {
  const { user, setUser } = useUser();
  const [form, setForm] = useState({ name: '', email: '', avatar_url: '', cv_url: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        avatar_url: user.avatar_url || '',
        cv_url: user.cv_url || ''
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const compressImage = (base64Str, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  const compressPDF = async (base64Str) => {
    try {
      const pdfBytes = await fetch(base64Str).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Basic optimization: re-saving with object streams enabled and useCompactResponse
      // For more aggressive compression, one would need to downscale images, which is complex.
      // Simply re-saving can sometimes reduce junk.
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error('PDF Compression Error:', err);
      return base64Str; // Fallback
    }
  };

  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        let base64 = reader.result;
        
        // Compress if it's an image
        if (file.type.startsWith('image/')) {
          base64 = await compressImage(base64);
        } else if (file.type === 'application/pdf') {
          setMessage({ type: 'info', text: 'Optimizing PDF...' });
          base64 = await compressPDF(base64);
          setMessage({ type: '', text: '' });
        }
        
        setForm({ ...form, [fieldName]: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await userAuthAPI.updateProfile(form);
      setUser(res.data);
      setMessage({ type: 'success', text: 'Settings updated successfully! ✨' });
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.error || 'Failed to update settings' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '14px 16px', border: '1px solid #D6DDEB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Epilogue', sans-serif", background: '#f8fafc' };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px', fontFamily: "'Clash Display', sans-serif" }}>Account Settings</h1>
        <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>Manage your profile information and account preferences</p>
      </div>

      {message.text && (
        <div style={{ 
          padding: '16px 20px', 
          borderRadius: '12px', 
          marginBottom: '32px', 
          background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${message.type === 'success' ? '#dcfce7' : '#fecaca'}`,
          color: message.type === 'success' ? '#166534' : '#991b1b',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span>{message.type === 'success' ? '✅' : '❌'}</span>
          {message.text}
        </div>
      )}

      <div className="dashboard-card" style={{ padding: '40px', background: '#ffffff' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '10px' }}>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Your full name" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '10px' }}>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="your@email.com" required disabled />
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>Contact support to change email</p>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>Profile Picture</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F8F8FD', overflow: 'hidden', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {form.avatar_url ? (
                  <img src={form.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{form.name?.charAt(0) || 'U'}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar_url')} style={{ fontSize: '14px', color: '#64748b' }} />
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>JPG, PNG or GIF. Max size of 1MB.</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>Curriculum Vitae (CV)</label>
            <div style={{ padding: '24px', border: '2px dashed #E2E8F0', borderRadius: '16px', background: '#F8FAFC', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>📄</div>
              <p style={{ fontSize: '14px', color: '#334155', fontWeight: '600', margin: '0 0 4px' }}>
                {form.cv_url ? 'Update your CV' : 'Upload your CV'}
              </p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>PDF files only. Max 10MB.</p>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'cv_url')} style={{ fontSize: '14px', color: '#64748b' }} />
              {form.cv_url && (
                <div style={{ marginTop: '12px', padding: '8px 12px', background: '#f0f9ff', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', fontSize: '13px', fontWeight: '600' }}>
                   <span>✔</span> Current CV uploaded
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading} style={{ 
              padding: '16px 32px', 
              background: loading ? '#818cf8' : '#4f46e5', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              transition: 'all 0.2s', 
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' 
            }}>
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
