import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
  subMessage?: string;
}

export default function LoadingModal({ isOpen, message = 'Processing...', subMessage }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 12,
          padding: 40,
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          minWidth: 300,
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite',
          }}
        />
        <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px 0', color: '#111' }}>
          {message}
        </h3>
        {subMessage && (
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
            {subMessage}
          </p>
        )}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
