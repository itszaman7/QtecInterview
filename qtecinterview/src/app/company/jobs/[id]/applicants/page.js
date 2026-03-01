'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { companyJobsAPI } from '../../../../../lib/api';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function JobApplicantsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  
  // Modal state for scheduling interview
  const [modalData, setModalData] = useState(null);

  const fetchJobDetails = async () => {
    try {
      const json = await companyJobsAPI.getOwnJob(id);
      if (json.success) {
        setJob(json.data);
      } else {
        setError(json.error || 'Failed to load job details');
      }
    } catch (err) {
      setError('An error occurred while fetching job details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const handleStatusUpdate = async (applicationId, newStatus, extraData = {}) => {
    setUpdating(applicationId);
    try {
      const json = await companyJobsAPI.updateApplicationStatus(applicationId, {
        status: newStatus,
        ...extraData
      });

      if (json.success) {
        await Swal.fire({
          title: 'Success!',
          text: `Application status updated to ${newStatus}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: '#4640DE'
        });
        fetchJobDetails(); // Refresh list
        setModalData(null);
      } else {
        Swal.fire({
          title: 'Error',
          text: json.error || 'Failed to update status',
          icon: 'error',
          confirmButtonColor: '#4640DE'
        });
      }
    } catch (err) {
       Swal.fire({
        title: 'Error',
        text: 'A network error occurred while updating status.',
        icon: 'error',
        confirmButtonColor: '#4640DE'
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>Loading applicants...</div>;
  if (error) return (
    <div style={{ padding: '80px', textAlign: 'center' }}>
      <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '18px' }}>{error}</p>
      <Link href="/company/jobs" style={{ color: '#4640DE', fontWeight: '600', textDecoration: 'none' }}>← Return to Jobs</Link>
    </div>
  );
  if (!job) return null;

  const applicants = job.applications || [];

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/company/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4640DE', textDecoration: 'none', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
          ← Back to Jobs
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#25324B', margin: '0 0 8px', fontFamily: "'Clash Display', sans-serif" }}>
          Applicants for "{job.title}"
        </h1>
        <p style={{ color: '#7C8493', fontSize: '15px', margin: 0 }}>
          Manage and track everyone who applied for this position.
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E9EBEE', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E9EBEE', background: '#F8F8FD' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Applicant</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Contact</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontWeight: '600', color: '#515B6F' }}>CV/Resume</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontWeight: '600', color: '#515B6F' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600', color: '#515B6F' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: '#7C8493' }}>
                  No one has applied for this job yet.
                </td>
              </tr>
            ) : (
              applicants.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #F1F1F5', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', overflow: 'hidden' }}>
                        {app.user?.avatar_url ? (
                          <img src={app.user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
                        )}
                      </div>
                      <span style={{ fontWeight: '600', color: '#25324B' }}>{app.user?.name || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#515B6F' }}>{app.user?.email}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    {app.user?.cv_url ? (
                      <a href={app.user.cv_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4640DE', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>
                        📄 View CV
                      </a>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>Not provided</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '11px', 
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                      background: app.status === 'approved' ? '#ECFDF5' : app.status === 'rejected' ? '#FEF2F2' : app.status === 'interviewing' ? '#F0F9FF' : '#F8F8FD',
                      color: app.status === 'approved' ? '#059669' : app.status === 'rejected' ? '#DC2626' : app.status === 'interviewing' ? '#0EA5E9' : '#515B6F',
                      border: `1px solid ${app.status === 'approved' ? '#A7F3D0' : app.status === 'rejected' ? '#FECACA' : app.status === 'interviewing' ? '#BAE6FD' : '#E9EBEE'}`
                    }}>
                      {app.status}
                    </span>
                    {app.status === 'interviewing' && app.interview_date && (
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px', fontWeight: '600' }}>
                        📅 {new Date(app.interview_date).toLocaleDateString()} at {new Date(app.interview_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {app.status === 'pending' && (
                        <>
                          <button 
                            disabled={updating === app.id}
                            onClick={() => handleStatusUpdate(app.id, 'approved')}
                            style={{ padding: '6px 14px', background: '#ECFDF5', color: '#059669', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Approve
                          </button>
                          <button 
                            disabled={updating === app.id}
                            onClick={() => setModalData({ id: app.id, date: '', link: '', notes: '' })}
                            style={{ padding: '6px 14px', background: '#F0F9FF', color: '#0EA5E9', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Interview
                          </button>
                          <button 
                            disabled={updating === app.id}
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            style={{ padding: '6px 14px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {(app.status === 'approved' || app.status === 'interviewing') && (
                        <button 
                          disabled={updating === app.id}
                          onClick={() => setModalData({ id: app.id, date: app.interview_date, link: app.interview_link, notes: app.interview_notes })}
                          style={{ padding: '6px 14px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Modify Interview
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '440px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '700', color: '#0f172a', fontFamily: "'Clash Display', sans-serif" }}>Schedule Interview</h3>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>Set the meeting details for this candidate.</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              let link = formData.get('link');
              if (link && !link.startsWith('http')) {
                link = `https://${link}`;
              }
              handleStatusUpdate(modalData.id, 'interviewing', {
                interview_date: formData.get('date'),
                interview_link: link,
                interview_notes: formData.get('notes'),
              });
            }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Date & Time</label>
                <input 
                  type="datetime-local" 
                  name="date" 
                  defaultValue={modalData.date?.slice(0, 16)} 
                  required 
                  style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }} 
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Meeting Link</label>
                <input 
                  type="text" 
                  name="link" 
                  defaultValue={modalData.link} 
                  placeholder="Zoom, Google Meet, or static link" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} 
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Internal Notes</label>
                <textarea 
                  name="notes" 
                  defaultValue={modalData.notes} 
                  rows={3} 
                  placeholder="Optional notes for the interview..."
                  style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', resize: 'none', outline: 'none' }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="submit" 
                  disabled={updating === modalData.id} 
                  style={{ flex: 1.5, padding: '12px', background: '#4640DE', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }}
                >
                  {updating === modalData.id ? 'Saving...' : 'Confirm Schedule'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setModalData(null)} 
                  style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
