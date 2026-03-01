'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { userAuthAPI } from '../../lib/api';

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

export default function UserLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAuthAPI.getMe()
      .then((res) => setUser(res.data))
      .catch((err) => {
        userAuthAPI.logout().catch(() => {}).finally(() => {
          router.push('/login');
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await userAuthAPI.logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F8FD', fontFamily: "'Epilogue', sans-serif" }}>
        <p style={{ color: '#7C8493' }}>Loading...</p>
      </div>
    );
  }

  const navLinks = [
    { href: '/dashboard', label: 'My Applications', icon: '📝' },
    { href: '/jobs', label: 'Find Jobs', icon: '🔍' },
    { href: '/dashboard/settings', label: 'Account Settings', icon: '⚙️' },
  ];

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Epilogue', sans-serif", background: '#f8fafc' }}>
        {/* Sidebar */}
        <aside style={{ width: '260px', background: '#ffffff', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, borderRight: '1px solid #f1f5f9' }}>
          {/* Logo */}
          <div style={{ padding: '32px 24px 40px' }}>
            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
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
               <input type="text" placeholder="Search for jobs..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '14px', color: '#334155' }} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
               <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffffff', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                 <span style={{ position: 'relative' }}>
                   ✉
                 </span>
               </button>
               <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffffff', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                 <span style={{ position: 'relative' }}>
                   🔔
                   <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }}></span>
                 </span>
               </button>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', overflow: 'hidden', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{user?.name?.charAt(0) || 'U'}</div>
                    )}
                 </div>
                 <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{user?.name?.split(' ')[0] || 'Applicant'}</span>
               </div>
            </div>
          </header>
          
          <div style={{ flex: 1 }}>
            {children}
          </div>
        </main>
      </div>
    </UserContext.Provider>
  );
}
