'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobsAPI, adminCompaniesAPI } from '../../lib/api';
import { useAdmin } from './layout';

export default function AdminDashboard() {
  const admin = useAdmin();
  const [stats, setStats] = useState({ total: 0, categories: {} });
  const [companyStats, setCompanyStats] = useState({ total: 0, pending: 0, pendingList: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobsAPI.list().catch(() => ({ data: [] })),
      adminCompaniesAPI.list().catch(() => ({ data: [] }))
    ]).then(([jobsRes, companiesRes]) => {
      // Process Jobs
      const jobs = jobsRes.data || [];
      const categories = {};
      jobs.forEach((job) => {
        categories[job.category] = (categories[job.category] || 0) + 1;
      });
      setStats({ total: jobs.length, categories });

      // Process Companies
      const companies = companiesRes.data || [];
      const pendingCompanies = companies.filter(c => !c.is_verified);
      setCompanyStats({
        total: companies.length,
        pending: pendingCompanies.length,
        pendingList: pendingCompanies.slice(0, 3) // Preview of up to 3 pending companies
      });
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id, e) => {
    e.preventDefault();
    try {
      await adminCompaniesAPI.verify(id);
      // Optimistically remove from pending list
      setCompanyStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        pendingList: prev.pendingList.filter(c => c.id !== id)
      }));
    } catch (err) {
      alert(err.data?.error || 'Failed to verify company');
    }
  };

  const statCards = [
    { label: 'Total Jobs', value: stats.total, color: '#4640DE', bg: '#F0F0FF', icon: '💼' },
    { label: 'Companies', value: companyStats.total, color: '#0EA5E9', bg: '#F0F9FF', icon: '🏢' },
    { label: 'Pending Approvals', value: companyStats.pending, color: '#F59E0B', bg: '#FFFBEB', icon: '⏳' },
    { label: 'Total Payouts', value: '$12,450', color: '#10B981', bg: '#ECFDF5', icon: '💰' },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner" style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          margin: '0 0 12px',
          fontFamily: "'Clash Display', sans-serif",
          position: 'relative',
          zIndex: 10
        }}>
          Manage Your Platform with Ease
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.9, margin: '0 0 24px', maxWidth: '500px', position: 'relative', zIndex: 10 }}>
          Welcome back{admin?.email ? `, ${admin.email.split('@')[0]}` : ''}. Overview of all platform activities, jobs, and companies.
        </p>
        <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 10 }}>
          <Link href="/admin/companies" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.15)',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '30px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '15px',
            border: '1px solid rgba(255,255,255,0.3)',
            transition: 'background 0.2s',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
            Manage Companies
          </Link>
          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            color: '#4f46e5',
            padding: '12px 24px',
            borderRadius: '30px',
            border: 'none',
            fontWeight: '600',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            Financial Reports
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Main Content Area */}
        <div style={{ flex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Platform Statistics</h2>
            <span style={{ fontSize: '24px', color: '#cbd5e1', cursor: 'pointer' }}>⋮</span>
          </div>

          {/* Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '40px',
          }}>
            {statCards.map((card) => (
              <div key={card.label} className="dashboard-card" style={{ padding: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, fontSize: '20px', marginBottom: '16px' }}>
                  {card.icon}
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px', fontWeight: '600' }}>{card.label}</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <p style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', margin: 0, lineHeight: 1 }}>
                    {loading ? '—' : card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Jobs by Category</h2>
            <Link href="/admin/jobs" style={{ fontSize: '14px', fontWeight: '600', color: '#4f46e5', textDecoration: 'none' }}>See all</Link>
          </div>

          {/* Category Breakdown */}
          <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Loading categories...</div>
            ) : Object.keys(stats.categories).length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', margin: '0 0 16px' }}>No jobs yet.</p>
                <p style={{ color: '#4f46e5', fontWeight: '600', fontSize: '14px', margin: 0 }}>Waiting for companies to post jobs</p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span>Category</span>
                  <span style={{ textAlign: 'right' }}>Job Count</span>
                </div>
                {Object.entries(stats.categories).map(([cat, count], idx, arr) => (
                  <div key={cat} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    padding: '20px 24px',
                    borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #f1f5f9',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontSize: '16px' }}>
                         ✦
                       </div>
                       <span style={{ fontSize: '15px', fontWeight: '600', color: '#334155' }}>{cat}</span>
                    </div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#4f46e5',
                      textAlign: 'right'
                    }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Pending Verifications Card */}
          <div className="dashboard-card" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fef3c7 100%)', borderColor: '#fde68a' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#92400e', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⏳</span> Action Required
                </h3>
                <span style={{ background: '#f59e0b', color: '#fff', fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
                  {companyStats.pending} pending
                </span>
             </div>
             
             {loading ? (
               <p style={{ fontSize: '13px', color: '#92400e', textAlign: 'center' }}>Loading...</p>
             ) : companyStats.pending === 0 ? (
               <div style={{ textAlign: 'center', padding: '16px 0' }}>
                 <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</div>
                 <p style={{ margin: 0, fontSize: '14px', color: '#92400e', fontWeight: '500' }}>All companies verified!</p>
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {companyStats.pendingList.map(c => (
                    <div key={c.id} style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #fde68a', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                         <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{c.name}</span>
                         <span style={{ fontSize: '12px', color: '#d97706', fontWeight: '600' }}>New</span>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{c.location || 'Location missing'}</span>
                          <button onClick={(e) => handleVerify(c.id, e)} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#d97706'} onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}>
                            Verify
                          </button>
                       </div>
                    </div>
                  ))}
                  {companyStats.pending > 3 && (
                    <Link href="/admin/companies" style={{ textAlign: 'center', fontSize: '13px', color: '#b45309', fontWeight: '600', textDecoration: 'underline', marginTop: '4px' }}>
                      View all {companyStats.pending} pending companies
                    </Link>
                  )}
               </div>
             )}
          </div>

          {/* New Payouts Card */}
          <div className="dashboard-card" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #ecfdf5 100%)', borderColor: '#a7f3d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#065f46', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>💰</span> Payout Requests
              </h3>
              <span style={{ background: '#10b981', color: '#fff', fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
                3 active
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'TechFlow Inc.', amount: '$2,400', date: '2h ago' },
                { name: 'Nexus Solutions', amount: '$1,850', date: '5h ago' }
              ].map((p, i) => (
                <div key={i} style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #d1fae5' }}>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{p.date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#10b981' }}>{p.amount}</p>
                    <button style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '11px', fontWeight: '700', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>Approve</button>
                  </div>
                </div>
              ))}
              <button style={{ width: '100%', padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: '1px solid #10b981', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}>
                Manage All Payouts
              </button>
            </div>
          </div>

          <div className="dashboard-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Quick Actions</h3>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>+</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <Link href="/admin/jobs" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', textDecoration: 'none', transition: 'background 0.2s', border: '1px solid transparent' }} onMouseEnter={e => {e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'}} onMouseLeave={e => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'}}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💼</div>
                 <div style={{ flex: 1 }}>
                   <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Review Jobs</p>
                   <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Manage all postings</p>
                 </div>
               </Link>
               <Link href="/admin/companies" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', textDecoration: 'none', transition: 'background 0.2s', border: '1px solid transparent' }} onMouseEnter={e => {e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'}} onMouseLeave={e => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'}}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏢</div>
                 <div style={{ flex: 1 }}>
                   <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Manage Companies</p>
                   <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Approve new employers</p>
                 </div>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

