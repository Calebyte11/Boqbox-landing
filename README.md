# BooookBox — Gift Sending App

> **"Send love, not links."**

A React + TypeScript gift-sending app inspired by the BooookBox Figma design. Minimal, clean, and fully functional.

---

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Plain CSS** — Custom design system matching the BooookBox brand (no Tailwind needed)
- **Sora** — Google Font used throughout

---

## Flow

| Step | Screen | Description |
|------|--------|-------------|
| 0 | Landing | Hero page with "Send A gift" CTA |
| 1 | Sender | Who's sending? Email, name, phone |
| 2 | Recipient | Who's receiving? Name, email, phone, address, message |
| 3 | Items | Pick a gift item + quantity |
| 4 | Vendor | Choose a vendor (rating + delivery time) |
| 5 | Payment | Card details + order summary |
| ✓ | Confirmation | Success screen with order details |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Build for Production

```bash
npm run build
```

Output goes into the `/build` folder — ready to deploy to Vercel, Netlify, etc.

---

## Project Structure

```
src/
├── App.tsx                  # Step router / state manager
├── index.tsx                # Entry point
├── index.css                # Full design system (CSS variables, components)
│
├── types/
│   └── index.ts             # All TypeScript interfaces
│
├── lib/
│   └── data.ts              # Mock gift items, vendors, formatNaira util
│
├── components/
│   ├── Nav.tsx              # Top nav bar (BooookBox logo + location)
│   └── StepIndicator.tsx    # Progress dots (5 steps)
│
└── pages/
    ├── LandingPage.tsx      # Hero page with SVG illustration
    ├── SenderPage.tsx       # Step 1 — sender info
    ├── RecipientPage.tsx    # Step 2 — recipient info
    ├── ItemsPage.tsx        # Step 3 — item selection + quantity
    ├── VendorPage.tsx       # Step 4 — vendor selection
    ├── PaymentPage.tsx      # Step 5 — payment + order summary
    └── ConfirmationPage.tsx # Success screen
```

---

## Customization

### Add Gift Items
Edit `src/lib/data.ts` → `giftItems` array.

### Add Vendors
Edit `src/lib/data.ts` → `vendors` array.

### Change Brand Color
Edit `src/index.css`:
```css
:root {
  --orange: #F97316;
}
```

### Change Currency
Edit `src/lib/data.ts`:
```ts
export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
};
```

---

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# drag /build folder to Netlify dashboard
```

---

Built with ❤️ — BooookBox 2026
