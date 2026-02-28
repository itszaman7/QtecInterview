'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { companyJobsAPI } from '../../../lib/api';

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    companyJobsAPI.list()
      .then((res) => setJobs(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      await companyJobsAPI.delete(id);
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) { alert(err.data?.error || 'Failed'); }
    finally { setDeleting(null); }
  };

  const toggleFeatured = async (job) => {
    try {
      const res = await companyJobsAPI.update(job.id, { is_featured: !job.is_featured });
      setJobs(jobs.map((j) => j.id === job.id ? { ...j, is_featured: res.data.is_featured } : j));
    } catch (err) { alert(err.data?.error || 'Failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#25324B', margin: 0, fontFamily: "'Clash Display', sans-serif" }}>My Job Listings</h1>
        <Link href="/company/jobs/new" style={{ padding: '10px 20px', background: '#4640DE', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>+ Post Job</Link>
      </div>

      {loading ? <p style={{ color: '#7C8493' }}>Loading...</p> : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px solid #E9EBEE' }}>
          <p style={{ color: '#7C8493', marginBottom: '16px' }}>No jobs posted yet</p>
          <Link href="/company/jobs/new" style={{ color: '#4640DE', fontWeight: '600' }}>Post your first job →</Link>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E9EBEE', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E9EBEE', background: '#F8F8FD' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Title</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Category</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Type</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontWeight: '600', color: '#515B6F' }}>Featured</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontWeight: '600', color: '#515B6F' }}>Applicants</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Deadline</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: '600', color: '#515B6F' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} style={{ borderBottom: '1px solid #F1F1F5' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <Link href={`/company/jobs/${job.id}`} style={{ color: '#25324B', fontWeight: '600', textDecoration: 'none' }}>{job.title}</Link>
                    {job.tags?.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                        {job.tags.map((t) => <span key={t} style={{ fontSize: '10px', background: '#F0F0FF', color: '#4640DE', padding: '2px 8px', borderRadius: '10px' }}>{t}</span>)}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px' }}><span style={{ background: '#F0F0FF', color: '#4640DE', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{job.category}</span></td>
                  <td style={{ padding: '14px 20px', color: '#515B6F' }}>{job.type}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <button onClick={() => toggleFeatured(job)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} title={job.is_featured ? 'Remove featured' : 'Make featured'}>
                      {job.is_featured ? '⭐' : '☆'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#515B6F', fontWeight: '600' }}>{job.applicant_count || 0}</td>
                  <td style={{ padding: '14px 20px', color: '#515B6F', fontSize: '13px' }}>
                    {job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <Link href={`/company/jobs/${job.id}`} style={{ color: '#4640DE', textDecoration: 'none', fontWeight: '500', marginRight: '16px', fontSize: '13px' }}>View</Link>
                    <button onClick={() => handleDelete(job.id, job.title)} disabled={deleting === job.id} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>
                      {deleting === job.id ? '...' : 'Delete'}
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
