import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '400px'
    }}>
      {toasts.map((toast) => {
        let Icon = Info;
        let borderColor = 'var(--accent-primary)';
        let bg = '#ffffff';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'var(--success)';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderColor = 'var(--danger)';
        }

        return (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: bg,
              backdropFilter: 'blur(16px)',
              borderLeft: `4px solid ${borderColor}`,
              borderTop: '1px solid var(--border-subtle)',
              borderRight: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              color: 'var(--text-main)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon size={20} color={borderColor} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                marginLeft: '16px',
                color: 'var(--text-dim)',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
