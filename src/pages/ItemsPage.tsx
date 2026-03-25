import React, { useState } from 'react';
import Nav from '../components/Nav';
import StepIndicator from '../components/StepIndicator';
import { GiftItem, OrderItem, SubscriptionOption } from '../types';
import { formatNaira } from '../lib/data';
import { useItems } from '../hooks/useItems';
import { useSubscribableItems } from '../hooks/useSubscribableItems';
import itemsImgOne from '../assets/images/itemsImgOne.jpeg';
import itemsImgTwo from '../assets/images/itemsImgTwo.jpeg';
import itemsImgThree from '../assets/images/itemsImgThree.jpeg';

interface ItemsPageProps {
  selectedItems: OrderItem[];
  isGetMe?: boolean;
  isSubscribe?: boolean;
  onAddItem: (item: GiftItem, quantity: number, subscriptionOption?: SubscriptionOption) => void;
  onUpdateItems: (items: OrderItem[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function ItemsPage({
  selectedItems,
  isGetMe,
  isSubscribe,
  onAddItem,
  onUpdateItems,
  onContinue,
  onBack,
}: ItemsPageProps) {
  const [error, setError] = useState('');
  const [currentItem, setCurrentItem] = useState<GiftItem | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<SubscriptionOption | null>(null);
  const [showDurationSelector, setShowDurationSelector] = useState(false);
  const regularItems = useItems();
  const subscribableItems = useSubscribableItems();
  const { items, loading, error: apiError, hasMore, loadMore } = isSubscribe ? subscribableItems : regularItems;

  const handleAddItem = () => {
    if (!currentItem) {
      setError('Please select a gift item to add');
      return;
    }
    if (isSubscribe) {
      if (!showDurationSelector) {
        setShowDurationSelector(true);
        return;
      }
      if (!selectedOption) {
        setError('Please select a subscription option');
        return;
      }
    }
    setError('');
    onAddItem(currentItem, currentQuantity, isSubscribe ? selectedOption || undefined : undefined);
    setCurrentItem(null);
    setCurrentQuantity(1);
    setSelectedOption(null);
    setShowDurationSelector(false);
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

  const totalPrice = selectedItems.reduce((sum, oi) => {
    if (oi.subscriptionOption) {
      return sum + oi.subscriptionOption.price * oi.quantity;
    }
    return sum + (oi.item.price || 0) * oi.quantity;
  }, 0);

  const getItemImage = (item: GiftItem | null, index: number) => {
    // Use API image URL if available and not empty
    if (item?.image_url && item.image_url.trim() !== '') {
      return item.image_url;
    }
    // Fall back to static images
    const images = [itemsImgOne, itemsImgTwo, itemsImgThree];
    return images[index % 3];
  };

  return (
    <div className="app-frame page-enter">
      <Nav />
      <div className="form-page">
        <div className="form-page-header">
          <h2 className="form-page-title">{isSubscribe ? 'Subscribe' : isGetMe ? 'Get Me' : 'Send a Gift'}</h2>
          <StepIndicator totalSteps={5} currentStep={1} />
        </div>

        <button className="back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>

        <h3 className="form-section-title">{isSubscribe ? 'Pick subscription item' : isGetMe ? 'Pick your item' : 'Pick a gift'}</h3>

        {apiError && <p className="form-error" style={{ marginBottom: 16 }}>Error loading items: {apiError}</p>}

        {isSubscribe ? (
          // Subscription List View
          <>
            <div style={{ marginBottom: 20 }}>
              {items.map((item, index) => (
                <div
                  key={item._id || item.id}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: '16px',
                    marginBottom: 12,
                    border: '1px solid #E5E7EB',
                    borderRadius: 12,
                    backgroundColor: '#FFFFFF',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Image */}
                  <img 
                    src={getItemImage(item, index)} 
                    alt={item.name} 
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} 
                  />
                  
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1F2937', marginBottom: 8 }}>{item.name}</div>
                    
                    {/* Options/Schedule Buttons with Prices */}
                    {item.options && item.options.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                        {item.options.map((option) => (
                          <button
                            key={option._id}
                            onClick={() => { 
                              setCurrentItem(item); 
                              setSelectedOption(option);
                              setShowDurationSelector(false);
                            }}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: currentItem?._id === item._id && selectedOption?._id === option._id ? '#FB923C' : '#F3F4F6',
                              color: currentItem?._id === item._id && selectedOption?._id === option._id ? '#FFFFFF' : '#374151',
                              border: 'none',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              minWidth: 70,
                            }}
                          >
                            <span style={{ textTransform: 'capitalize', marginBottom: 2 }}>{option.name}</span>
                            <span style={{ fontSize: 11, opacity: 0.8 }}>{formatNaira(option.price)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => {
                      if (item.options && item.options.length > 0) {
                        setCurrentItem(item);
                        setShowDurationSelector(false);
                        handleAddItem();
                      }
                    }}
                    style={{
                      padding: '8px 24px',
                      backgroundColor: '#FB923C',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EA7317')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FB923C')}
                  >
                    Add
                  </button>
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

            {currentItem && showDurationSelector && currentItem.options && (
              <>
                <h3 className="form-section-title">Select Duration</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  {currentItem.options.map((option) => (
                    <button
                      key={option._id}
                      onClick={() => {
                        setSelectedOption(option);
                        handleAddItem();
                      }}
                      style={{
                        padding: '16px',
                        backgroundColor: selectedOption?._id === option._id ? '#FB923C' : '#F3F4F6',
                        color: selectedOption?._id === option._id ? '#FFFFFF' : '#374151',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedOption?._id !== option._id) {
                          e.currentTarget.style.backgroundColor = '#E5E7EB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedOption?._id !== option._id) {
                          e.currentTarget.style.backgroundColor = '#F3F4F6';
                        }
                      }}
                    >
                      <div style={{ textTransform: 'capitalize', marginBottom: 4 }}>{option.name}</div>
                      <div style={{ fontSize: 14, marginBottom: 4 }}>{option.quantity}</div>
                      <div>{formatNaira(option.price)}</div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          // Regular Grid View
          <>
            <div className="items-grid">
              {items.map((item, index) => (
                <div
                  key={item._id || item.id}
                  className={`item-card ${currentItem?._id === item._id || currentItem?.id === item.id ? 'selected' : ''}`}
                  onClick={() => { setCurrentItem(item); setError(''); }}
                >
                  <span className="item-cat-badge">{item.category}</span>
                  <img src={getItemImage(item, index)} alt={item.name} className="item-emoji" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                  <div className="item-name">{item.name}</div>
                  <div className="item-desc">{item.description}</div>
                  <div className="item-price">{formatNaira(item.price || 0)}</div>
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
                  {currentQuantity}× {currentItem.name} · <strong>{formatNaira((currentItem.price || 0) * currentQuantity)}</strong>
                </div>

                <button className="continue-btn" onClick={handleAddItem} style={{ marginBottom: 16 }}>
                  Add Item
                </button>
              </>
            )}
          </>
        )}

        {selectedItems.length > 0 && (
          <>
            <h3 className="form-section-title" style={{ marginTop: 24 }}>Selected Items</h3>
            <div style={{ marginBottom: 20 }}>
              {selectedItems.map((oi) => {
                const itemId = oi.item._id || oi.item.id || '';
                const itemIndex = items.findIndex((item) => (item._id || item.id) === itemId);
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
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={getItemImage(oi.item, itemIndex)} alt={oi.item.name} style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4 }} />
                        {oi.item.name}
                      </div>
                      {oi.subscriptionOption ? (
                        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                          <strong style={{ textTransform: 'capitalize' }}>{oi.subscriptionOption.name}</strong> · {oi.subscriptionOption.quantity} = <strong>{formatNaira(oi.subscriptionOption.price)}</strong>
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                          {formatNaira(oi.item.price || 0)} × {oi.quantity} = <strong>{formatNaira((oi.item.price || 0) * oi.quantity)}</strong>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {!oi.subscriptionOption && (
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
                      )}
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
