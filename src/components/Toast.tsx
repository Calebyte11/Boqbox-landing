import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ messages, onRemove }) => {
  const getIconAndColor = (type: ToastType): { icon: string; bgColor: string; textColor: string } => {
    switch (type) {
      case 'success':
        return { icon: '✓', bgColor: '#D1FAE5', textColor: '#065F46' };
      case 'error':
        return { icon: '✕', bgColor: '#FEE2E2', textColor: '#991B1B' };
      case 'warning':
        return { icon: '⚠', bgColor: '#FEF3C7', textColor: '#92400E' };
      case 'info':
      default:
        return { icon: 'ℹ', bgColor: '#DBEAFE', textColor: '#0C4A6E' };
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {messages.map((msg) => {
        const { icon, bgColor, textColor } = getIconAndColor(msg.type);
        return (
          <ToastItem
            key={msg.id}
            message={msg}
            icon={icon}
            bgColor={bgColor}
            textColor={textColor}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );
};

interface ToastItemProps {
  message: ToastMessage;
  icon: string;
  bgColor: string;
  textColor: string;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ message, icon, bgColor, textColor, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(message.id);
    }, message.duration || 4000);

    return () => clearTimeout(timer);
  }, [message, onRemove]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: bgColor,
        color: textColor,
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        minWidth: 280,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 'bold' }}>{icon}</span>
      <span>{message.message}</span>
    </div>
  );
};

export const useToast = () => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'info', duration?: number) => {
    const id = Date.now().toString();
    setMessages((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const showSuccess = (message: string, duration?: number) => addToast(message, 'success', duration);
  const showError = (message: string, duration?: number) => addToast(message, 'error', duration);
  const showWarning = (message: string, duration?: number) => addToast(message, 'warning', duration);
  const showInfo = (message: string, duration?: number) => addToast(message, 'info', duration);

  return {
    messages,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    component: <Toast messages={messages} onRemove={removeToast} />,
  };
};

export default Toast;
