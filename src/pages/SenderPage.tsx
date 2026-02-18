import React, { useState } from 'react';
import Nav from '../components/Nav';
import StepIndicator from '../components/StepIndicator';
import { SenderInfo } from '../types';

interface SenderPageProps {
  data: SenderInfo;
  isGetMe?: boolean;
  onChange: (data: SenderInfo) => void;
  onContinue: () => void;
}

interface Errors {
  email?: string;
  fullName?: string;
  phone?: string;
}

export default function SenderPage({ data, isGetMe, onChange, onContinue }: SenderPageProps) {
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!data.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!data.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (data.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Enter a valid phone number';
    }
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
          <StepIndicator totalSteps={5} currentStep={1} />
        </div>

        <h3 className="form-section-title">{isGetMe ? 'Enter Your Information' : "Who's the Gift from?"}</h3>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter email address"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            autoComplete="email"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className={`form-input ${errors.fullName ? 'error' : ''}`}
            placeholder="Enter full name"
            value={data.fullName}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
            autoComplete="name"
          />
          {errors.fullName && <p className="form-error">{errors.fullName}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="enter phone number"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            autoComplete="tel"
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>

        <button className="continue-btn" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
