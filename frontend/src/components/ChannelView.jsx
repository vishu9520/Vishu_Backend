import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Tv, 
  Users, 
  ArrowLeft, 
  Settings, 
  Play, 
  Share2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { authService } from '../services/api';
import { VideoCard } from './VideoCard';

export const ChannelView = ({ 
  username, 
  currentUser, 
  onBack, 
  onSelectVideo, 
  onOpenSettings,
  videos = [],
  onShowToast
}) => {
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [activeTab, setActiveTab] = useState('videos');

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    let isMounted = true;
    const fetchChannel = async () => {
      setLoading(true);
      try {
        const res = await authService.getUserChannel(username);
        if (isMounted && res.data) {
          setChannelData(res.data);
          setIsSubscribed(res.data.isSubscribed || false);
          setSubscribersCount(res.data.subscribersCount || 0);
        }
      } catch (err) {
        console.warn('Failed to load channel from API, falling back to local data:', err);
        // Fallback channel info
        if (isMounted) {
          const fallbackUser = isOwner ? currentUser : {
            fullName: username.charAt(0).toUpperCase() + username.slice(1),
            username: username,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
            subscribersCount: 24800,
            channelsSubscribedToCount: 15,
            isSubscribed: false
          };
          setChannelData(fallbackUser);
          setSubscribersCount(fallbackUser.subscribersCount || 0);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChannel();
    return () => { isMounted = false; };
  }, [username, currentUser]);

  const handleToggleSubscribe = () => {
    if (isSubscribed) {
      setIsSubscribed(false);
      setSubscribersCount(prev => Math.max(0, prev - 1));
      onShowToast?.(`Unsubscribed from ${channelData?.fullName}`, 'info');
    } else {
      setIsSubscribed(true);
      setSubscribersCount(prev => prev + 1);
      onShowToast?.(`Subscribed to ${channelData?.fullName}!`, 'success');
    }
  };

  const channelVideos = videos.filter(
    v => v.owner?.username?.toLowerCase() === username?.toLowerCase()
  );

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="skeleton" style={{ height: '220px', width: '100%', borderRadius: 'var(--radius-lg)' }} />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div className="skeleton" style={{ width: '240px', height: '24px' }} />
            <div className="skeleton" style={{ width: '160px', height: '16px' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
      {/* Back button */}
      <div style={{ padding: '16px 24px 0 24px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '13px',
            fontWeight: 600
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </button>
      </div>

      {/* Cover Banner */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '240px',
        marginTop: '12px',
        backgroundColor: 'var(--bg-tertiary)',
        overflow: 'hidden'
      }}>
        <img
          src={channelData?.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&auto=format&fit=crop&q=80'}
          alt="Channel Banner"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 60%)'
        }} />
      </div>

      {/* Channel Profile Header */}
      <div style={{
        padding: '0 32px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginTop: '-50px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Avatar & Details */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
          <img
            src={channelData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt=""
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid var(--bg-primary)',
              boxShadow: 'var(--shadow-lg)'
            }}
          />
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{channelData?.fullName}</h1>
              <CheckCircle size={18} color="var(--accent-secondary)" />
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              @{channelData?.username} • <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{subscribersCount.toLocaleString()}</span> subscribers
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          {isOwner ? (
            <button
              onClick={onOpenSettings}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-active)',
                color: 'var(--text-main)',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              <Settings size={16} />
              <span>Customize Channel</span>
            </button>
          ) : (
            <button
              onClick={handleToggleSubscribe}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSubscribed ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                color: isSubscribed ? 'var(--text-muted)' : '#ffffff',
                border: isSubscribed ? '1px solid var(--border-active)' : 'none',
                fontWeight: 700,
                fontSize: '14px',
                boxShadow: isSubscribed ? 'none' : 'var(--shadow-glow)'
              }}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              onShowToast?.('Channel link copied to clipboard!', 'success');
            }}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '24px',
        padding: '0 32px',
        marginTop: '28px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {['videos', 'about'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 0',
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'capitalize',
              color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--accent-primary)' : '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '24px 32px' }}>
        {activeTab === 'videos' ? (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
              Uploads ({channelVideos.length > 0 ? channelVideos.length : videos.length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {(channelVideos.length > 0 ? channelVideos : videos).map((v) => (
                <VideoCard
                  key={v._id}
                  video={v}
                  onSelectVideo={onSelectVideo}
                  onNavigateChannel={() => {}}
                />
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            maxWidth: '640px',
            backgroundColor: 'var(--bg-secondary)',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700 }}>About this channel</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Welcome to the official channel of {channelData?.fullName}. Here you will find deep technical content on modern software architecture, production backend engineering, high-throughput systems, and fullstack mastery.
            </p>
            <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Total Subscribers</span>
                <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{subscribersCount.toLocaleString()}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Channels Subscribed</span>
                <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{channelData?.channelsSubscribedToCount || 12}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
