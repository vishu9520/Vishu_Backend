import React, { useState } from 'react';
import { X, Upload, Image, Lock, Mail, User, Shield, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

export const AuthModal = ({ 
  initialMode = 'login', 
  isOpen, 
  onClose, 
  onAuthSuccess, 
  onShowToast 
}) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // File Upload Previews
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const payload = {
          email: email.includes('@') ? email : undefined,
          username: !email.includes('@') ? email : undefined,
          password
        };

        const res = await authService.login(payload);
        const user = res.data?.user;
        onAuthSuccess(user);
        onShowToast?.(`Welcome back, ${user?.fullName || user?.username}!`, 'success');
        onClose();
      } else {
        // Register Mode
        if (!avatarFile) {
          setError('Profile Avatar is required for registration.');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('username', username.toLowerCase());
        formData.append('email', email);
        formData.append('password', password);
        formData.append('avatar', avatarFile);
        if (coverFile) {
          formData.append('coverImage', coverFile);
        }

        await authService.register(formData);
        onShowToast?.('Account created successfully! Logging you in...', 'success');

        // Automatically log in after registration
        const loginRes = await authService.login({
          username: username.toLowerCase(),
          password
        });
        onAuthSuccess(loginRes.data?.user);
        onClose();
      }
    } catch (err) {
      console.error('Auth error:', err);
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.';
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
        maxWidth: mode === 'register' ? '540px' : '440px',
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
              {mode === 'login' ? 'Sign in to MediaHub' : 'Create MediaHub Account'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
              {mode === 'login' ? 'Enter your details to access your creator dashboard' : 'Join creators worldwide and start sharing your streams'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              fontSize: '13px'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <>
              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vishu Vatsay"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 42px',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Username */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '10px', color: 'var(--text-dim)', fontSize: '14px' }}>@</span>
                  <input
                    type="text"
                    required
                    placeholder="vishu9520"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Avatar Upload (Required) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Profile Avatar (Required)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
                    />
                  ) : (
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px dashed var(--border-active)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-dim)'
                    }}>
                      <Image size={20} />
                    </div>
                  )}
                  <label style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Upload size={14} />
                    <span>Choose Avatar Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Cover Image Upload (Optional) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Channel Cover Banner (Optional)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      style={{ width: '90px', height: '36px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--accent-secondary)' }}
                    />
                  ) : null}
                  <label style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Upload size={14} />
                    <span>Choose Banner Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Email or Username for Login */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              {mode === 'login' ? 'Email or Username' : 'Email Address'}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type={mode === 'login' ? 'text' : 'email'}
                required
                placeholder={mode === 'login' ? 'user@example.com or username' : 'user@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
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
              gap: '8px',
              boxShadow: 'var(--shadow-glow)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Creator Account'}
          </button>

          {/* Toggle Login / Register */}
          <div style={{ textAlign: 'center', marginTop: '6px' }}>
            {mode === 'login' ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
