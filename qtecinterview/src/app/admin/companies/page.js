'use client';

import { useEffect, useState } from 'react';
import { adminCompaniesAPI } from '../../../lib/api';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    adminCompaniesAPI.list()
      .then((res) => setCompanies(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id) => {
    setToggling(id);
    try {
      const res = await adminCompaniesAPI.verify(id);
      setCompanies(companies.map((c) => c.id === id ? res.data : c));
    } catch (err) { alert(err.data?.error || 'Failed'); }
    finally { setToggling(null); }
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#25324B', margin: '0 0 28px', fontFamily: "'Clash Display', sans-serif" }}>Manage Companies</h1>

      {loading ? <p style={{ color: '#7C8493' }}>Loading...</p> : companies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px solid #E9EBEE' }}>
          <p style={{ color: '#7C8493' }}>No companies registered yet.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E9EBEE', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E9EBEE', background: '#F8F8FD' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Company</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Email</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Location</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontWeight: '600', color: '#515B6F' }}>Jobs</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontWeight: '600', color: '#515B6F' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: '600', color: '#515B6F' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #F1F1F5' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <p style={{ fontWeight: '600', color: '#25324B', margin: 0 }}>{c.name}</p>
                    {c.website && <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#4640DE' }}>{c.website}</a>}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#515B6F' }}>{c.email}</td>
                  <td style={{ padding: '14px 20px', color: '#515B6F' }}>{c.location || '—'}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: '600', color: '#515B6F' }}>{c.job_count || 0}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: c.is_verified ? '#ECFDF5' : '#FEF3C7',
                      color: c.is_verified ? '#059669' : '#92400E',
                    }}>
                      {c.is_verified ? '✅ Verified' : '⏳ Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleVerify(c.id)}
                      disabled={toggling === c.id}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: toggling === c.id ? 'not-allowed' : 'pointer',
                        background: c.is_verified ? '#FEF2F2' : '#ECFDF5',
                        color: c.is_verified ? '#DC2626' : '#059669',
                      }}
                    >
                      {toggling === c.id ? '...' : c.is_verified ? 'Revoke' : 'Verify'}
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
