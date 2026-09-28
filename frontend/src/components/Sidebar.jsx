import React from 'react';
import { 
  Home, 
  Flame, 
  History, 
  Bookmark, 
  Tv, 
  ThumbsUp, 
  Sparkles 
} from 'lucide-react';

export const Sidebar = ({ 
  currentTab, 
  setCurrentTab, 
  isOpen, 
  currentUser,
  onNavigateChannel,
  onOpenSettings
}) => {
  const mainNav = [
    { id: 'home', label: 'Home Feed', icon: Home },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'subscriptions', label: 'Subscriptions', icon: Tv },
  ];

  const libraryNav = [
    { id: 'history', label: 'Watch History', icon: History, requiresAuth: true },
    { id: 'liked', label: 'Liked Videos', icon: ThumbsUp, requiresAuth: true },
    { id: 'saved', label: 'Saved Library', icon: Bookmark, requiresAuth: true },
  ];

  if (!isOpen) {
    return (
      <aside style={{
        width: '72px',
        backgroundColor: 'var(--bg-primary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        gap: '24px',
        height: 'calc(100vh - 68px)',
        position: 'sticky',
        top: '68px',
        flexShrink: 0
      }}>
        {mainNav.concat(libraryNav.slice(0, 2)).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              title={item.label}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isActive ? 'var(--accent-tint)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent'
              }}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </aside>
    );
  }

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--bg-primary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px',
      gap: '24px',
      height: 'calc(100vh - 68px)',
      position: 'sticky',
      top: '68px',
      overflowY: 'auto',
      flexShrink: 0
    }}>
      {/* Main Discover */}
      <div>
        <p style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-dim)',
          padding: '0 12px 8px 12px'
        }}>
          Discover
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--accent-tint)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--border-active)' : '1px solid transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'inherit'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Library Section */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-dim)',
          padding: '0 12px 8px 12px'
        }}>
          My Activity
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {libraryNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--accent-tint)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--border-active)' : '1px solid transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'inherit'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Creator Channel */}
      {currentUser && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-dim)',
            padding: '0 12px 8px 12px'
          }}>
            Creator Studio
          </p>
          <button
            onClick={() => onNavigateChannel(currentUser.username)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <img
              src={currentUser.avatar}
              alt=""
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ textAlign: 'left', overflow: 'hidden' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser.fullName}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                View Channel
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Footer Info Box */}
      <div style={{
        marginTop: 'auto',
        padding: '14px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%)',
        border: '1px solid var(--border-active)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>MediaHub Studio</span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Connected to Node.js & MongoDB backend with Dual-token JWT rotation.
        </p>
      </div>
    </aside>
  );
};
