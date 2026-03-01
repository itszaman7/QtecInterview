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
    { href: '/admin/companies', label: 'Manage Companies', icon: '🏢' },
    { href: '/admin/jobs', label: 'Review Jobs', icon: '💼' },
    { href: '/admin/payouts', label: 'Payout Requests', icon: '💰' },
  ];

  return (
    <AdminContext.Provider value={admin}>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Epilogue', sans-serif", background: '#f8fafc' }}>
        {/* Sidebar */}
        <aside style={{ width: '260px', background: '#ffffff', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, borderRight: '1px solid #f1f5f9' }}>
          {/* Logo */}
          <div style={{ padding: '32px 24px 40px' }}>
            <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#4f46e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '20px' }}>✦</span>
              </div>
              <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: '600', fontSize: '22px', color: '#0f172a' }}>Coursue</span>
            </Link>
          </div>

          <div style={{ padding: '0 24px', marginBottom: '16px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Overview</div>

          {/* Nav Links */}
          <nav style={{ padding: '0 16px', flex: 1 }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                  <span className="nav-icon">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ padding: '0 24px', marginBottom: '16px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Settings</div>
          
          <nav style={{ padding: '0 16px', paddingBottom: '24px' }}>
            <button onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '500', color: '#ef4444', transition: 'all 0.2s ease', textAlign: 'left' }}>
               <span className="nav-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>↩</span>
               Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, marginLeft: '260px', padding: '32px 40px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Top Bar Mimic */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', width: '400px', border: '1px solid #f1f5f9' }}>
               <span style={{ color: '#94a3b8' }}>🔍</span>
               <input type="text" placeholder="Search..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '14px', color: '#334155' }} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
               <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffffff', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                 🔔
               </button>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👨‍💼</div>
                 </div>
                 <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Admin</span>
               </div>
            </div>
          </header>
          
          <div style={{ flex: 1 }}>
            {children}
          </div>
        </main>
      </div>
    </AdminContext.Provider>
  );
}
