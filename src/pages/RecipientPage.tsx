import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import StepIndicator from '../components/StepIndicator';
import { RecipientInfo, SenderInfo } from '../types';

interface RecipientPageProps {
  data: RecipientInfo;
  senderInfo: SenderInfo;
  isGetMe?: boolean;
  onChange: (data: RecipientInfo) => void;
  onContinue: () => void;
  onBack: () => void;
}

interface Errors {
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
}

export default function RecipientPage({ data, senderInfo, isGetMe, onChange, onContinue, onBack }: RecipientPageProps) {
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (isGetMe) {
      onChange({
        ...data,
        email: senderInfo.email,
        fullName: senderInfo.fullName,
        phone: senderInfo.phone,
      });
    }
  }, [isGetMe]);

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!data.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!data.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (data.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!data.address.trim()) newErrors.address = 'Delivery address is required';
    if (!data.city.trim()) newErrors.city = 'City is required';
    if (!data.state.trim()) newErrors.state = 'State is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) onContinue();
  };

  return (
    <div className="app-frame page-enter">
      <Nav />
      <div className="form-page">
        <div className="form-page-header">
          <h2 className="form-page-title">{isGetMe ? 'Get Me' : 'Send a Gift'}</h2>
          <StepIndicator totalSteps={5} currentStep={2} />
        </div>

        <button className="back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>

        <h3 className="form-section-title">{isGetMe ? 'Enter Your Information' : "Who's it going to?"}</h3>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter recipient's email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            readOnly={isGetMe}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className={`form-input ${errors.fullName ? 'error' : ''}`}
            placeholder="Enter recipient's full name"
            value={data.fullName}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
            readOnly={isGetMe}
          />
          {errors.fullName && <p className="form-error">{errors.fullName}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="Enter recipient's phone number"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            readOnly={isGetMe}
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Delivery Address</label>
          <input
            type="text"
            className={`form-input ${errors.address ? 'error' : ''}`}
            placeholder="Street address"
            value={data.address}
            onChange={(e) => onChange({ ...data, address: e.target.value })}
          />
          {errors.address && <p className="form-error">{errors.address}</p>}
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              className={`form-input ${errors.city ? 'error' : ''}`}
              placeholder="City"
              value={data.city}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
            />
            {errors.city && <p className="form-error">{errors.city}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">State</label>
            <input
              type="text"
              className={`form-input ${errors.state ? 'error' : ''}`}
              placeholder="State"
              value={data.state}
              onChange={(e) => onChange({ ...data, state: e.target.value })}
            />
            {errors.state && <p className="form-error">{errors.state}</p>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Gift Message <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></label>
          <textarea
            className="form-input"
            placeholder="Add a personal message..."
            value={data.message || ''}
            onChange={(e) => onChange({ ...data, message: e.target.value })}
            rows={3}
          />
        </div>

        <button className="continue-btn" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
