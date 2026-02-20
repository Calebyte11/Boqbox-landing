/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Step, GiftOrder, SenderInfo, RecipientInfo, GiftItem, Vendor, OrderItem } from './types';
import LandingPage from './pages/LandingPage';
import SenderPage from './pages/SenderPage';
import RecipientPage from './pages/RecipientPage';
import ItemsPage from './pages/ItemsPage';
import VendorPage from './pages/VendorPage';
import PaymentPage from './pages/PaymentPage';
import PaymentCallbackPage from './pages/PaymentCallbackPage';
import ConfirmationPage from './pages/ConfirmationPage';
import { useToast } from './components/Toast';

const defaultOrder: GiftOrder = {
  sender: { email: '', fullName: '', phone: '' },
  recipient: { email: '', fullName: '', phone: '', address: '', city: '', state: '', message: '' },
  items: [],
  vendor: null,
  isGetMe: false,
};

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [order, setOrder] = useState<GiftOrder>(defaultOrder);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const toast = useToast();

  // Check for payment callback on app load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference');
    const step = params.get('step');

    // If there's a reference parameter or step is payment-callback, we're returning from Paystack
    if (reference || step === 'payment-callback') {
      console.log('Payment reference detected:', reference);
      if (reference) {
        setPaymentReference(reference);
      }
      setStep('payment-callback');
      // Don't clean up URL here - let PaymentCallbackPage complete first
      // URL will be cleaned up after payment confirmation or failure
    }
  }, []);

  const updateSender = (sender: SenderInfo) => setOrder((o) => ({ ...o, sender }));
  const updateRecipient = (recipient: RecipientInfo) => setOrder((o) => ({ ...o, recipient }));
  
  const updateItems = (items: OrderItem[]) => setOrder((o) => ({ ...o, items }));
  const addItem = (item: GiftItem, quantity: number) => {
    setOrder((o) => {
      const existingIndex = o.items.findIndex((oi) => oi.item.id === item.id);
      if (existingIndex >= 0) {
        const newItems = [...o.items];
        newItems[existingIndex].quantity += quantity;
        return { ...o, items: newItems };
      }
      return { ...o, items: [...o.items, { item, quantity }] };
    });
  };
  
  const updateVendor = (vendor: Vendor) => setOrder((o) => ({ ...o, vendor }));

  const handleReset = () => {
    setOrder(defaultOrder);
    setStep('landing');
  };

  const handleStartSendGift = () => {
    setOrder((o) => ({ ...o, isGetMe: false }));
    setStep('sender');
  };

  const handleStartGetMe = () => {
    setOrder((o) => ({ ...o, isGetMe: true }));
    setStep('sender');
  };

  switch (step) {
    case 'landing':
      return <LandingPage onStart={handleStartSendGift} onGetMe={handleStartGetMe} />;

    case 'sender':
      return (
        <SenderPage
          data={order.sender}
          isGetMe={order.isGetMe}
          onChange={updateSender}
          onContinue={() => setStep('recipient')}
        />
      );

    case 'recipient':
      return (
        <RecipientPage
          data={order.recipient}
          senderInfo={order.sender}
          isGetMe={order.isGetMe}
          onChange={updateRecipient}
          onContinue={() => setStep('items')}
          onBack={() => setStep('sender')}
        />
      );

    case 'items':
      return (
        <ItemsPage
          selectedItems={order.items}
          isGetMe={order.isGetMe}
          onAddItem={addItem}
          onUpdateItems={updateItems}
          onContinue={() => setStep('vendor')}
          onBack={() => setStep('recipient')}
        />
      );

    case 'vendor':
      return (
        <VendorPage
          isGetMe={order.isGetMe}
          selectedVendor={order.vendor}
          onVendorChange={updateVendor}
          onContinue={() => setStep('payment')}
          onBack={() => setStep('items')}
        />
      );

    case 'payment':
      if (order.items.length === 0 || !order.vendor) {
        setStep('items');
        return null;
      }
      return (
        <>
          <PaymentPage
            isGetMe={order.isGetMe}
            items={order.items}
            vendor={order.vendor}
            sender={order.sender}
            recipient={order.recipient}
            onSubmit={() => setStep('payment-callback')}
            onBack={() => setStep('vendor')}
          />
          {toast.component}
        </>
      );

    case 'payment-callback':
      return (
        <>
          <PaymentCallbackPage
            reference={paymentReference}
            onPaymentConfirmed={(success, data) => {
              if (success) {
                toast.showSuccess('Payment done successfully');
                // Clear the reference after successful payment
                setPaymentReference(null);
                // Store payment data
                setPaymentData(data);
                // Transition to confirmation page after showing success message
                setTimeout(() => {
                  setStep('confirmation');
                  // Clean up URL ONLY when transitioning away
                  window.history.replaceState({}, document.title, window.location.pathname);
                }, 2500);
              } else {
                toast.showError('Payment verification failed. Please try again.');
                // Clean up URL when going back to payment
                window.history.replaceState({}, document.title, window.location.pathname);
                // Clear the reference and go back to payment page to retry
                setPaymentReference(null);
                setTimeout(() => setStep('payment'), 2500);
              }
            }}
          />
          {toast.component}
        </>
      );

    case 'confirmation':
      return (
        <>
          <ConfirmationPage order={order} paymentData={paymentData} onReset={handleReset} />
          {toast.component}
        </>
      );

    default:
      return <LandingPage onStart={handleStartSendGift} onGetMe={handleStartGetMe} />;
  }
}
