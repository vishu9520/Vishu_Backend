import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Camera, 
  Image, 
  Lock, 
  Save, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { authService } from '../services/api';

export const SettingsModal = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  onUserUpdated, 
  onShowToast 
}) => {
  const [activeSection, setActiveSection] = useState('profile'); // profile, avatar, cover, password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Profile form state
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Media upload state
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [newAvatarPreview, setNewAvatarPreview] = useState(null);
  const [newCoverFile, setNewCoverFile] = useState(null);
  const [newCoverPreview, setNewCoverPreview] = useState(null);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');

  if (!isOpen) return null;

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.updateAccountDetails({ fullName, email });
      onUserUpdated(res.data);
      onShowToast?.('Account details updated successfully!', 'success');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update details';
      setError(msg);
      onShowToast?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!newAvatarFile) {
      setError('Please select an image file first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('avatar', newAvatarFile);
      const res = await authService.updateAvatar(formData);
      onUserUpdated(res.data);
      onShowToast?.('Avatar updated successfully!', 'success');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload avatar';
      setError(msg);
      onShowToast?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCover = async (e) => {
    e.preventDefault();
    if (!newCoverFile) {
      setError('Please select a cover image file first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('coverImage', newCoverFile);
      const res = await authService.updateCoverImage(formData);
      onUserUpdated(res.data);
      onShowToast?.('Channel banner updated successfully!', 'success');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload cover image';
      setError(msg);
      onShowToast?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.changePassword({ oldPassword, newPassword, confPassword });
      onShowToast?.('Password changed successfully!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfPassword('');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to change password';
      setError(msg);
      onShowToast?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-active)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
              Profile & Channel Settings
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
              Manage your credentials, media branding, and channel settings
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-tertiary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 24px',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'profile', label: 'Basic Info', icon: User },
            { id: 'avatar', label: 'Avatar Photo', icon: Camera },
            { id: 'cover', label: 'Cover Banner', icon: Image },
            { id: 'password', label: 'Security & Password', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSection(tab.id);
                  setError('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  border: isActive ? 'none' : '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          {activeSection === 'profile' && (
            <form onSubmit={handleUpdateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dim)' }}>
                  Username (Permanent ID)
                </label>
                <input
                  type="text"
                  disabled
                  value={`@${currentUser?.username}`}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    color: 'var(--text-dim)'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Save size={16} />
                <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          )}

          {/* Section 2: Avatar Upload */}
          {activeSection === 'avatar' && (
            <form onSubmit={handleUpdateAvatar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img
                  src={newAvatarPreview || currentUser?.avatar}
                  alt="Avatar"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--accent-primary)'
                  }}
                />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Update Profile Photo</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Recommended size: 500x500px JPG, PNG, or WebP. Automatically hosted on Cloudinary CDN.
                  </p>
                  <label style={{
                    marginTop: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-active)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}>
                    <Camera size={14} />
                    <span>Choose New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewAvatarFile(file);
                          setNewAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !newAvatarFile}
                style={{
                  marginTop: '14px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: (!newAvatarFile || loading) ? 0.6 : 1
                }}
              >
                <span>{loading ? 'Uploading to Cloudinary...' : 'Upload & Update Avatar'}</span>
              </button>
            </form>
          )}

          {/* Section 3: Cover Banner Upload */}
          {activeSection === 'cover' && (
            <form onSubmit={handleUpdateCover} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '100%',
                height: '140px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)'
              }}>
                <img
                  src={newCoverPreview || currentUser?.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
                  alt="Banner preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-active)',
                fontSize: '13px',
                cursor: 'pointer',
                width: 'fit-content'
              }}>
                <Image size={16} />
                <span>Select New Banner Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewCoverFile(file);
                      setNewCoverPreview(URL.createObjectURL(file));
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                type="submit"
                disabled={loading || !newCoverFile}
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: (!newCoverFile || loading) ? 0.6 : 1
                }}
              >
                <span>{loading ? 'Uploading Banner to Cloudinary...' : 'Upload & Update Banner'}</span>
              </button>
            </form>
          )}

          {/* Section 4: Change Password */}
          {activeSection === 'password' && (
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Lock size={16} />
                <span>{loading ? 'Changing Password...' : 'Update Password'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
