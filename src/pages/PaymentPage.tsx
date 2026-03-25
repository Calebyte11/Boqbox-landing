import React, { useState } from "react";
import Nav from "../components/Nav";
import StepIndicator from "../components/StepIndicator";
import LoadingModal from "../components/LoadingModal";
import { OrderItem, Vendor, SenderInfo, RecipientInfo } from "../types";
import { formatNaira } from "../lib/data";
import { API_ENDPOINTS, API_CONFIG } from "../lib/config";

interface PaymentPageProps {
  isGetMe?: boolean;
  isSubscribe?: boolean;
  items: OrderItem[];
  vendor: Vendor;
  sender: SenderInfo;
  recipient: RecipientInfo;
  onSubmit: () => void;
  onBack: () => void;
}

interface OrderPayload {
  sender: {
    name: string;
    email_address: string;
    phone_number: string;
  };
  type: "purchase" | "gift";
  recipient: {
    name: string;
    email_address: string;
    phone_number: string;
    delivery_address: string;
  };
  items: Array<{
    item: string;
    item_name: string;
    quantity: number;
  }>;
  message: string;
  vendor: string;
  totalAmount: number;
  callback_url?: string;
}

interface SubscriptionPayload {
  type: "self" | "gift";
  frequency: string; // e.g., "weekly", "monthly"
  subscribedBy: {
    name: string;
    email_address: string;
    phone_number: string;
  };
  subscribedFor: {
    name: string;
    email_address: string;
    phone_number: string;
    delivery_address: string;
  };
  items: Array<{
    item: string;
    item_name: string;
    quantity: number;
  }>;
  message: string;
  vendor: string;
  totalAmount: number;
  callback_url?: string;
}

const DELIVERY_FEE = 0;
const SERVICE_FEE = 0;

