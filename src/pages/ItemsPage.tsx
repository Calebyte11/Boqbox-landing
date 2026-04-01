/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Nav from '../components/Nav';
import StepIndicator from '../components/StepIndicator';
import { GiftItem, OrderItem, SubscriptionOption } from '../types';
import { formatNaira } from '../lib/data';
import { useItems } from '../hooks/useItems';
import { useSubscribableItems } from '../hooks/useSubscribableItems';
import { useSearchItems } from '../hooks/useSearchItems';
import useSEO from '../hooks/useSEO';
import itemsImgOne from '../assets/images/itemsImgOne.jpeg';
import itemsImgTwo from '../assets/images/itemsImgTwo.jpeg';
import itemsImgThree from '../assets/images/itemsImgThree.jpeg';

interface ItemsPageProps {
  selectedItems: OrderItem[];
  isGetMe?: boolean;
  isSubscribe?: boolean;
  onAddItem: (item: GiftItem, quantity: number, subscriptionOption?: SubscriptionOption, dropOffDay?: string) => void;
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
  const [selectedDropOffDay, setSelectedDropOffDay] = useState<string | null>(null);
  const [showDurationSelector, setShowDurationSelector] = useState(false);
  const [showDropOffSelector, setShowDropOffSelector] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const regularItems = useItems();
  const subscribableItems = useSubscribableItems();
  const { results: searchResults, loading: searchLoading, error: searchError, search: performSearch } = useSearchItems();
  const { items, loading, error: apiError, hasMore, loadMore } = isSubscribe ? subscribableItems : regularItems;

  // Set SEO metadata for items page
  useSEO({
    title: isSubscribe 
      ? 'Subscribe to Gifts - BOQBOX' 
      : isGetMe 
      ? 'Create Your Wishlist - BOQBOX' 
      : 'Select Discreet Gifts - BOQBOX',
    description: isSubscribe
      ? 'Subscribe to regular deliveries of your favorite items. Flexible durations and easy management.'
      : isGetMe
      ? 'Create a personal wishlist for gifts you\'d like to receive.'
      : 'Browse and select from our collection of quality gifts for discreet delivery.',
    keywords: 'select gifts, gift shopping, discreet delivery, gift subscriptions, wishlist, Lagos',
  });

  // Handle search functionality
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setError('');

    if (!query.trim()) {
      setIsSearching(false);
      setCurrentItem(null);
      setSelectedOption(null);
      setSelectedDropOffDay(null);
      setShowDurationSelector(false);
      setShowDropOffSelector(false);
      return;
    }

