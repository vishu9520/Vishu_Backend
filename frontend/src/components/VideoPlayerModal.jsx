import React, { useState } from 'react';
import { 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  Send, 
  CheckCircle,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const VideoPlayerModal = ({ 
  video, 
  onClose, 
  currentUser, 
  onNavigateChannel,
  onShowToast
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Aman Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80',
      timeAgo: '1 day ago',
      text: 'The explanation of the dual-token JWT rotation and Mongoose aggregation pipelines was crystal clear! Great work.'
    },
    {
      id: 2,
      author: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80',
      timeAgo: '3 hours ago',
      text: 'Clean UI and buttery smooth playback. Loving this video platform!'
    }
  ]);

  if (!video) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: currentUser?.fullName || currentUser?.username || 'Guest Viewer',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
      timeAgo: 'Just now',
      text: commentText.trim()
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    onShowToast?.('Comment posted!', 'success');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast?.('Video link copied to clipboard!', 'success');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflowY: 'auto'
    }}>
      {/* Modal Dialog Card */}
      <div style={{
        width: '100%',
        maxWidth: '1100px',
        maxHeight: '92vh',
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-active)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 0.25s ease'
      }}>
        {/* Modal Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--accent-primary)" />
            MediaHub Player
          </span>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* HTML5 Video Element */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            minHeight: '380px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: '#000000',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <video
              key={video._id || video.videoUrl}
              src={video.videoUrl}
              poster={video.thumbnail}
              controls
              autoPlay
              playsInline
              preload="auto"
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000000' }}
            />
          </div>

          {/* Title */}
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
            {video.title}
          </h2>

          {/* Action Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            {/* Channel info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src={video.owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                alt=""
                onClick={() => {
                  onClose();
                  onNavigateChannel(video.owner?.username);
                }}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}
              />
              <div>
                <div 
                  onClick={() => {
                    onClose();
                    onNavigateChannel(video.owner?.username);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-main)' }}>
                    {video.owner?.fullName}
                  </span>
                  <CheckCircle size={14} color="var(--accent-secondary)" />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  {video.owner?.subscribersCount?.toLocaleString() || '12.4K'} subscribers
                </span>
              </div>

              {/* Subscribe button */}
              <button
                onClick={() => {
                  setIsSubscribed(!isSubscribed);
                  onShowToast?.(
                    isSubscribed ? `Unsubscribed from ${video.owner?.fullName}` : `Subscribed to ${video.owner?.fullName}!`,
                    'success'
                  );
                }}
                style={{
                  marginLeft: '12px',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  fontSize: '13px',
                  backgroundColor: isSubscribed ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                  color: isSubscribed ? 'var(--text-muted)' : '#ffffff',
                  border: isSubscribed ? '1px solid var(--border-active)' : 'none',
                  boxShadow: isSubscribed ? 'none' : 'var(--shadow-glow)'
                }}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Like, Dislike, Share buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden'
              }}>
                <button
                  onClick={handleLike}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    color: isLiked ? 'var(--accent-primary)' : 'var(--text-main)',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRight: '1px solid var(--border-subtle)'
                  }}
                >
                  <ThumbsUp size={16} fill={isLiked ? 'var(--accent-primary)' : 'none'} />
                  <span>{video.likes || '12K'}</span>
                </button>
                <button
                  onClick={handleDislike}
                  style={{
                    padding: '8px 14px',
                    color: isDisliked ? 'var(--accent-primary)' : 'var(--text-dim)'
                  }}
                >
                  <ThumbsDown size={16} fill={isDisliked ? 'var(--accent-primary)' : 'none'} />
                </button>
              </div>

              <button
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Description box */}
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', gap: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
              <span>{video.views} views</span>
              <span>{video.createdAt}</span>
              <span style={{ color: 'var(--accent-secondary)' }}>#{video.category}</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {video.description}
            </p>
          </div>

          {/* Comments Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                {comments.length} Comments
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
                alt=""
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 48px 10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '14px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: commentText.trim() ? 'var(--accent-primary)' : 'var(--text-dim)',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
              {comments.map((comment) => (
                <div key={comment.id} style={{ display: 'flex', gap: '12px' }}>
                  <img
                    src={comment.avatar}
                    alt=""
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                        {comment.author}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                        {comment.timeAgo}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
