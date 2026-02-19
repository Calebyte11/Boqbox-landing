import React from 'react';
import Nav from '../components/Nav';
import { GiftOrder } from '../types';
import { formatNaira } from '../lib/data';

interface PaymentResponse {
  total_amount_paid: number;
  vendor: string;
  recipient: string;
  delivery_address: string;
}

interface ConfirmationPageProps {
  order: GiftOrder;
  paymentData: PaymentResponse;
  onReset: () => void;
}

export default function ConfirmationPage({ order, paymentData, onReset }: ConfirmationPageProps) {
  // const total = paymentData.total_amount_paid;

  return (
    <div className="app-frame page-enter">
      <Nav />
      <div className="confirmation-page">
        <div className="confirm-icon">🎉</div>
        <h2 className="confirm-title">Gift Sent!</h2>
        <p className="confirm-subtitle">
          Your gift is on its way to {order.recipient.fullName}. They'll love it!
        </p>

        <div className="confirm-details">
          {order.items.map((oi) => (
            <div key={oi.item.id} className="confirm-detail-row">
              <span className="confirm-detail-label">Gift</span>
              <span className="confirm-detail-value">
                {oi.item.emoji} {oi.item.name} × {oi.quantity}
              </span>
            </div>
          ))}
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Vendor</span>
            <span className="confirm-detail-value">
              {paymentData.vendor}
            </span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Recipient</span>
            <span className="confirm-detail-value">{paymentData.recipient}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Delivering to</span>
            <span className="confirm-detail-value" style={{ textAlign: 'right', maxWidth: 180 }}>
              {paymentData.delivery_address}
            </span>
          </div>
          <div className="confirm-detail-row" style={{ paddingTop: 12, borderTop: '1.5px solid #E5E7EB', marginTop: 4 }}>
            <span className="confirm-detail-label">Total Paid</span>
            <span className="confirm-detail-value" style={{ color: '#F97316', fontSize: 18 }}>
              {formatNaira(paymentData.total_amount_paid)}
            </span>
          </div>
        </div>

        <button className="confirm-new-btn" onClick={onReset}>
          Send Another Gift 🎁
        </button>
      </div>
    </div>
  );
}
