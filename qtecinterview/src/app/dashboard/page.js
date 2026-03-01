'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from './layout';
import { userAuthAPI, applicationsAPI } from '../../lib/api';
import { PDFDocument } from 'pdf-lib';
import Swal from 'sweetalert2';

export default function UserDashboard() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [appsLoading, setAppsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({ avatar_url: '', cv_url: '' });

  useEffect(() => {
    if (user?.is_profile_complete) {
      applicationsAPI.list()
        .then(res => setApplications(res.data || []))
        .catch(() => {})
        .finally(() => setAppsLoading(false));
    }
  }, [user?.is_profile_complete]);

  const handleCancelApplication = async (id) => {
    const result = await Swal.fire({
      title: 'Cancel Application?',
      text: "Are you sure you want to withdraw your application for this position?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, withdraw'
    });

    if (!result.isConfirmed) return;

    try {
      await applicationsAPI.delete(id);
      setApplications(applications.filter(app => app.id !== id));
      Swal.fire({
        title: 'Withdrawn',
        text: 'Your application has been canceled.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to cancel application.',
        icon: 'error'
      });
    }
  };

  const compressImage = (base64Str, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.crossOrigin = 'anonymous';
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
      img.onerror = (e) => {
        console.error('Image Error:', e);
        resolve(base64Str); // Fallback to original
      };
    });
  };

  const compressPDF = async (base64Str) => {
    try {
      const pdfBytes = await fetch(base64Str).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true });

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error('PDF Compression Error:', err);
      return base64Str;
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
          base64 = await compressPDF(base64);
        }
        
        setForm({ ...form, [fieldName]: base64 });
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
      Swal.fire({
        title: 'Profile Updated!',
        text: 'Your details have been saved successfully.',
        icon: 'success',
        confirmButtonColor: '#4f46e5'
      });
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.data?.error || 'Failed to update profile',
        icon: 'error',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_profile_complete) {
    const completionPercentage = (form.avatar_url ? 50 : 0) + (form.cv_url ? 50 : 0);

    return (
      <div style={{ maxWidth: '600px', margin: '40px auto 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          {/* Progress Bar Container */}
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '32px', overflow: 'hidden' }}>
            <div style={{ width: `${completionPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)', transition: 'width 0.5s ease-in-out' }}></div>
          </div>

          <div style={{ width: '64px', height: '64px', background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '24px', color: '#4f46e5' }}>
            {completionPercentage === 100 ? '🎉' : '✨'}
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px', fontFamily: "'Clash Display', sans-serif" }}>Complete Your Profile</h1>
          <p style={{ color: '#64748b', fontSize: '16px', margin: 0, lineHeight: 1.5 }}>You're {completionPercentage}% there! Upload your CV and a profile picture to start applying.</p>
        </div>

        <div className="dashboard-card" style={{ padding: '40px', background: '#ffffff' }}>
          <form onSubmit={handleProfileSubmit}>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>Profile Picture</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                  {form.avatar_url ? (
                    <img src={form.avatar_url} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f8fafc', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '24px' }}>📷</div>
                  )}
                  {form.avatar_url && (
                     <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px', background: '#10b981', borderRadius: '50%', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                       ✓
                     </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar_url')} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', background: '#f8fafc', color: '#64748b' }} required={!user?.avatar_url} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>CV / Resume (PDF)</label>
              <div style={{ position: 'relative' }}>
                <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'cv_url')} style={{ width: '100%', padding: '14px', border: '2px dashed #e2e8f0', borderRadius: '12px', fontSize: '14px', background: form.cv_url ? '#f0f9ff' : '#f8fafc', color: '#64748b', cursor: 'pointer' }} required={!user?.cv_url} />
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}><span>ℹ️</span> {form.cv_url ? <span style={{ color: '#10b981', fontWeight: '700' }}>✓ CV Selected</span> : 'Please upload a PDF file only (Max 10MB).'}</p>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#818cf8' : (completionPercentage === 100 ? '#10b981' : '#4f46e5'), color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }} onMouseEnter={e => {if(!loading) e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.3)'}} onMouseLeave={e => {if(!loading) e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.2)'}}>
              {loading ? 'Saving Profile...' : 'Save & Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner" style={{ marginBottom: '40px', background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          margin: '0 0 12px',
          fontFamily: "'Clash Display', sans-serif",
          position: 'relative',
          zIndex: 10
        }}>
          Let's land your next opportunity
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.9, margin: '0 0 24px', maxWidth: '500px', position: 'relative', zIndex: 10 }}>
          Welcome back, {user?.name?.split(' ')[0] || 'Applicant'}. You have {applications.length} active application{applications.length !== 1 ? 's' : ''}. Ready to apply?
        </p>
        <Link href="/jobs" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          color: '#10b981',
          padding: '12px 24px',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '15px',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          Explore Jobs <span style={{ fontSize: '18px' }}>→</span>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Main Content Area */}
        <div style={{ flex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Recent Applications</h2>
            <Link href="/jobs" style={{ fontSize: '14px', fontWeight: '600', color: '#4f46e5', textDecoration: 'none' }}>Browse more</Link>
          </div>

          {appsLoading ? (
            <div className="dashboard-card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: '#64748b' }}>Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="dashboard-card" style={{ padding: '40px', textAlign: 'center', background: '#ffffff', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px', color: '#94a3b8', border: '2px dashed #cbd5e1' }}>
                 📄
               </div>
               <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px' }}>No applications yet</h3>
               <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 32px', maxWidth: '400px', marginInline: 'auto', lineHeight: 1.5 }}>
                 Your application history will appear here once you start applying for jobs.
               </p>
               <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: '#0f172a', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#1e293b'} onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}>
                 Start searching 🔍
               </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {applications.map(app => (
                <div key={app.id} className="dashboard-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      💼
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>{app.job?.title}</h3>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748b' }}>
                        <span>{app.job?.location}</span>
                        <span>•</span>
                        <span>{new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        background: app.status === 'approved' ? '#ecfdf5' : app.status === 'rejected' ? '#fef2f2' : app.status === 'interviewing' ? '#f0f9ff' : '#f0f9ff',
                        color: app.status === 'approved' ? '#059669' : app.status === 'rejected' ? '#dc2626' : app.status === 'interviewing' ? '#0ea5e9' : '#0ea5e9'
                      }}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      {app.status === 'interviewing' && app.interview_date && (
                        <div style={{ textAlign: 'right', fontSize: '13px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: '220px' }}>
                           <p style={{ margin: '0 0 6px', fontWeight: '700', color: '#1e293b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interview Scheduled</p>
                           <p style={{ margin: '0 0 8px', color: '#445164', fontWeight: '600' }}>📅 {new Date(app.interview_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                           {app.interview_link && (
                             <a href={app.interview_link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '6px 12px', background: '#4f46e5', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textDecoration: 'none', marginBottom: '8px' }}>Join Interview Link ↗</a>
                           )}
                           {app.interview_notes && (
                             <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>"{app.interview_notes}"</p>
                           )}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleCancelApplication(app.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '4px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="dashboard-card">
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Profile Strength</h3>
                <span style={{ fontSize: '20px', color: '#cbd5e1', cursor: 'pointer' }}>⋮</span>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', border: '8px solid #f1f5f9', borderTopColor: '#10b981', borderRightColor: '#10b981', borderBottomColor: '#10b981', borderLeftColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ textAlign: 'center' }}>
                     <span style={{ display: 'block', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>100%</span>
                     <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>Perfect</span>
                   </div>
                </div>
             </div>
             
             <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '16px', border: '1px solid #dcfce7' }}>
                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#10b981' }}>✓</span> CV Uploaded</p>
                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#10b981' }}>✓</span> Profile Picture</p>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#10b981' }}>✓</span> Account Verified</p>
             </div>
          </div>
          
          <div className="dashboard-card" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px' }}>Need Help?</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
              Check out our resources to improve your resume and interview skills.
            </p>
            <button style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#4f46e5', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => {e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'}} onMouseLeave={e => {e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'}}>
              View Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

