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
  ];

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Epilogue', sans-serif", background: '#F8F8FD' }}>
        {/* Sidebar */}
        <aside style={{ width: '260px', background: '#fff', borderRight: '1px solid #E9EBEE', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
          <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #E9EBEE' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', background: '#4640DE', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: '600', fontSize: '20px', color: '#25324B' }}>QuickHire</span>
            </Link>
          </div>

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F0F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4640DE', fontWeight: 'bold' }}>
                    {user?.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#25324B', margin: 0 }}>{user?.name}</p>
                  <p style={{ fontSize: '11px', color: '#7C8493', margin: '2px 0 0' }}>{user?.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: '1px solid #E9EBEE', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', fontSize: '14px', color: '#DC2626' }}>↩</button>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, marginLeft: '260px', padding: '32px 40px', minHeight: '100vh' }}>
          {children}
        </main>
      </div>
    </UserContext.Provider>
  );
}
