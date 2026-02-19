import React, { useState } from "react";
import Nav from "../components/Nav";
import StepIndicator from "../components/StepIndicator";
import { Vendor } from "../types";
import { useVendors } from "../hooks/useVendors";

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
  const { vendors, loading, error: apiError, hasMore, loadMore } = useVendors();

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

        {apiError && <p className="form-error" style={{ marginBottom: 16 }}>Error loading vendors: {apiError}</p>}

        <div className="vendors-list">
          {vendors.map((vendor) => {
            const isSelected = (selectedVendor?._id || selectedVendor?.id) === (vendor._id || vendor.id);
            return (
              <div
                key={vendor._id || vendor.id}
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
                    <span>⭐ {vendor.rating || 'N/A'}</span>
                    <span>🚚 {vendor.deliveryTime || 'TBD'}</span>
                  </div>
                </div>
                {isSelected && <span className="vendor-selected-check">✓</span>}
              </div>
            );
          })}
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: 16 }}>Loading vendors...</p>}

        {hasMore && !loading && (
          <button
            className="continue-btn"
            onClick={loadMore}
            style={{ marginBottom: 16, background: '#E5E7EB', color: '#374151' }}
          >
            Load More Vendors
          </button>
        )}

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
