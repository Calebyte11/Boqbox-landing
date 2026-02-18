# Payment Flow Implementation Guide

## Overview
The payment flow now integrates with Paystack and includes proper callback handling with toast notifications.

## Payment Flow Sequence

```
1. User fills order details (sender, recipient, items, vendor)
2. User reaches PaymentPage and clicks "Pay"
3. PaymentPage creates order via API
4. API returns payment_url from Paystack
5. User redirected to Paystack checkout
6. User completes payment on Paystack
7. Paystack redirects back with ?reference=xxx parameter
8. App detects reference and moves to payment-callback step
9. PaymentCallbackPage verifies payment with API
10. Success: Toast shows "Payment done successfully" → Confirmation page
11. Error: Toast shows error message → Back to Payment page
```

## Key Components

### 1. Toast System (`src/components/Toast.tsx`)
- `useToast()` hook provides toast notifications
- Methods: `showSuccess()`, `showError()`, `showWarning()`, `showInfo()`
- Auto-dismisses after 4 seconds
- Stacks multiple toasts

### 2. PaymentCallbackPage (`src/pages/PaymentCallbackPage.tsx`)
- Handles redirect from Paystack
- Extracts `reference` parameter from URL
- Calls `confirmPayment(reference)` API
- Shows loading, success, or error states
- Triggers callback on completion

### 3. App.tsx Integration
- New 'payment-callback' step added to Step type
- `useEffect` detects payment reference in URL on app load
- Toast system integrated into relevant pages
- Automatic navigation based on payment confirmation

## Configuration Files

### .env Variables
```
REACT_APP_API_BASE_URL=https://boqbox-mini.onrender.com
REACT_APP_ORDER_CREATE_ENDPOINT=/orders/create
REACT_APP_PAYMENT_CONFIRM_ENDPOINT=/confirm-payment
REACT_APP_PAYMENT_CALLBACK_URL=http://localhost:3000/payment-callback
```

### src/lib/config.ts
Exports:
- `API_ENDPOINTS` - Full URLs for API calls
- `API_CONFIG` - Configuration with callback URL

## API Integration

### Order Creation
- **Endpoint**: `POST /orders/create`
- **Request**: Order details (sender, recipient, items, vendor, totalAmount)
- **Response**: `{ success: true, payment_url: "https://checkout.paystack.com/..." }`

### Payment Confirmation
- **Endpoint**: `GET /confirm-payment?reference={reference}`
- **Response**: `{ success: true, message: "Payment successful." }`

## Environment Setup

### Development
```bash
# In .env (git-ignored)
REACT_APP_API_BASE_URL=https://boqbox-mini.onrender.com
REACT_APP_PAYMENT_CALLBACK_URL=http://localhost:3000/payment-callback
```

### Production
Update `.env` with production API base URL and callback URL pointing to your deployed domain

## Toast Notifications

### Usage Example
```tsx
import { useToast } from './components/Toast';

const MyComponent = () => {
  const toast = useToast();
  
  return (
    <>
      <button onClick={() => toast.showSuccess('Payment done successfully')}>
        Show Success
      </button>
      {toast.component}
    </>
  );
};
```

## Testing Payment Flow

### Local Testing with Paystack Sandbox
1. Use Paystack test cards
2. Update `.env` to use Paystack sandbox API
3. Test cards:
   - Success: 4111 1111 1111 1111
   - Failed: 4000 0000 0000 0002

### Testing Callback
1. After payment on Paystack, you'll be redirected back
2. The app will detect the `?reference=` parameter
3. Payment will be verified automatically
4. Toast notification will appear

## Files Modified/Created

### Created:
- `src/components/Toast.tsx` - Toast notification system
- `src/pages/PaymentCallbackPage.tsx` - Payment callback handler
- `src/lib/config.ts` - Centralized API configuration
- `.env` - Environment variables
- `.env.example` - Environment template
- `.gitignore` - Git ignore rules

### Modified:
- `src/App.tsx` - Added toast system and payment-callback step
- `src/types/index.ts` - Added 'payment-callback' to Step type
- `src/pages/PaymentPage.tsx` - Uses API_ENDPOINTS from config
- `src/lib/data.ts` - Uses API_ENDPOINTS in confirmPayment()

## Error Handling

The system handles:
- Missing payment reference
- API failures during confirmation
- Network errors
- Invalid responses from backend

All errors show appropriate toast notifications with retry options.
