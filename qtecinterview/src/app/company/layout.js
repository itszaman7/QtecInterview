'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { companyAuthAPI } from '../../lib/api';

const CompanyContext = createContext(null);
export const useCompany = () => useContext(CompanyContext);

export default function CompanyLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPublicPage = pathname === '/company/login' || pathname === '/company/register';

  useEffect(() => {
    if (isPublicPage) { setLoading(false); return; }
    companyAuthAPI.getMe()
      .then((res) => setCompany(res.data))
      .catch((err) => {
        // If token is invalid/expired/db wiped, force logout to clear cookie
        companyAuthAPI.logout().catch(() => {}).finally(() => {
          router.push('/company/login');
        });
      })
      .finally(() => setLoading(false));
  }, [isPublicPage, router]);

  const handleLogout = async () => {
    await companyAuthAPI.logout();
    router.push('/company/login');
  };

  if (isPublicPage) return <>{children}</>;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F8FD', fontFamily: "'Epilogue', sans-serif" }}>
        <p style={{ color: '#7C8493' }}>Loading...</p>
      </div>
    );
  }

  const navLinks = [
    { href: '/company', label: 'Dashboard', icon: '📊' },
    { href: '/company/jobs', label: 'My Jobs', icon: '💼' },
    { href: '/company/jobs/new', label: 'Post Job', icon: '➕' },
  ];

  return (
    <CompanyContext.Provider value={company}>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Epilogue', sans-serif", background: '#F8F8FD' }}>
        {/* Sidebar */}
        <aside style={{ width: '260px', background: '#fff', borderRight: '1px solid #E9EBEE', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
          <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #E9EBEE' }}>
            <Link href="/company" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', background: '#4640DE', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: '600', fontSize: '20px', color: '#25324B' }}>QuickHire</span>
            </Link>
          </div>

          {/* Verification Banner */}
          {company && !company.is_verified && (
            <div style={{ margin: '12px', padding: '12px 16px', background: '#FEF3C7', borderRadius: '8px', border: '1px solid #FDE68A' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#92400E', margin: '0 0 2px' }}>⏳ Pending Verification</p>
              <p style={{ fontSize: '11px', color: '#A16207', margin: 0 }}>Admin approval required to post jobs.</p>
            </div>
          )}

          <nav style={{ padding: '16px 12px', flex: 1 }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', marginBottom: '4px', textDecoration: 'none', fontSize: '14px',
                  fontWeight: isActive ? '600' : '500', color: isActive ? '#4640DE' : '#515B6F', background: isActive ? '#F0F0FF' : 'transparent',
                }}>
                  <span style={{ fontSize: '18px' }}>{link.icon}</span>{link.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ padding: '16px 20px', borderTop: '1px solid #E9EBEE' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#25324B', margin: 0 }}>{company?.name}</p>
                <p style={{ fontSize: '11px', color: '#7C8493', margin: '2px 0 0' }}>{company?.email}</p>
              </div>
              <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: '1px solid #E9EBEE', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', fontSize: '14px', color: '#DC2626' }}>↩</button>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, marginLeft: '260px', padding: '32px 40px', minHeight: '100vh' }}>
          {children}
        </main>
      </div>
    </CompanyContext.Provider>
  );
}
