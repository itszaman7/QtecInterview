'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { jobsAPI } from '../../../../lib/api';

export default function AdminJobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    jobsAPI.get(id)
      .then((res) => setJob(res.data))
      .catch(() => router.push('/admin/jobs'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm(`Delete "${job.title}" and all its applications?`)) return;
    setDeleting(true);
    try {
      await jobsAPI.delete(id);
      router.push('/admin/jobs');
    } catch (err) {
      alert(err.data?.error || 'Failed to delete');
      setDeleting(false);
    }
  };

  if (loading) {
    return <p style={{ color: '#7C8493' }}>Loading job details...</p>;
  }

  if (!job) {
    return <p style={{ color: '#DC2626' }}>Job not found.</p>;
  }

  const applications = job.applications || [];

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '28px',
      }}>
        <div>
          <Link href="/admin/jobs" style={{
            color: '#7C8493',
            textDecoration: 'none',
            fontSize: '13px',
            display: 'block',
            marginBottom: '8px',
          }}>
            ← Back to Jobs
          </Link>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#25324B',
            margin: '0 0 4px',
            fontFamily: "'Clash Display', 'Epilogue', sans-serif",
          }}>
            {job.title}
          </h1>
          <p style={{ color: '#515B6F', fontSize: '14px', margin: 0 }}>
            {job.company} • {job.location || 'Remote'}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            padding: '10px 20px',
            background: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: deleting ? 'not-allowed' : 'pointer',
          }}
        >
          {deleting ? 'Deleting...' : '🗑 Delete Job'}
        </button>
      </div>

      {/* Job Details Card */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #E9EBEE',
        padding: '28px',
        marginBottom: '28px',
      }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <span style={{
            background: '#F0F0FF',
            color: '#4640DE',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            {job.category}
          </span>
          <span style={{
            background: '#ECFDF5',
            color: '#059669',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            {job.type}
          </span>
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#25324B', margin: '0 0 12px' }}>Description</h3>
        <p style={{
          color: '#515B6F',
          fontSize: '14px',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap',
          margin: 0,
        }}>
          {job.description}
        </p>
      </div>

      {/* Applications */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #E9EBEE',
        padding: '28px',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#25324B',
          margin: '0 0 20px',
        }}>
          Applications ({applications.length})
        </h2>

        {applications.length === 0 ? (
          <p style={{ color: '#7C8493', fontSize: '14px' }}>No applications yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applications.map((app) => (
              <div key={app.id} style={{
                padding: '20px',
                background: '#F8F8FD',
                borderRadius: '10px',
                border: '1px solid #F1F1F5',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '12px',
                }}>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#25324B', margin: '0 0 4px' }}>
                      {app.name}
                    </p>
                    <p style={{ fontSize: '13px', color: '#515B6F', margin: 0 }}>
                      {app.email}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: '#7C8493',
                  }}>
                    {new Date(app.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <a
                    href={app.resume_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '13px',
                      color: '#4640DE',
                      fontWeight: '500',
                      textDecoration: 'none',
                    }}
                  >
                    📄 View Resume →
                  </a>
                </div>

                {app.cover_note && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#7C8493', margin: '0 0 4px', fontWeight: '600' }}>Cover Note:</p>
                    <p style={{
                      fontSize: '13px',
                      color: '#515B6F',
                      lineHeight: '1.6',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {app.cover_note}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
