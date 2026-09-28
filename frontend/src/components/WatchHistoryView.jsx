import React, { useState, useEffect } from 'react';
import { History, Trash2, Play, ArrowLeft, Clock } from 'lucide-react';
import { authService } from '../services/api';

export const WatchHistoryView = ({ 
  currentUser, 
  onSelectVideo, 
  onBack, 
  localHistory = [],
  onClearHistory,
  onShowToast 
}) => {
  const [historyVideos, setHistoryVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          const res = await authService.getWatchHistory();
          if (isMounted && res.data && Array.isArray(res.data) && res.data.length > 0) {
            setHistoryVideos(res.data);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch remote watch history, using local state:', err);
      } finally {
        if (isMounted) setLoading(false);
      }

      if (isMounted) {
        setHistoryVideos(localHistory);
        setLoading(false);
      }
    };

    fetchHistory();
    return () => { isMounted = false; };
  }, [currentUser, localHistory]);

  const handleClear = () => {
    setHistoryVideos([]);
    onClearHistory?.();
    onShowToast?.('Watch history cleared', 'info');
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-muted)',
              padding: '6px'
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={24} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Watch History</h2>
          </div>
        </div>

        {historyVideos.length > 0 && (
          <button
            onClick={handleClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <Trash2 size={16} />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : historyVideos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          marginTop: '20px'
        }}>
          <Clock size={48} color="var(--text-dim)" style={{ marginBottom: '14px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No Watch History Yet</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            Videos you watch will appear here so you can easily pick up where you left off.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
          {historyVideos.map((video) => (
            <div
              key={video._id}
              onClick={() => onSelectVideo(video)}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-active)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              {/* Thumbnail */}
              <div style={{
                position: 'relative',
                width: '180px',
                aspectRatio: '16 / 9',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 5px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {video.duration || 'Watched'}
                </span>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.3 }}>
                  {video.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {video.owner?.fullName || 'Creator'}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-dim)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
