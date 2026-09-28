import React from 'react';
import { Play, CheckCircle } from 'lucide-react';

export const VideoCard = ({ video, onSelectVideo, onNavigateChannel }) => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        borderRadius: 'var(--radius-md)',
      }}
      onClick={() => onSelectVideo(video)}
    >
      {/* Thumbnail Container */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}
        onMouseEnter={(e) => {
          const img = e.currentTarget.querySelector('img');
          const overlay = e.currentTarget.querySelector('.play-overlay');
          if (img) img.style.transform = 'scale(1.05)';
          if (overlay) overlay.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          const img = e.currentTarget.querySelector('img');
          const overlay = e.currentTarget.querySelector('.play-overlay');
          if (img) img.style.transform = 'scale(1)';
          if (overlay) overlay.style.opacity = '0';
        }}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />

        {/* Play Overlay */}
        <div 
          className="play-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.2s ease'
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Play size={22} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px' }} />
          </div>
        </div>

        {/* Duration Chip */}
        <span style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          backgroundColor: 'rgba(10, 13, 20, 0.85)',
          backdropFilter: 'blur(4px)',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {video.duration}
        </span>
      </div>

      {/* Video Details */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Creator Avatar */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onNavigateChannel(video.owner?.username);
          }}
          style={{ flexShrink: 0, cursor: 'pointer' }}
          title={`View ${video.owner?.fullName}'s channel`}
        >
          <img
            src={video.owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
            alt={video.owner?.fullName}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid var(--border-subtle)',
              transition: 'border-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
          />
        </div>

        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 1.35,
            color: 'var(--text-main)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {video.title}
          </h3>

          <div 
            onClick={(e) => {
              e.stopPropagation();
              onNavigateChannel(video.owner?.username);
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              fontSize: '12px', 
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <span>{video.owner?.fullName}</span>
            <CheckCircle size={12} color="var(--accent-secondary)" />
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span>{video.views} views</span>
            <span>•</span>
            <span>{video.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