export default function PaymentPage({
  isGetMe,
  isSubscribe,
  items,
  vendor,
  sender,
  recipient,
  onSubmit,
  onBack,
}: PaymentPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Creating order...");

  // Detect if this is a subscription order
  const hasSubscriptionItems = items.some((oi) => oi.subscriptionOption);
  const isSubscriptionFlow = isSubscribe || hasSubscriptionItems;

  const subtotal = items.reduce((sum, oi) => {
    if (oi.subscriptionOption) {
      return sum + oi.subscriptionOption.price * oi.quantity;
    }
    return sum + (oi.item.price ?? 0) * oi.quantity;
  }, 0);
  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;

  // Get the subscription frequency from the first subscription item
  const getSubscriptionFrequency = (): string => {
    const subscriptionItem = items.find((oi) => oi.subscriptionOption);
    return subscriptionItem?.subscriptionOption?.name || "weekly";
  };

  const constructOrderPayload = (): OrderPayload | SubscriptionPayload => {
    if (isSubscriptionFlow) {
      // Build subscription payload
      return {
        type: isGetMe ? "gift" : "self",
        frequency: getSubscriptionFrequency(),
        subscribedBy: {
          name: sender.fullName,
          email_address: sender.email,
          phone_number: sender.phone,
        },
        subscribedFor: {
          name: isGetMe ? recipient.fullName : sender.fullName,
          email_address: isGetMe ? recipient.email : sender.email,
          phone_number: isGetMe ? recipient.phone : sender.phone,
          delivery_address: isGetMe
            ? `${recipient.address}, ${recipient.city}, ${recipient.state}`
            : `${recipient.address}, ${recipient.city}, ${recipient.state}`,
        },
        items: items.map((oi) => ({
          item: oi.item._id || oi.item.id || "",
          item_name: oi.item.name,
          quantity: oi.quantity,
        })),
        message: recipient.message || "",
        vendor: vendor.name,
        totalAmount: total,
        callback_url: API_CONFIG.CALLBACK_URL,
      } as SubscriptionPayload;
    }

    // Build regular order payload
    return {
      sender: {
        name: sender.fullName,
        email_address: sender.email,
        phone_number: sender.phone,
      },
      type: isGetMe ? "purchase" : "gift",
      recipient: {
        name: recipient.fullName,
        email_address: recipient.email,
        phone_number: recipient.phone,
        delivery_address: `${recipient.address}, ${recipient.city}, ${recipient.state}`,
      },
      items: items.map((oi) => ({
        item: oi.item._id || oi.item.id || "",
        item_name: oi.item.name,
        quantity: oi.quantity,
        subscriptionOption: oi.subscriptionOption
          ? {
              name: oi.subscriptionOption.name,
              price: oi.subscriptionOption.price,
              quantity: oi.subscriptionOption.quantity,
            }
          : undefined,
      })),
      message: recipient.message || "",
      vendor: vendor.name,
      totalAmount: total,
      callback_url: API_CONFIG.CALLBACK_URL,
    } as OrderPayload;
  };

  const handlePlaceOrder = async () => {
    setError(null);
    setIsLoading(true);
    setLoadingMessage("Creating order...");

    try {
      const payload = constructOrderPayload();

      // Select the appropriate API endpoint
      const apiEndpoint = isSubscriptionFlow
        ? "https://boqbox-mini.onrender.com/api/v1/subscriptions/create"
        : API_ENDPOINTS.ORDER_CREATE;

      // Start the request
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.payment_url) {
        // Update loading message before redirect
        setLoadingMessage("Redirecting to payment...");
        // Use a small delay to ensure the message displays, then redirect
        // This prevents flickering and ensures smooth UX
        setTimeout(() => {
          window.location.href = data.payment_url;
        }, 300);
      } else {
        setIsLoading(false);
        setError(data.message || "Failed to create order");
      }
    } catch (err) {
      setIsLoading(false);
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(`Error creating order: ${errorMessage}`);
    }
  };

  return (
    <div className="app-frame page-enter">
      <Nav />
      <LoadingModal
        isOpen={isLoading}
        message={loadingMessage}
        subMessage={
          loadingMessage === "Creating order..."
            ? "Please wait..."
            : "Almost there..."
        }
      />
      <div className="form-page">
        <div className="form-page-header">
          <h2 className="form-page-title">
            {isSubscriptionFlow
              ? "Subscribe"
              : isGetMe
                ? "Get Me"
                : "Send a Gift"}
          </h2>

          <StepIndicator totalSteps={5} currentStep={5} />
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

        <h3 className="form-section-title">Order Summary</h3>

        {error && (
          <div
            style={{
              padding: "12px 14px",
              background: "#FEE2E2",
              borderRadius: 10,
              marginBottom: 16,
              fontSize: 13,
              color: "#991B1B",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="summary-card">
          {items.map((oi) => (
            <div key={oi.item.id} className="summary-row">
              {oi.subscriptionOption ? (
                <>
                  <span>
                    {oi.item.emoji} {oi.item.name} - <strong style={{ textTransform: 'capitalize' }}>{oi.subscriptionOption.name}</strong> ({oi.subscriptionOption.quantity})
                  </span>
                  <span className="value">
                    {formatNaira(oi.subscriptionOption.price * oi.quantity)}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {oi.item.emoji} {oi.item.name} × {oi.quantity}
                  </span>
                  <span className="value">
                    {formatNaira((oi.item.price ?? 0) * oi.quantity)}
                  </span>
                </>
              )}
            </div>
          ))}
          <div className="summary-row">
            <span>
              Vendor: {vendor.emoji} {vendor.name}
            </span>
            <span className="value">{vendor.deliveryTime}</span>
          </div>
          <div className="summary-row">
            <span>Delivery fee</span>
            <span className="value">{formatNaira(DELIVERY_FEE)}</span>
          </div>
          <div className="summary-row">
            <span>Service fee</span>
            <span className="value">{formatNaira(SERVICE_FEE)}</span>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <span className="total-value">{formatNaira(total)}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            background: "#F0FFF4",
            borderRadius: 10,
            marginBottom: 24,
            fontSize: 13,
            color: "#065F46",
            fontWeight: 500,
          }}
        >
          <span>🔒</span> Your payment is secured and processed by Paystack
        </div>

        <button
          className="continue-btn-pay"
          onClick={handlePlaceOrder}
          disabled={isLoading}
          style={{
            position: "static",
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
            pointerEvents: isLoading ? "none" : "auto",
          }}
        >
          {isLoading ? "⏳ Processing..." : `Pay ${formatNaira(total)}`}
        </button>
      </div>
    </div>
  );
}
