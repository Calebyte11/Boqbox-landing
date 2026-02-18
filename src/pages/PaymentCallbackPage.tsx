import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import { confirmPayment } from '../lib/data';

interface PaymentCallbackPageProps {
  onPaymentConfirmed: (success: boolean) => void;
}

export default function PaymentCallbackPage({ onPaymentConfirmed }: PaymentCallbackPageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get reference from URL query parameters
        const params = new URLSearchParams(window.location.search);
        const reference = params.get('reference');

        if (!reference) {
          setStatus('error');
          setMessage('No payment reference found');
          onPaymentConfirmed(false);
          return;
        }

        // Confirm payment with API
        const result = await confirmPayment(reference);

        if (result.success) {
          setStatus('success');
          setMessage('Payment successful! Redirecting...');
          onPaymentConfirmed(true);
        } else {
          setStatus('error');
          setMessage(result.message || 'Payment verification failed');
          onPaymentConfirmed(false);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error verifying payment. Please try again.');
        onPaymentConfirmed(false);
      }
    };

    verifyPayment();
  }, [onPaymentConfirmed]);

  return (
    <div className="app-frame page-enter">
      <Nav />
      <div className="form-page">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 24 }}>
          {status === 'loading' && (
            <>
              <div style={{ fontSize: 48 }}>⏳</div>
              <h2 style={{ textAlign: 'center', fontSize: 20 }}>{message}</h2>
              <div style={{ width: 40, height: 40, border: '4px solid #f0f0f0', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </>
          )}
          {status === 'success' && (
            <>
              <div style={{ fontSize: 48 }}>✓</div>
              <h2 style={{ textAlign: 'center', fontSize: 20, color: '#059669' }}>{message}</h2>
            </>
          )}
          {status === 'error' && (
            <>
              <div style={{ fontSize: 48 }}>✕</div>
              <h2 style={{ textAlign: 'center', fontSize: 20, color: '#dc2626' }}>{message}</h2>
            </>
          )}
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
