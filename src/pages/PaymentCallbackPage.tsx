import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import { confirmPayment } from '../lib/data';

interface PaymentCallbackPageProps {
  reference: string | null;
  onPaymentConfirmed: (success: boolean) => void;
}

export default function PaymentCallbackPage({ reference, onPaymentConfirmed }: PaymentCallbackPageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying payment...');
  const [details, setDetails] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Use reference from props instead of URL
        if (!reference) {
          console.warn('No reference provided');
          setStatus('error');
          setMessage('Payment Verification Failed');
          setDetails('No payment reference found. Please try again.');
          onPaymentConfirmed(false);
          return;
        }

        console.log('Verifying payment with reference:', reference);
        
        // Confirm payment with API
        const result = await confirmPayment(reference);

        console.log('Payment confirmation result:', result);

        if (result.success) {
          setStatus('success');
          setMessage('Payment Successful! ✓');
          setDetails('Your gift order has been confirmed.');
          // Call callback after a short delay to ensure state updates
          setTimeout(() => {
            onPaymentConfirmed(true);
          }, 500);
        } else {
          setStatus('error');
          setMessage('Payment Verification Failed');
          setDetails(result.message || 'Payment verification failed. Please try again.');
          setTimeout(() => {
            onPaymentConfirmed(false);
          }, 500);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
        setMessage('Payment Verification Error');
        setDetails('An error occurred while verifying your payment. Please try again.');
        setTimeout(() => {
          onPaymentConfirmed(false);
        }, 500);
      }
    };

    verifyPayment();
  }, [reference, onPaymentConfirmed]);

  return (
    <div className="app-frame page-enter">
      <Nav />
      <div className="form-page">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 24 }}>
          {status === 'loading' && (
            <>
              <div style={{ fontSize: 48 }}>⏳</div>
              <h2 style={{ textAlign: 'center', fontSize: 20, margin: 0 }}>{message}</h2>
              <p style={{ textAlign: 'center', fontSize: 14, color: '#666', margin: 0 }}>Please wait while we confirm your payment...</p>
              <div style={{ width: 40, height: 40, border: '4px solid #f0f0f0', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </>
          )}
          {status === 'success' && (
            <>
              <div style={{ fontSize: 48 }}>✓</div>
              <h2 style={{ textAlign: 'center', fontSize: 20, color: '#059669', margin: 0 }}>{message}</h2>
              <p style={{ textAlign: 'center', fontSize: 14, color: '#666', margin: 0 }}>{details}</p>
            </>
          )}
          {status === 'error' && (
            <>
              <div style={{ fontSize: 48 }}>✕</div>
              <h2 style={{ textAlign: 'center', fontSize: 20, color: '#dc2626', margin: 0 }}>{message}</h2>
              <p style={{ textAlign: 'center', fontSize: 14, color: '#666', margin: 0 }}>{details}</p>
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
