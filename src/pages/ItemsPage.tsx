import React, { useState } from 'react';
import Nav from '../components/Nav';
import StepIndicator from '../components/StepIndicator';
import { GiftItem, OrderItem } from '../types';
import { formatNaira } from '../lib/data';
import { useItems } from '../hooks/useItems';

interface ItemsPageProps {
  selectedItems: OrderItem[];
  isGetMe?: boolean;
  onAddItem: (item: GiftItem, quantity: number) => void;
  onUpdateItems: (items: OrderItem[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function ItemsPage({
  selectedItems,
  isGetMe,
  onAddItem,
  onUpdateItems,
  onContinue,
  onBack,
}: ItemsPageProps) {
  const [error, setError] = useState('');
  const [currentItem, setCurrentItem] = useState<GiftItem | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const { items, loading, error: apiError, hasMore, loadMore } = useItems();

  const handleAddItem = () => {
    if (!currentItem) {
      setError('Please select a gift item to add');
      return;
    }
    setError('');
    onAddItem(currentItem, currentQuantity);
    setCurrentItem(null);
    setCurrentQuantity(1);
  };

  const handleRemoveItem = (itemId: string) => {
    const newItems = selectedItems.filter((oi) => (oi.item._id || oi.item.id) !== itemId);
    onUpdateItems(newItems);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newItems = selectedItems.map((oi) =>
      (oi.item._id || oi.item.id) === itemId ? { ...oi, quantity: newQuantity } : oi
    );
    onUpdateItems(newItems);
  };

  const handleContinue = () => {
    if (selectedItems.length === 0) {
      setError('Please add at least one gift item to continue');
      return;
    }
    setError('');
    onContinue();
  };

  const totalPrice = selectedItems.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0);

  return (
    <div className="app-frame page-enter">
      <Nav />
      <div className="form-page">
        <div className="form-page-header">
          <h2 className="form-page-title">{isGetMe ? 'Get Me' : 'Send a Gift'}</h2>
          <StepIndicator totalSteps={5} currentStep={3} />
        </div>

        <button className="back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>

        <h3 className="form-section-title">{isGetMe ? 'Pick your item' : 'Pick a gift'}</h3>

        {apiError && <p className="form-error" style={{ marginBottom: 16 }}>Error loading items: {apiError}</p>}

        <div className="items-grid">
          {items.map((item) => (
            <div
              key={item._id || item.id}
              className={`item-card ${currentItem?._id === item._id || currentItem?.id === item.id ? 'selected' : ''}`}
              onClick={() => { setCurrentItem(item); setError(''); }}
            >
              <span className="item-cat-badge">{item.category}</span>
              <span className="item-emoji">{item.emoji}</span>
              <div className="item-name">{item.name}</div>
              <div className="item-desc">{item.description}</div>
              <div className="item-price">{formatNaira(item.price)}</div>
            </div>
          ))}
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: 16 }}>Loading items...</p>}

        {hasMore && !loading && (
          <button
            className="continue-btn"
            onClick={loadMore}
            style={{ marginBottom: 16, background: '#E5E7EB', color: '#374151' }}
          >
            Load More Items
          </button>
        )}

        {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

        {currentItem && (
          <>
            <div className="quantity-row">
              <span className="quantity-label">Quantity</span>
              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() => setCurrentQuantity(Math.max(1, currentQuantity - 1))}
                  disabled={currentQuantity <= 1}
                >−</button>
                <span className="qty-value">{currentQuantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setCurrentQuantity(Math.min(99, currentQuantity + 1))}
                  disabled={currentQuantity >= 99}
                >+</button>
              </div>
            </div>

            <div style={{ background: '#FFF7ED', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#92400E', fontWeight: 500 }}>
              {currentQuantity}× {currentItem.name} · <strong>{formatNaira(currentItem.price * currentQuantity)}</strong>
            </div>

            <button className="continue-btn" onClick={handleAddItem} style={{ marginBottom: 16 }}>
              Add Item
            </button>
          </>
        )}

        {selectedItems.length > 0 && (
          <>
            <h3 className="form-section-title" style={{ marginTop: 24 }}>Selected Items</h3>
            <div style={{ marginBottom: 20 }}>
              {selectedItems.map((oi) => {
                const itemId = oi.item._id || oi.item.id || '';
                return (
                  <div
                    key={itemId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: '#F5F5F5',
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#1F2937' }}>
                        {oi.item.emoji} {oi.item.name}
                      </div>
                      <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                        {formatNaira(oi.item.price)} × {oi.quantity} = <strong>{formatNaira(oi.item.price * oi.quantity)}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div className="quantity-controls" style={{ gap: 8 }}>
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(itemId, oi.quantity - 1)}
                          disabled={oi.quantity <= 1}
                        >−</button>
                        <span className="qty-value" style={{ minWidth: 30, textAlign: 'center' }}>{oi.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(itemId, oi.quantity + 1)}
                          disabled={oi.quantity >= 99}
                        >+</button>
                      </div>
                      <button
                        style={{
                          padding: '4px 8px',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                        onClick={() => handleRemoveItem(itemId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: '#DBEAFE', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#1E40AF', fontWeight: 600 }}>
              Total: <strong>{formatNaira(totalPrice)}</strong>
            </div>
          </>
        )}

        <button className="continue-btn" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
