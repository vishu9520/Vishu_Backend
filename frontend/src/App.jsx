import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  Play, 
  Compass, 
  Filter, 
  Tv, 
  Users, 
  FolderPlus,
  RefreshCw
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { VideoCard } from './components/VideoCard';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { ChannelView } from './components/ChannelView';
import { WatchHistoryView } from './components/WatchHistoryView';
import { ToastContainer } from './components/Toast';
import { INITIAL_VIDEOS } from './data/mockVideos';
import { authService, getAccessToken } from './services/api';

const CATEGORIES = ['All', 'Coding', 'Gaming', 'Tech', 'Music'];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState('home'); // home, trending, subscriptions, history, channel
  const [activeChannelUsername, setActiveChannelUsername] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // History & Toasts
  const [localHistory, setLocalHistory] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check auth and backend health on load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await authService.getCurrentUser();
        if (res.data) {
          setCurrentUser(res.data);
          setBackendConnected(true);
        }
      } catch (err) {
        // If current user is not logged in or backend is offline
        if (err.response?.status === 401) {
          setBackendConnected(true); // backend is alive, just not logged in
        } else {
          setBackendConnected(false);
        }
      }
    };

    checkAuthStatus();

    // Listen for session expiry event
    const handleSessionExpired = () => {
      setCurrentUser(null);
      addToast('Session expired. Please log in again.', 'warning');
    };

    window.addEventListener('mediahub:session-expired', handleSessionExpired);
    return () => window.removeEventListener('mediahub:session-expired', handleSessionExpired);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      addToast('Logged out successfully', 'success');
      if (currentTab === 'channel' && activeChannelUsername === currentUser?.username) {
        setCurrentTab('home');
      }
    } catch (err) {
      setCurrentUser(null);
      addToast('Logged out', 'info');
    }
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    // Record to watch history
    setLocalHistory((prev) => {
      const filtered = prev.filter((v) => v._id !== video._id);
      return [video, ...filtered];
    });
  };

  const handleNavigateChannel = (username) => {
    setActiveChannelUsername(username);
    setCurrentTab('channel');
  };

  // Filtering videos
  const filteredVideos = INITIAL_VIDEOS.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.owner?.fullName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || video.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onNavigateChannel={handleNavigateChannel}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        backendConnected={backendConnected}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Layout Container */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            if (tab !== 'channel') setActiveChannelUsername(null);
          }}
          isOpen={sidebarOpen}
          currentUser={currentUser}
          onNavigateChannel={handleNavigateChannel}
          onOpenSettings={() => setSettingsModalOpen(true)}
        />

        {/* Content Area */}
        <main style={{ flex: 1, backgroundColor: 'var(--bg-primary)', overflowY: 'auto' }}>
          {currentTab === 'channel' ? (
            <ChannelView
              username={activeChannelUsername || currentUser?.username || 'vishu_dev'}
              currentUser={currentUser}
              onBack={() => setCurrentTab('home')}
              onSelectVideo={handleSelectVideo}
              onOpenSettings={() => setSettingsModalOpen(true)}
              videos={INITIAL_VIDEOS}
              onShowToast={addToast}
            />
          ) : currentTab === 'history' ? (
            <WatchHistoryView
              currentUser={currentUser}
              onSelectVideo={handleSelectVideo}
              onBack={() => setCurrentTab('home')}
              localHistory={localHistory}
              onClearHistory={() => setLocalHistory([])}
              onShowToast={addToast}
            />
          ) : (
            <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Category Filter Pills */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '13px',
                        fontWeight: 600,
                        backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: isSelected ? '#ffffff' : 'var(--text-main)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Hero Showcase Banner */}
              {!searchQuery && selectedCategory === 'All' && currentTab === 'home' && (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 40%, #ffffff 100%)',
                  border: '1px solid var(--border-active)',
                  padding: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '30px',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <div style={{ maxWidth: '600px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(16, 185, 129, 0.18)',
                      border: '1px solid var(--accent-primary)',
                      color: 'var(--accent-primary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      marginBottom: '14px'
                    }}>
                      <Sparkles size={14} />
                      <span>FEATURED MASTERCLASS</span>
                    </div>

                    <h1 style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px', color: 'var(--text-main)' }}>
                      Production Video Platform Fullstack Architecture
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                      Explore how this application connects a dual-token JWT Node.js backend with Multer & Cloudinary media pipelines to deliver ultra-fast streaming and responsive frontend interactions.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <button
                        onClick={() => handleSelectVideo(INITIAL_VIDEOS[0])}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 24px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--accent-primary)',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: 700,
                          boxShadow: 'var(--shadow-glow)'
                        }}
                      >
                        <Play size={18} fill="#ffffff" color="#ffffff" />
                        <span>Watch Now</span>
                      </button>

                      <button
                        onClick={() => handleNavigateChannel(INITIAL_VIDEOS[0].owner.username)}
                        style={{
                          padding: '12px 20px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-main)',
                          fontSize: '14px',
                          fontWeight: 600,
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        View Channel
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Banner Preview */}
                  <div 
                    onClick={() => handleSelectVideo(INITIAL_VIDEOS[0])}
                    style={{
                      position: 'relative',
                      width: '380px',
                      aspectRatio: '16 / 9',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-lg)',
                      cursor: 'pointer',
                      flexShrink: 0,
                      border: '1px solid var(--border-active)',
                      backgroundColor: '#1e293b'
                    }}
                  >
                    <img
                      src={INITIAL_VIDEOS[0].thumbnail}
                      alt="Banner Preview"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-glow)'
                      }}>
                        <Play size={24} fill="#ffffff" color="#ffffff" style={{ marginLeft: '3px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Videos Grid */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700 }}>
                    {searchQuery ? `Search Results for "${searchQuery}"` : currentTab === 'trending' ? '🔥 Trending Right Now' : 'Recommended Videos'}
                  </h2>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                    Showing {filteredVideos.length} streams
                  </span>
                </div>

                {filteredVideos.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      No videos found matching your filter
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Try adjusting your search terms or selecting 'All' categories.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                  }}>
                    {filteredVideos.map((video) => (
                      <VideoCard
                        key={video._id}
                        video={video}
                        onSelectVideo={handleSelectVideo}
                        onNavigateChannel={handleNavigateChannel}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          currentUser={currentUser}
          onNavigateChannel={handleNavigateChannel}
          onShowToast={addToast}
        />
      )}

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        initialMode={authMode}
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setBackendConnected(true);
        }}
        onShowToast={addToast}
      />

      {/* Settings Modal (Update Details, Avatar, Cover, Password) */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        currentUser={currentUser}
        onUserUpdated={(updatedUser) => {
          setCurrentUser(updatedUser);
        }}
        onShowToast={addToast}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
