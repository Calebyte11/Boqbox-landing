import React from 'react';
import Nav from '../components/Nav';
import { GiftOrder } from '../types';
import { formatNaira } from '../lib/data';

interface ConfirmationPageProps {
  order: GiftOrder;
  onReset: () => void;
}

const DELIVERY_FEE = 1500;
const SERVICE_FEE = 500;

export default function ConfirmationPage({ order, onReset }: ConfirmationPageProps) {
  const subtotal = order.items.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0);
  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;

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
              {order.vendor?.emoji} {order.vendor?.name}
            </span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Delivery</span>
            <span className="confirm-detail-value">{order.vendor?.deliveryTime}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Recipient</span>
            <span className="confirm-detail-value">{order.recipient.fullName}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Delivering to</span>
            <span className="confirm-detail-value" style={{ textAlign: 'right', maxWidth: 180 }}>
              {order.recipient.address}, {order.recipient.city}
            </span>
          </div>
          <div className="confirm-detail-row" style={{ paddingTop: 12, borderTop: '1.5px solid #E5E7EB', marginTop: 4 }}>
            <span className="confirm-detail-label">Total Paid</span>
            <span className="confirm-detail-value" style={{ color: '#F97316', fontSize: 18 }}>
              {formatNaira(total)}
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
