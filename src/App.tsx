/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Step, GiftOrder, SenderInfo, RecipientInfo, GiftItem, Vendor, OrderItem, SubscriptionOption } from './types';
import LandingPage from './pages/LandingPage';
import SenderPage from './pages/SenderPage';
import RecipientPage from './pages/RecipientPage';
import ItemsPage from './pages/ItemsPage';
import VendorPage from './pages/VendorPage';
import PaymentPage from './pages/PaymentPage';
import PaymentCallbackPage from './pages/PaymentCallbackPage';
import ConfirmationPage from './pages/ConfirmationPage';
import HelpButton from './components/HelpButton';
import { useToast } from './components/Toast';

const defaultOrder: GiftOrder = {
  sender: { email: '', fullName: '', phone: '' },
  recipient: { email: '', fullName: '', phone: '', address: '', city: '', state: '', message: '' },
  items: [],
  vendor: null,
  isGetMe: false,
  isSubscribe: false,
};

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [order, setOrder] = useState<GiftOrder>(defaultOrder);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 1024);
  const toast = useToast();

  // Handle window resize for responsive desktop/mobile switching
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  const addItem = (item: GiftItem, quantity: number, subscriptionOption?: SubscriptionOption) => {
    setOrder((o) => {
      const existingIndex = o.items.findIndex((oi) => oi.item.id === item.id);
      if (existingIndex >= 0) {
        const newItems = [...o.items];
        newItems[existingIndex].quantity += quantity;
        return { ...o, items: newItems };
      }
      return { ...o, items: [...o.items, { item, quantity, subscriptionOption }] };
    });
  };
  
  const updateVendor = (vendor: Vendor) => setOrder((o) => ({ ...o, vendor }));

  const handleReset = () => {
    setOrder({ ...defaultOrder, isSubscribe: false, isGetMe: false });
    setStep('landing');
  };

  const handleLogoClick = () => {
    setStep('landing');
    setOrder({ ...defaultOrder, isSubscribe: false, isGetMe: false });
  };

  const handleStartSendGift = () => {
    setOrder((o) => ({ ...o, isGetMe: false, isSubscribe: false, items: [], vendor: null }));
    setStep('items');
  };

  const handleStartGetMe = () => {
    setOrder((o) => ({ ...o, isGetMe: true, isSubscribe: false, items: [], vendor: null }));
    setStep('items');
  };

  const handleStartSubscribe = () => {
    setOrder((o) => ({ ...o, isGetMe: false, isSubscribe: true, items: [], vendor: null }));
    setStep('subscribe');
  };

  // Desktop view with modal overlay
  const renderDesktopView = () => {
    const isLanding = step === 'landing';

    return (
      <>
        {/* Background landing page - always visible on desktop */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <LandingPage onStart={handleStartSendGift} onGetMe={handleStartGetMe} onSubscribe={handleStartSubscribe} onLogoClick={handleLogoClick} />
        </div>

        {/* Modal overlay for non-landing pages */}
        {!isLanding && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 99 }} />
        )}

        {/* Modal pages - only show when not on landing */}
        {!isLanding && (
          <div className="app-frame page-enter desktop-modal">
            {step === 'items' && (
              <ItemsPage
                selectedItems={order.items}
                isGetMe={order.isGetMe}
                onAddItem={addItem}
                onUpdateItems={updateItems}
                onContinue={() => setStep('vendor')}
                onBack={() => setStep('landing')}
              />
            )}

            {step === 'subscribe' && (
              <ItemsPage
                selectedItems={order.items}
                isSubscribe={true}
                onAddItem={addItem}
                onUpdateItems={updateItems}
                onContinue={() => setStep('vendor')}
                onBack={() => setStep('landing')}
              />
            )}

            {step === 'vendor' && (
              <VendorPage
                isGetMe={order.isGetMe}
                isSubscribe={order.isSubscribe}
                selectedVendor={order.vendor}
                onVendorChange={updateVendor}
                onContinue={() => setStep('sender')}
                onBack={() => setStep(order.isSubscribe ? 'subscribe' : 'items')}
              />
            )}

            {step === 'sender' && (
              <SenderPage
                data={order.sender}
                isGetMe={order.isGetMe}
                isSubscribe={order.isSubscribe}
                onChange={updateSender}
                onContinue={() => setStep('recipient')}
                onBack={() => setStep('vendor')}
              />
            )}

            {step === 'recipient' && (
              <RecipientPage
                data={order.recipient}
                senderInfo={order.sender}
                isGetMe={order.isGetMe}
                isSubscribe={order.isSubscribe}
                onChange={updateRecipient}
                onContinue={() => setStep('payment')}
                onBack={() => setStep('sender')}
              />
            )}

            {step === 'payment' && (order.items.length > 0 && order.vendor) && (
              <>
                <PaymentPage
                  isGetMe={order.isGetMe}
                  isSubscribe={order.isSubscribe}
                  items={order.items}
                  vendor={order.vendor}
                  sender={order.sender}
                  recipient={order.recipient}
                  onSubmit={() => setStep('payment-callback')}
                  onBack={() => setStep('recipient')}
                />
                {toast.component}
              </>
            )}

            {step === 'payment-callback' && (
              <>
                <PaymentCallbackPage
                  reference={paymentReference}
                  onPaymentConfirmed={(success, data) => {
                    if (success) {
                      toast.showSuccess('Payment done successfully');
                      setPaymentReference(null);
                      setPaymentData(data);
                      setTimeout(() => {
                        setStep('confirmation');
                        window.history.replaceState({}, document.title, window.location.pathname);
                      }, 2500);
                    } else {
                      toast.showError('Payment verification failed. Please try again.');
                      window.history.replaceState({}, document.title, window.location.pathname);
                      setPaymentReference(null);
                      setTimeout(() => setStep('payment'), 2500);
                    }
                  }}
                />
                {toast.component}
              </>
            )}

            {step === 'confirmation' && (
              <>
                <ConfirmationPage order={order} paymentData={paymentData} onReset={handleReset} />
                {toast.component}
              </>
            )}
          </div>
        )}
      </>
    );
  };

  // Mobile view (original behavior)
  const renderMobileView = () => {
    switch (step) {
      case 'landing':
        return <LandingPage onStart={handleStartSendGift} onGetMe={handleStartGetMe} onSubscribe={handleStartSubscribe} onLogoClick={handleLogoClick} />;

      case 'items':
        return (
          <ItemsPage
            selectedItems={order.items}
            isGetMe={order.isGetMe}
            onAddItem={addItem}
            onUpdateItems={updateItems}
            onContinue={() => setStep('vendor')}
            onBack={() => setStep('landing')}
          />
        );

      case 'subscribe':
        return (
          <ItemsPage
            selectedItems={order.items}
            isSubscribe={true}
            onAddItem={addItem}
            onUpdateItems={updateItems}
            onContinue={() => setStep('vendor')}
            onBack={() => setStep('landing')}
          />
        );

      case 'vendor':
        return (
          <VendorPage
            isGetMe={order.isGetMe}
            isSubscribe={order.isSubscribe}
            selectedVendor={order.vendor}
            onVendorChange={updateVendor}
            onContinue={() => setStep('sender')}
            onBack={() => setStep(order.isSubscribe ? 'subscribe' : 'items')}
          />
        );

      case 'sender':
        return (
          <SenderPage
            data={order.sender}
            isGetMe={order.isGetMe}
            isSubscribe={order.isSubscribe}
            onChange={updateSender}
            onContinue={() => setStep('recipient')}
            onBack={() => setStep('vendor')}
          />
        );

      case 'recipient':
        return (
          <RecipientPage
            data={order.recipient}
            senderInfo={order.sender}
            isGetMe={order.isGetMe}
            isSubscribe={order.isSubscribe}
            onChange={updateRecipient}
            onContinue={() => setStep('payment')}
            onBack={() => setStep('sender')}
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
              isSubscribe={order.isSubscribe}
              items={order.items}
              vendor={order.vendor}
              sender={order.sender}
              recipient={order.recipient}
              onSubmit={() => setStep('payment-callback')}
              onBack={() => setStep('recipient')}
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
                  setPaymentReference(null);
                  setPaymentData(data);
                  setTimeout(() => {
                    setStep('confirmation');
                    window.history.replaceState({}, document.title, window.location.pathname);
                  }, 2500);
                } else {
                  toast.showError('Payment verification failed. Please try again.');
                  window.history.replaceState({}, document.title, window.location.pathname);
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
        return <LandingPage onStart={handleStartSendGift} onGetMe={handleStartGetMe} onSubscribe={handleStartSubscribe} onLogoClick={handleLogoClick} />;
    }
  };

  return (
    <>
      {isDesktop ? renderDesktopView() : renderMobileView()}
      <HelpButton />
    </>
  );
}
