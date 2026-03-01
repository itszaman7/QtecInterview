'use client';

import { useState } from 'react';
import { useAdmin } from '../layout';

export default function AdminPayoutsPage() {
  const admin = useAdmin();
  const [payouts] = useState([
    { id: 1, company: 'TechFlow Inc.', amount: '$2,400', status: 'pending', date: '2026-03-01' },
    { id: 2, company: 'Nexus Solutions', amount: '$1,850', status: 'pending', date: '2026-03-01' },
    { id: 3, company: 'Global Logistics', amount: '$3,100', status: 'approved', date: '2026-02-28' },
    { id: 4, company: 'HealthQuest', amount: '$950', status: 'pending', date: '2026-03-02' },
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#25324B', margin: 0, fontFamily: "'Clash Display', sans-serif" }}>Payout Requests</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '10px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Export CSV</button>
          <button style={{ padding: '10px 20px', background: '#4640DE', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>Process All</button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E9EBEE', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E9EBEE', background: '#F8F8FD' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Company</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Amount</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Date</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: '#515B6F' }}>Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: '600', color: '#515B6F' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #F1F1F5' }}>
                <td style={{ padding: '14px 20px', fontWeight: '600', color: '#25324B' }}>{p.company}</td>
                <td style={{ padding: '14px 20px', color: '#10B981', fontWeight: '700' }}>{p.amount}</td>
                <td style={{ padding: '14px 20px', color: '#515B6F' }}>{p.date}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: p.status === 'approved' ? '#ECFDF5' : '#FFFBEB',
                    color: p.status === 'approved' ? '#059669' : '#D97706'
                  }}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  {p.status === 'pending' ? (
                    <button style={{ color: '#4640DE', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                      Approve Payout
                    </button>
                  ) : (
                    <span style={{ color: '#94A3B8', fontSize: '13px' }}>Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
