'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobsAPI } from '../../lib/api';
import { useAdmin } from './layout';

export default function AdminDashboard() {
  const admin = useAdmin();
  const [stats, setStats] = useState({ total: 0, categories: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsAPI.list().then((res) => {
      const jobs = res.data || [];
      const categories = {};
      jobs.forEach((job) => {
        categories[job.category] = (categories[job.category] || 0) + 1;
      });
      setStats({ total: jobs.length, categories });
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Jobs', value: stats.total, color: '#4640DE', bg: '#F0F0FF' },
    { label: 'Categories', value: Object.keys(stats.categories).length, color: '#0EA5E9', bg: '#F0F9FF' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#25324B',
          margin: '0 0 8px',
          fontFamily: "'Clash Display', 'Epilogue', sans-serif",
        }}>
          Good morning{admin?.email ? `, ${admin.email.split('@')[0]}` : ''}
        </h1>
        <p style={{ color: '#7C8493', fontSize: '14px', margin: 0 }}>
          Here's what's happening with QuickHire today.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}>
        {statCards.map((card) => (
          <div key={card.label} style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #E9EBEE',
          }}>
            <p style={{ fontSize: '13px', color: '#7C8493', margin: '0 0 8px', fontWeight: '500' }}>
              {card.label}
            </p>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: card.color,
              margin: 0,
              fontFamily: "'Clash Display', sans-serif",
            }}>
              {loading ? '—' : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #E9EBEE',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#25324B',
          margin: '0 0 20px',
        }}>Jobs by Category</h2>
        {loading ? (
          <p style={{ color: '#7C8493' }}>Loading...</p>
        ) : Object.keys(stats.categories).length === 0 ? (
          <p style={{ color: '#7C8493' }}>No jobs yet. <Link href="/admin/jobs/new" style={{ color: '#4640DE' }}>Create your first job →</Link></p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(stats.categories).map(([cat, count]) => (
              <div key={cat} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#F8F8FD',
                borderRadius: '8px',
              }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#25324B' }}>{cat}</span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#4640DE',
                  background: '#F0F0FF',
                  padding: '4px 12px',
                  borderRadius: '20px',
                }}>
                  {count} {count === 1 ? 'job' : 'jobs'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        gap: '12px',
      }}>
        <Link href="/admin/jobs/new" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: '#4640DE',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '600',
        }}>
          ➕ Create Job
        </Link>
        <Link href="/admin/jobs" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: '#fff',
          color: '#4640DE',
          border: '1px solid #4640DE',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '600',
        }}>
          💼 View All Jobs
        </Link>
      </div>
    </div>
  );
}
