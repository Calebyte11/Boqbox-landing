import React, { useState } from "react";
import Nav from "../components/Nav";
import StepIndicator from "../components/StepIndicator";
import { Vendor } from "../types";
import { vendors } from "../lib/data";

interface VendorPageProps {
  isGetMe?: boolean;
  selectedVendor: Vendor | null;
  onVendorChange: (vendor: Vendor) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function VendorPage({
  isGetMe,
  selectedVendor,
  onVendorChange,
  onContinue,
  onBack,
}: VendorPageProps) {
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!selectedVendor) {
      setError("Please select a vendor to continue");
      return;
    }
    setError("");
    onContinue();
  };

  return (
    <div className="app-frame page-enter">
      <Nav />
      <div className="form-page">
        <div className="form-page-header">
          <h2 className="form-page-title">
            {isGetMe ? "Get Me" : "Send a Gift"}
          </h2>

          <StepIndicator totalSteps={5} currentStep={4} />
        </div>

        <button className="back-btn" onClick={onBack}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <h3 className="form-section-title">Choose a vendor</h3>

        <div className="vendors-list">
          {vendors.map((vendor) => {
            const isSelected = selectedVendor?.id === vendor.id;
            return (
              <div
                key={vendor.id}
                className={`vendor-card ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  onVendorChange(vendor);
                  setError("");
                }}
              >
                <span className="vendor-emoji">{vendor.emoji}</span>
                <div className="vendor-info">
                  <div className="vendor-name">{vendor.name}</div>
                  <div className="vendor-meta">
                    <span>⭐ {vendor.rating}</span>
                    <span>🚚 {vendor.deliveryTime}</span>
                  </div>
                </div>
                {isSelected && <span className="vendor-selected-check">✓</span>}
              </div>
            );
          })}
        </div>

        {error && (
          <p className="form-error" style={{ marginBottom: 16 }}>
            {error}
          </p>
        )}

        <button className="continue-btn" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
