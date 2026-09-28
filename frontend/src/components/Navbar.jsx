import React, { useState } from 'react';
import { 
  Play, 
  Search, 
  User as UserIcon, 
  LogOut, 
  Settings, 
  Tv, 
  Menu,
  X
} from 'lucide-react';

export const Navbar = ({ 
  currentUser, 
  onOpenAuth, 
  onLogout, 
  onOpenSettings, 
  onNavigateChannel,
  searchQuery,
  setSearchQuery,
  backendConnected,
  toggleSidebar
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '68px',
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      gap: '20px'
    }}>
      {/* Left: Brand & Menu Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          style={{
            color: 'var(--text-muted)',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Menu size={22} />
        </button>

        <div 
          onClick={() => window.location.hash = ''} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer' 
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Play size={18} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '20px', 
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-main)'
            }}>
              Media<span style={{ color: 'var(--accent-primary)' }}>Hub</span>
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Search Bar */}
      <div style={{
        flex: 1,
        maxWidth: '560px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'absolute',
          left: '16px',
          color: 'var(--text-dim)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search videos, creators, topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            height: '42px',
            padding: '0 42px 0 46px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            fontSize: '14px',
            color: 'var(--text-main)',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '14px',
              color: 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Right: Actions & User Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Backend Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: backendConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.12)',
          border: `1px solid ${backendConnected ? 'rgba(52, 211, 153, 0.4)' : 'rgba(245, 158, 11, 0.3)'}`,
          fontSize: '11px',
          fontWeight: 600,
          color: backendConnected ? 'var(--accent-primary)' : 'var(--warning)'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: backendConnected ? 'var(--accent-primary)' : 'var(--warning)',
            boxShadow: `0 0 8px ${backendConnected ? 'var(--accent-primary)' : 'var(--warning)'}`
          }} />
          {backendConnected ? 'API Live' : 'Local Demo'}
        </div>

        {currentUser ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px',
                borderRadius: 'var(--radius-full)',
                background: dropdownOpen ? 'var(--bg-tertiary)' : 'transparent',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                alt={currentUser.fullName || currentUser.username}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  onClick={() => setDropdownOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 110 }} 
                />
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '240px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-active)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px',
                  zIndex: 120,
                  animation: 'fadeIn 0.15s ease'
                }}>
                  {/* User info header */}
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                      {currentUser.fullName || currentUser.username}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      @{currentUser.username}
                    </p>
                  </div>

                  <div style={{ padding: '6px 0' }}>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigateChannel(currentUser.username);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: 'var(--text-main)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Tv size={16} color="var(--accent-primary)" />
                      <span>My Channel</span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenSettings();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: 'var(--text-main)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Settings size={16} color="var(--text-muted)" />
                      <span>Profile & Settings</span>
                    </button>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: 'var(--danger)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onOpenAuth('login')}
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: 'var(--accent-primary)',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-glow)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
