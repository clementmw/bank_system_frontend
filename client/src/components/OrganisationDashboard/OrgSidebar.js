import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { navConfig, deptKeyMap } from './Navconfig';

// ─── Icon map ────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    grid: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    trend: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    chart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
    doc: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    swap: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
    report: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    lock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    people: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    warn: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    msg: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    logout: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    menu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    ),
    collapse: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    ),
  };
  return icons[name] ?? <span style={{ width: size, height: size, display: 'inline-block' }} />;
};

// ─── Dept accent colours ──────────────────────────────────────────────────────
const deptTheme = {
  finance:         { accent: '#10b981', label: 'Finance',          initial: 'FI' },
  hr:              { accent: '#50C878', label: 'Human Resources',  initial: 'HR' },
  it:              { accent: '#0ea5e9', label: 'IT & Tech',         initial: 'IT' },
  compliance:      { accent: '#f59e0b', label: 'Compliance & Legal',initial: 'CL' },
  operations:      { accent: '#ef4444', label: 'Operations',        initial: 'OP' },
  customerService: { accent: '#ec4899', label: 'Customer Service',  initial: 'CS' },
};

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
function OrgSidebar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ── Derive department from localStorage ─────────────────────────────────────
  const orgUser = JSON.parse(localStorage.getItem('org_user') || '{}');
  const rawDept = orgUser?.department?.toLowerCase() ?? '';
  const navKey  = deptKeyMap[rawDept] ?? rawDept;
  const nav     = navConfig[navKey] ?? [];
  const theme   = deptTheme[navKey] ?? { accent: '#6366f1', label: rawDept, initial: rawDept.slice(0,2).toUpperCase() };
  const user    = orgUser?.user ?? {};
  const role    = orgUser?.role ?? '';

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('org_user');
    if (onLogout) onLogout();
    else navigate('/login');
  };

  return (
    <>
      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          display: 'none',
          position: 'fixed', top: 16, left: 16, zIndex: 200,
          background: '#1e293b', border: 'none', borderRadius: 8,
          color: '#fff', padding: '8px', cursor: 'pointer',
        }}
        className="org-sidebar-hamburger"
        aria-label="Open sidebar"
      >
        <Icon name="menu" size={20} />
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 198, display: 'none',
          }}
          className="org-sidebar-overlay"
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        style={{
          width: collapsed ? 68 : 248,
          minHeight: '100vh',
          background: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
          position: 'relative',
          flexShrink: 0,
          zIndex: 199,
          borderRight: '1px solid #1e293b',
          overflow: 'hidden',
        }}
        className={`org-sidebar${mobileOpen ? ' mobile-open' : ''}`}
      >

        {/* ── Header ── */}
        <div style={{
          padding: collapsed ? '20px 0' : '20px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid #1e293b',
          gap: 8,
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                background: theme.accent + '22',
                border: `1.5px solid ${theme.accent}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: theme.accent,
                letterSpacing: '0.05em', fontFamily: 'monospace',
              }}>
                {theme.initial}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  color: '#f1f5f9', fontSize: 13, fontWeight: 600,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {theme.label}
                </div>
                <div style={{
                  color: theme.accent, fontSize: 10.5, textTransform: 'uppercase',
                  letterSpacing: '0.08em', fontWeight: 500,
                  fontFamily: 'monospace',
                }}>
                  {role || 'Staff'}
                </div>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: theme.accent + '22',
              border: `1.5px solid ${theme.accent}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: theme.accent,
              letterSpacing: '0.05em', fontFamily: 'monospace',
            }}>
              {theme.initial}
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{
              background: 'transparent', border: 'none', color: '#475569',
              cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex',
              transition: 'color 0.15s',
              transform: collapsed ? 'rotate(180deg)' : 'none',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
            onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name="collapse" size={16} />
          </button>
        </div>

        {/* ── Nav sections ── */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 0' }}>
          {nav.map((section) => (
            <div key={section.section} style={{ marginBottom: 4 }}>
              {/* Section label */}
              {!collapsed && (
                <div style={{
                  padding: '8px 16px 4px',
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#334155',
                  fontFamily: 'monospace',
                }}>
                  {section.section}
                </div>
              )}
              {collapsed && (
                <div style={{
                  height: 1, background: '#1e293b',
                  margin: '8px 12px 4px',
                }}/>
              )}

              {/* Nav items */}
              {section.items.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  collapsed={collapsed}
                  accent={theme.accent}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* ── User footer ── */}
        <div style={{
          borderTop: '1px solid #1e293b',
          padding: collapsed ? '12px 0' : '12px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: '#94a3b8', fontSize: 12,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {user.first_name ? `${user.first_name} ${user.last_name ?? ''}`.trim() : user.email ?? 'User'}
              </div>
              <div style={{
                color: '#475569', fontSize: 10.5,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user.email ?? ''}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'transparent', border: 'none',
              color: '#475569', cursor: 'pointer',
              padding: '6px', borderRadius: 6, display: 'flex',
              transition: 'color 0.15s, background 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#ef444415'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon name="logout" size={17} />
          </button>
        </div>
      </aside>

      {/* ── Responsive styles injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .org-sidebar { display: flex; }
        @media (max-width: 768px) {
          .org-sidebar { position: fixed; top: 0; left: 0; height: 100vh; transform: translateX(-100%); transition: transform 0.25s cubic-bezier(.4,0,.2,1), width 0.25s; }
          .org-sidebar.mobile-open { transform: translateX(0); }
          .org-sidebar-hamburger { display: flex !important; }
          .org-sidebar-overlay { display: block !important; }
        }
        .org-sidebar::-webkit-scrollbar { width: 0; }
      `}</style>
    </>
  );
}

// ─── Single nav item ──────────────────────────────────────────────────────────
function NavItem({ item, collapsed, accent }) {
  const location = useLocation();
  const isActive = location.pathname === item.path ||
                   (item.path !== '/' && location.pathname.startsWith(item.path + '/'));

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      style={({ isActive: routerActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 10,
        padding: collapsed ? '9px 0' : '8px 14px',
        margin: '1px 8px',
        borderRadius: 8,
        textDecoration: 'none',
        justifyContent: collapsed ? 'center' : 'flex-start',
        position: 'relative',
        background: isActive ? accent + '18' : 'transparent',
        color: isActive ? accent : '#64748b',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13.5,
        fontWeight: isActive ? 600 : 400,
        transition: 'background 0.15s, color 0.15s',
        cursor: 'pointer',
      })}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = '#1e293b';
          e.currentTarget.style.color = '#cbd5e1';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#64748b';
        }
      }}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span style={{
          position: 'absolute',
          left: -8, top: '50%', transform: 'translateY(-50%)',
          width: 3, height: '60%', borderRadius: 2,
          background: accent,
        }} />
      )}

      {/* Icon */}
      <span style={{ flexShrink: 0, display: 'flex', opacity: isActive ? 1 : 0.75 }}>
        <Icon name={item.icon} size={17} />
      </span>

      {/* Label + badge */}
      {!collapsed && (
        <>
          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.label}
          </span>
          {item.badge != null && (
            <span style={{
              fontSize: 10.5, fontWeight: 700, lineHeight: 1,
              padding: '2px 6px', borderRadius: 20,
              background: isActive ? accent + '33' : '#1e293b',
              color: isActive ? accent : '#64748b',
              fontFamily: 'monospace',
              flexShrink: 0,
            }}>
              {item.badge}
            </span>
          )}
        </>
      )}

      {/* Collapsed badge dot */}
      {collapsed && item.badge != null && (
        <span style={{
          position: 'absolute', top: 6, right: 8,
          width: 6, height: 6, borderRadius: '50%',
          background: accent,
        }} />
      )}
    </NavLink>
  );
}

export default OrgSidebar;