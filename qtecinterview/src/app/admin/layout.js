'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../../lib/api';

const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Skip auth check on login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    authAPI.getMe()
      .then((res) => setAdmin(res.data))
      .catch((err) => {
        authAPI.logout().catch(() => {}).finally(() => {
          router.push('/admin/login');
        });
      })
      .finally(() => setLoading(false));
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await authAPI.logout();
    router.push('/admin/login');
  };

  // Login page — no sidebar/header
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8F8FD',
        fontFamily: "'Epilogue', sans-serif",
      }}>
        <p style={{ color: '#7C8493', fontSize: '16px' }}>Loading...</p>
      </div>
    );
  }

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/jobs', label: 'Jobs', icon: '💼' },
    { href: '/admin/jobs/new', label: 'Create Job', icon: '➕' },
    { href: '/admin/companies', label: 'Companies', icon: '🏢' },
  ];

  return (
    <AdminContext.Provider value={admin}>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'Epilogue', sans-serif",
        background: '#F8F8FD',
      }}>
        {/* Sidebar */}
        <aside style={{
          width: '260px',
          background: '#fff',
          borderRight: '1px solid #E9EBEE',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
        }}>
          {/* Logo */}
          <div style={{
            padding: '24px 24px 20px',
            borderBottom: '1px solid #E9EBEE',
          }}>
            <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: '#4640DE',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <span style={{
                fontFamily: "'Clash Display', 'Epilogue', sans-serif",
                fontWeight: '600',
                fontSize: '20px',
                color: '#25324B',
              }}>QuickHire</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav style={{ padding: '16px 12px', flex: 1 }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '4px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? '#4640DE' : '#515B6F',
                    background: isActive ? '#F0F0FF' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Admin Info + Logout */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #E9EBEE',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#25324B', margin: 0 }}>
                  {admin?.email}
                </p>
                <p style={{ fontSize: '11px', color: '#7C8493', margin: '2px 0 0' }}>
                  Administrator
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                style={{
                  background: 'none',
                  border: '1px solid #E9EBEE',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#DC2626',
                }}
              >
                ↩
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{
          flex: 1,
          marginLeft: '260px',
          padding: '32px 40px',
          minHeight: '100vh',
        }}>
          {children}
        </main>
      </div>
    </AdminContext.Provider>
  );
}
