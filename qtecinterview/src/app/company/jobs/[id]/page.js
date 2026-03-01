'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { companyJobsAPI } from '../../../../lib/api';

export default function CompanyJobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    companyJobsAPI.get(id)
      .then((res) => setJob(res.data))
      .catch((err) => setError(err.data?.error || 'Job not found'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleUpdateStatus = async (appId, status) => {
    try {
      await companyJobsAPI.updateApplicationStatus(appId, status);
      // Optimistically update UI
      setJob({
        ...job,
        applications: job.applications.map(app => app.id === appId ? { ...app, status } : app)
      });
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <p style={{ color: '#7C8493', padding: '40px', textAlign: 'center' }}>Loading...</p>;
  if (error) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
      <Link href="/company/jobs" style={{ color: '#4640DE', fontWeight: '600' }}>← Return to Jobs</Link>
    </div>
  );
  if (!job) return null;

  const apps = job.applications || [];
  const isExpired = job.deadline && new Date(job.deadline) < new Date();

  return (
    <div>
      <Link href="/company/jobs" style={{ color: '#7C8493', textDecoration: 'none', fontSize: '13px', display: 'block', marginBottom: '8px' }}>← Back to My Jobs</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#25324B', margin: '0 0 4px', fontFamily: "'Clash Display', sans-serif" }}>{job.title}</h1>
          <p style={{ color: '#515B6F', fontSize: '14px', margin: 0 }}>{job.location || 'Remote'}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {job.is_featured && <span style={{ background: '#FFFBEB', color: '#92400E', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>⭐ Featured</span>}
          {isExpired && <span style={{ background: '#FEF2F2', color: '#DC2626', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Expired</span>}
        </div>
      </div>

      {/* Job Info Card */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E9EBEE', padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ background: '#F0F0FF', color: '#4640DE', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{job.category}</span>
          <span style={{ background: '#ECFDF5', color: '#059669', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{job.type}</span>
          {job.deadline && <span style={{ background: '#F8F8FD', color: '#515B6F', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' }}>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
        </div>
        {job.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {job.tags.map((t) => <span key={t} style={{ fontSize: '12px', background: '#F0F0FF', color: '#4640DE', padding: '3px 10px', borderRadius: '10px' }}>#{t}</span>)}
          </div>
        )}
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#25324B', margin: '0 0 12px' }}>Description</h3>
        <p style={{ color: '#515B6F', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0 }}>{job.description}</p>
      </div>

      {/* Applications */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E9EBEE', padding: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#25324B', margin: '0 0 20px' }}>Applications ({apps.length})</h2>
        {apps.length === 0 ? <p style={{ color: '#7C8493', fontSize: '14px' }}>No applications yet.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {apps.map((app) => (
              <div key={app.id} style={{ padding: '24px', background: '#F8F8FD', borderRadius: '12px', border: '1px solid #E9EBEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {app.user?.avatar_url ? (
                    <img src={app.user.avatar_url} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '48px', height: '48px', background: '#E9EBEE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C8493', fontWeight: 'bold' }}>
                      {app.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#25324B', margin: '0 0 4px', fontFamily: "'Clash Display', sans-serif" }}>{app.user?.name}</h3>
                    <p style={{ fontSize: '13px', color: '#515B6F', margin: '0 0 8px' }}>{app.user?.email}</p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '600', 
                        background: app.status === 'approved' ? '#ECFDF5' : app.status === 'rejected' ? '#FEF2F2' : '#F0F0FF',
                        color: app.status === 'approved' ? '#059669' : app.status === 'rejected' ? '#DC2626' : '#4640DE'
                      }}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      <span style={{ fontSize: '12px', color: '#7C8493' }}>• Applied {new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {app.user?.cv_url && (
                    <a href={app.user.cv_url} download={`CV_${app.user.name}.pdf`} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #D6DDEB', borderRadius: '8px', color: '#515B6F', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                      📄 View CV
                    </a>
                  )}
                  {app.status === 'pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(app.id, 'approved')} style={{ padding: '8px 16px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                        Approve
                      </button>
                      <button onClick={() => handleUpdateStatus(app.id, 'rejected')} style={{ padding: '8px 16px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
