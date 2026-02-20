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
  const [showCustomVendorModal, setShowCustomVendorModal] = useState(false);
  const [customVendorInput, setCustomVendorInput] = useState("");
  const { vendors, loading, error: apiError, hasMore, loadMore } = useVendors();

  const handleContinue = () => {
    if (!selectedVendor) {
      setError("Please select a vendor to continue");
      return;
    }
    setError("");
    onContinue();
  };

  const handleCustomVendorSubmit = () => {
    if (!customVendorInput.trim()) {
      setError("Please enter a vendor name");
      return;
    }

    // Create a custom vendor object
    const customVendor: Vendor = {
      _id: "custom",
      id: "custom",
      name: customVendorInput.trim(),
      emoji: "❓",
      rating: 0,
      deliveryTime: "N/A",
      type: "custom",
      isCustom: true, // Mark as custom for backend differentiation
    } as Vendor;

    onVendorChange(customVendor);
    setError("");
    setShowCustomVendorModal(false);
    setCustomVendorInput("");
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

        {!hasMore && !loading && (
          <button
            className="continue-btn"
            onClick={() => setShowCustomVendorModal(true)}
            style={{ marginBottom: 16, background: '#E5E7EB', color: '#374151' }}
          >
            Vendor Not Here?
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

        {/* Custom Vendor Modal */}
        {showCustomVendorModal && (
          <div className="modal-overlay" onClick={() => setShowCustomVendorModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Enter Vendor Name</h3>
              <p className="modal-description">Can't find your vendor? Tell us the vendor name.</p>
              
              <input
                type="text"
                placeholder="Enter vendor name"
                value={customVendorInput}
                onChange={(e) => {
                  setCustomVendorInput(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCustomVendorSubmit();
                  }
                }}
                className="modal-input"
                autoFocus
              />

              {error && (
                <p className="form-error" style={{ marginBottom: 16, marginTop: 12 }}>
                  {error}
                </p>
              )}

              <div className="modal-actions">
                <button
                  className="modal-btn modal-btn-cancel"
                  onClick={() => {
                    setShowCustomVendorModal(false);
                    setCustomVendorInput("");
                    setError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn modal-btn-submit"
                  onClick={handleCustomVendorSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
