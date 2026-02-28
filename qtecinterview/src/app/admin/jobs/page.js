'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobsAPI } from '../../../lib/api';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchJobs = () => {
    setLoading(true);
    jobsAPI.list()
      .then((res) => setJobs(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}" and all its applications?`)) return;
    setDeleting(id);
    try {
      await jobsAPI.delete(id);
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      alert(err.data?.error || 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#25324B',
          margin: 0,
          fontFamily: "'Clash Display', 'Epilogue', sans-serif",
        }}>
          Job Listings
        </h1>
        <Link href="/admin/jobs/new" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 20px',
          background: '#4640DE',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '600',
        }}>
          + New Job
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#7C8493' }}>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #E9EBEE',
        }}>
          <p style={{ fontSize: '18px', color: '#7C8493', marginBottom: '16px' }}>No jobs yet</p>
          <Link href="/admin/jobs/new" style={{ color: '#4640DE', fontWeight: '600' }}>Create your first job →</Link>
        </div>
      ) : (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #E9EBEE',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E9EBEE', background: '#F8F8FD' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Title</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Company</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Category</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Type</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Location</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: '600', color: '#515B6F' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} style={{ borderBottom: '1px solid #F1F1F5' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <Link href={`/admin/jobs/${job.id}`} style={{
                      color: '#25324B',
                      fontWeight: '600',
                      textDecoration: 'none',
                    }}>
                      {job.title}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#515B6F' }}>{job.company}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: '#F0F0FF',
                      color: '#4640DE',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {job.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#515B6F' }}>{job.type}</td>
                  <td style={{ padding: '14px 20px', color: '#515B6F' }}>{job.location || '—'}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <Link href={`/admin/jobs/${job.id}`} style={{
                      color: '#4640DE',
                      textDecoration: 'none',
                      fontWeight: '500',
                      marginRight: '16px',
                      fontSize: '13px',
                    }}>
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id, job.title)}
                      disabled={deleting === job.id}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#DC2626',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '13px',
                      }}
                    >
                      {deleting === job.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