    // Clear all selection states when searching
    setCurrentItem(null);
    setSelectedOption(null);
    setSelectedDropOffDay(null);
    setShowDurationSelector(false);
    setShowDropOffSelector(false);
    setIsSearching(true);
    const searchType = isSubscribe ? 'subscription' : 'regular';
    await performSearch(query, searchType);
  };

  // Helper function to check if an item can be added to current flow
  const canAddItem = (item: GiftItem): boolean => {
    if (isSubscribe) {
      // In subscription flow, only allow items with options
      return !!(item.options && item.options.length > 0);
    } else {
      // In regular flow, don't allow items with options
      return !(item.options && item.options.length > 0);
    }
  };

  const handleAddItem = () => {
    if (!currentItem) {
      setError('Please select a gift item to add');
      return;
    }

    // Validate item type matches current flow
    if (!canAddItem(currentItem)) {
      setError(isSubscribe ? 'Please select a subscription item' : 'Please select a regular gift item');
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
      if (!showDropOffSelector) {
        setShowDropOffSelector(true);
        return;
      }
      if (!selectedDropOffDay) {
        setError('Please select a drop-off day');
        return;
      }
    }
    
    // Ensure the item has a valid ID
    const itemId = currentItem._id || currentItem.id;
    if (!itemId) {
      setError('Item is missing an ID. Please try again.');
      return;
    }
    
    setError('');
    onAddItem(currentItem, currentQuantity, isSubscribe ? selectedOption || undefined : undefined, isSubscribe ? selectedDropOffDay || undefined : undefined);
    
    // Reset state to allow adding more items
    setCurrentItem(null);
    setCurrentQuantity(1);
    setSelectedOption(null);
    setSelectedDropOffDay(null);
    setShowDurationSelector(false);
    setShowDropOffSelector(false);
    // Don't clear search - allow user to continue searching and adding items
    // setSearchQuery('');
    // setIsSearching(false);
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

  // Effect to clear mismatched items and current selection when flow changes
  React.useEffect(() => {
    // Clear current item if it doesn't match the flow
    if (currentItem && !canAddItem(currentItem)) {
      setCurrentItem(null);
      setShowDurationSelector(false);
      setShowDropOffSelector(false);
      setSelectedOption(null);
      setSelectedDropOffDay(null);
    }

    // Remove any selected items that don't match the current flow
    const filteredItems = selectedItems.filter((oi) => canAddItem(oi.item));
    if (filteredItems.length !== selectedItems.length) {
      onUpdateItems(filteredItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubscribe, selectedItems]);

  const handleContinue = () => {
    if (selectedItems.length === 0) {
      setError(isSubscribe ? 'Please add at least one subscription item to continue' : 'Please add at least one gift item to continue');
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
    // Fall back to static images - ensure index is always valid and positive
    const images = [itemsImgOne, itemsImgTwo, itemsImgThree];
    const safeIndex = Math.max(0, index) % 3;
    return images[safeIndex];
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

        {/* Search Input */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: 14,
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {apiError && <p className="form-error" style={{ marginBottom: 16 }}>Error loading items: {apiError}</p>}

        {isSubscribe ? (
          // Subscription List View
          <>
            <div style={{ marginBottom: 20, width: '100%' }}>
              {(isSearching ? searchResults : items).map((item, index) => (
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
                    width: '100%',
                    boxSizing: 'border-box',
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
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontSize: 16, 
                          fontWeight: 600, 
                          color: '#1F2937', 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%',
                        }}>
                          {item.name}
                        </div>
                      </div>
                      {/* Expand details button */}
                      <button
                        onClick={() => {
                          const itemId = (item._id || item.id) || '';
                          setExpandedItemId(expandedItemId === itemId ? null : itemId);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#FB923C',
                          fontSize: 20,
                          flexShrink: 0,
                        }}
                        title="View details"
                      >
                        {expandedItemId === ((item._id || item.id) || '') ? '▼' : '▶'}
                      </button>
                    </div>

                    {/* Expanded details */}
                    {expandedItemId === ((item._id || item.id) || '') && (
                      <div style={{
                        background: '#F9FAFB',
                        borderRadius: 8,
                        padding: '12px',
                        marginBottom: 12,
                        fontSize: 13,
                        color: '#6B7280',
                        lineHeight: '1.5',
                      }}>
                        <strong style={{ color: '#1F2937', display: 'block', marginBottom: 6 }}>Product Details</strong>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Name:</strong> {item.name}
                        </div>
                        {item.description && (
                          <div>
                            <strong>Description:</strong> {item.description}
                          </div>
                        )}
                      </div>
                    )}
                    
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

            {searchLoading && isSearching && <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: 16 }}>Searching items...</p>}

            {!isSearching && loading && <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: 16 }}>Loading items...</p>}

            {searchError && isSearching && <p className="form-error" style={{ marginBottom: 16 }}>{searchError}</p>}

            {!isSearching && hasMore && !loading && (
              <button
                className="continue-btn"
                onClick={loadMore}
                style={{ marginBottom: 16, background: '#E5E7EB', color: '#374151' }}
              >
                Load More Items
              </button>
            )}

            {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

            {/* Duration Selector Modal */}
            {currentItem && showDurationSelector && currentItem.options && !showDropOffSelector && (
              <>
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }} onClick={() => {
                  setCurrentItem(null);
                  setShowDurationSelector(false);
                  setSelectedOption(null);
                }}>
                  <div style={{
                    background: '#FFFFFF',
                    borderRadius: 16,
                    padding: '24px',
                    maxWidth: '90%',
                    width: '400px',
                    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
                  }} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', marginBottom: 16, textAlign: 'center' }}>Select Duration</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      {currentItem.options.map((option) => (
                        <button
                          key={option._id}
                          onClick={() => {
                            setSelectedOption(option);
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
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => {
                          setCurrentItem(null);
                          setShowDurationSelector(false);
                          setSelectedOption(null);
                        }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: '#F3F4F6',
                          color: '#374151',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowDropOffSelector(true);
                        }}
                        disabled={!selectedOption}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: selectedOption ? '#FB923C' : '#E5E7EB',
                          color: selectedOption ? '#FFFFFF' : '#9CA3AF',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: selectedOption ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedOption) {
                            e.currentTarget.style.backgroundColor = '#EA7317';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedOption) {
                            e.currentTarget.style.backgroundColor = '#FB923C';
                          }
                        }}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Drop-Off Day Selector Modal */}
            {currentItem && showDurationSelector && showDropOffSelector && (
              <>
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }} onClick={() => {
                  setCurrentItem(null);
                  setShowDurationSelector(false);
                  setShowDropOffSelector(false);
                  setSelectedDropOffDay(null);
                }}>
                  <div style={{
                    background: '#FFFFFF',
                    borderRadius: 16,
                    padding: '24px',
                    maxWidth: '90%',
                    width: '400px',
                    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
                  }} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', marginBottom: 16, textAlign: 'center' }}>Select Drop-Off Day</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                        <button
                          key={day}
                          onClick={() => {
                            setSelectedDropOffDay(day);
                          }}
                          style={{
                            padding: '16px',
                            backgroundColor: selectedDropOffDay === day ? '#FB923C' : '#F3F4F6',
                            color: selectedDropOffDay === day ? '#FFFFFF' : '#374151',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedDropOffDay !== day) {
                              e.currentTarget.style.backgroundColor = '#E5E7EB';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedDropOffDay !== day) {
                              e.currentTarget.style.backgroundColor = '#F3F4F6';
                            }
                          }}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => {
                          setShowDropOffSelector(false);
                          setCurrentItem(null);
                          setSelectedOption(null);
                          setSelectedDropOffDay(null);
                          setShowDurationSelector(false);
                        }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: '#F3F4F6',
                          color: '#374151',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          handleAddItem();
                        }}
                        disabled={!selectedDropOffDay}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: selectedDropOffDay ? '#FB923C' : '#E5E7EB',
                          color: selectedDropOffDay ? '#FFFFFF' : '#9CA3AF',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: selectedDropOffDay ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedDropOffDay) {
                            e.currentTarget.style.backgroundColor = '#EA7317';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedDropOffDay) {
                            e.currentTarget.style.backgroundColor = '#FB923C';
                          }
                        }}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          // Regular Grid View
          <>
            <div className="items-grid">
              {(isSearching ? searchResults : items).map((item, index) => (
                <div
                  key={item._id || item.id}
                  className={`item-card ${currentItem?._id === item._id || currentItem?.id === item.id ? 'selected' : ''}`}
                  onClick={() => { 
                    setCurrentItem({...item}); 
                    setError(''); 
                    setCurrentQuantity(1);
                  }}
                >
                  <span className="item-cat-badge">{item.category}</span>
                  <img 
                    src={getItemImage(item, index)} 
                    alt={item.name} 
                    className="item-emoji" 
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                    onError={(e) => {
                      const images = [itemsImgOne, itemsImgTwo, itemsImgThree];
                      const fallbackIndex = Math.max(0, index) % 3;
                      (e.target as HTMLImageElement).src = images[fallbackIndex];
                    }}
                  />
                  <div className="item-name">{item.name}</div>
                  <div className="item-desc">{item.description}</div>
                  <div className="item-price">{formatNaira(item.price || 0)}</div>
                </div>
              ))}
            </div>

            {searchLoading && isSearching && <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: 16 }}>Searching items...</p>}

            {!isSearching && loading && <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: 16 }}>Loading items...</p>}

            {searchError && isSearching && <p className="form-error" style={{ marginBottom: 16 }}>{searchError}</p>}

            {!isSearching && hasMore && !loading && (
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

                <div style={{ background: '#FFF7ED', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#92400E', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span style={{ whiteSpace: 'nowrap' }}>{currentQuantity}×</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{currentItem.name}</span>
                  <span style={{ whiteSpace: 'nowrap' }}>· <strong>{formatNaira((currentItem.price || 0) * currentQuantity)}</strong></span>
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
                const safeIndex = itemIndex >= 0 ? itemIndex : 0;
                return (
                  <div
                    key={itemId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '12px 16px',
                      background: '#F5F5F5',
                      borderRadius: 8,
                      marginBottom: 8,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 200, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <img 
                        src={getItemImage(oi.item, safeIndex)} 
                        alt={oi.item.name} 
                        style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4, flexShrink: 0, marginTop: 2 }}
                        onError={(e) => {
                          const images = [itemsImgOne, itemsImgTwo, itemsImgThree];
                          const fallbackIndex = Math.max(0, safeIndex) % 3;
                          (e.target as HTMLImageElement).src = images[fallbackIndex];
                        }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#1F2937', wordBreak: 'break-word', lineHeight: 1.3 }}>
                          {oi.item.name}
                        </div>
                      </div>
                      {oi.subscriptionOption ? (
                        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                          <strong style={{ textTransform: 'capitalize' }}>{oi.subscriptionOption.name}</strong> · {oi.subscriptionOption.quantity}
                          {oi.dropOffDay && <span> · 📅 {oi.dropOffDay}</span>}
                          = <strong>{formatNaira(oi.subscriptionOption.price)}</strong>
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                          {formatNaira(oi.item.price || 0)} × {oi.quantity} = <strong>{formatNaira((oi.item.price || 0) * oi.quantity)}</strong>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%', minWidth: 0, justifyContent: 'flex-end', order: 3 }}>
                      {!oi.subscriptionOption && (
                        <div className="quantity-controls" style={{ gap: 8, display: 'flex' }}>
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
