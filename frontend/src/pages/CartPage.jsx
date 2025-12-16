import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { getImageUrl } from './imageUrl';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, addToCart } = useCart();
  const { convertPrice } = useSettings();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      // Only fetch suggestions on mobile when the cart is not empty
      if (isMobile && cartItems.length > 0) {
        try {
          const { data } = await api.get('/products');
          // Exclude items already in the cart from suggestions
          const cartItemIds = new Set(cartItems.map(item => item.id));
          const filteredProducts = data.filter(p => !cartItemIds.has(p.id));
          // Shuffle and take a few products to display
          const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
          setSuggestedProducts(shuffled.slice(0, 6)); // Show up to 6 suggestions
        } catch (error) {
          console.error("Failed to fetch suggested products", error);
        }
      }
    };
    fetchSuggestedProducts();
  }, [isMobile, cartItems.length]); // Re-fetch if cart content changes

  const handleSelectItem = (itemId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleRemoveSelected = () => {
    // This would call a new function in CartContext, e.g., `removeMultiple(selectedItems)`
    console.log("Removing selected items:", Array.from(selectedItems));
  };

  return (
    <div style={styles.container}>
      {!isMobile && <h1 style={styles.title}>Your Shopping Cart</h1>}

      {cartItems.length === 0 ? (
        <p style={styles.text}>Your cart is currently empty. <Link to="/categories">Start shopping!</Link></p>
      ) : (
        <>
          {isMobile && (
            <div style={styles.mobileTopBar}>
              <button onClick={() => navigate(-1)} style={styles.backButton}><FaArrowLeft /></button>
              <div style={styles.mobileTotal}>
                <span>Total: </span>
                <strong>{convertPrice(cartTotal)}</strong>
              </div>
              <Link to="/checkout" style={styles.mobileCheckoutButton}>Checkout</Link>
            </div>
          )}

          <div style={styles.cartLayout(isMobile)}>
            <div style={styles.itemsList}>
              {cartItems.map(item => (
                <div key={item.id} style={styles.item(isMobile, item.count_in_stock < 10)}>
                  <div style={styles.selectionContainer}>
                    <input 
                      type="checkbox" 
                      style={styles.checkbox}
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                    <div style={styles.imageContainer}>
                      <img src={getImageUrl(item.image_urls[0])} alt={item.name} style={styles.itemImage} />
                      {item.count_in_stock < 10 && (
                        <span style={styles.stockIndicator}>Only {item.count_in_stock} left!</span>
                      )}
                    </div>
                  </div>
                  <div style={styles.itemDetails}>
                    <div style={styles.itemInfo}>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      <p style={styles.itemPrice}>{convertPrice(item.price)}</p>
                    </div>
                    <div style={styles.itemActions}>
                      <div style={styles.quantityStepper}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={styles.stepperButton}>-</button>
                        <span style={styles.quantityDisplay}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={styles.stepperButton}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={styles.removeButton} title="Remove item">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedItems.size > 0 && (
              <button onClick={handleRemoveSelected} style={styles.removeSelectedButton}>Remove Selected ({selectedItems.size})</button>
            )}

            {!isMobile && (
              <div style={styles.summary}>
                <h2 style={styles.summaryTitle}>Order Summary</h2>
                <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{convertPrice(cartTotal)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div style={{...styles.summaryRow, ...styles.summaryTotal}}>
                  <span>Total</span>
                  <span>{convertPrice(cartTotal)}</span>
                </div>
                <Link to="/checkout" style={styles.checkoutButton}>Proceed to Checkout</Link>
              </div>
            )}
          </div>

          {isMobile && (
            <div style={styles.suggestionsSection}>
              <h2 style={styles.suggestionsTitle}>You Might Also Like</h2>
              <div style={styles.suggestionsGrid}>
                {suggestedProducts.map(p => (
                  <div key={p.id} style={styles.suggestionCard}>
                    <Link to={`/product/${p.id}`}>
                      <img src={getImageUrl(p.image_urls[0])} alt={p.name} style={styles.suggestionImage} />
                    </Link>
                    <div style={styles.suggestionDetails}>
                      <span style={styles.suggestionPrice}>{convertPrice(p.price)}</span>
                      <button onClick={() => addToCart(p, 1)} style={styles.suggestionAddButton}><FaPlus /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  // ... existing styles
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  title: { fontSize: '2.2rem', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' },
  text: { fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'center' },
  cartLayout: (isMobile) => ({ 
    display: 'flex', 
    gap: '30px', 
    flexDirection: isMobile ? 'column' : 'row' 
  }),
  itemsList: { flex: 2 },
  item: (isMobile, isLowStock) => ({ 
    display: 'flex',
    alignItems: 'flex-start', // Align items to the top
    marginBottom: '20px', 
    borderBottom: '1px solid #eee', 
    paddingBottom: '20px',
    gap: '15px',
    animation: isLowStock ? 'shake 5s infinite' : 'none',
  }),
  selectionContainer: { display: 'flex', alignItems: 'center', gap: '15px' },
  checkbox: { width: '20px', height: '20px', accentColor: '#004085' },
  imageContainer: { position: 'relative' },
  itemImage: { 
    width: '80px', // Smaller image
    height: '80px', 
    objectFit: 'cover', 
    borderRadius: '8px',
    flexShrink: 0,
  },
  stockIndicator: {
    position: 'absolute',
    bottom: '-18px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#dc3545',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  itemDetails: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  itemInfo: { marginBottom: '15px' },
  itemName: { fontSize: '1.1rem', margin: '0 0 10px 0' },
  itemPrice: { fontSize: '1rem', color: '#555', margin: 0 },
  itemActions: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  removeButton: { border: 'none', background: 'transparent', color: '#6c757d', cursor: 'pointer', fontSize: '1rem' },
  quantityStepper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  stepperButton: {
    border: 'none', background: 'transparent', cursor: 'pointer', padding: '5px 10px', fontSize: '1rem'
  },
  quantityDisplay: { padding: '0 10px', fontSize: '1rem' },
  summary: { flex: 1, backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', height: 'fit-content' },
  summaryTitle: { fontSize: '1.5rem', marginBottom: '20px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  summaryTotal: { fontWeight: 'bold', fontSize: '1.2rem', borderTop: '1px solid #ddd', paddingTop: '15px' },
  removeSelectedButton: {
    width: '100%',
    padding: '12px',
    border: '1px solid #dc3545',
    borderRadius: '8px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  checkoutButton: { display: 'block', width: '100%', padding: '15px', border: 'none', borderRadius: '4px', backgroundColor: '#004085', color: 'white', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' },
  // --- Mobile-only styles ---
  mobileTopBar: { position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: 'white', zIndex: 10, borderBottom: '1px solid #eee', marginBottom: '15px' },
  backButton: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' },
  mobileTotal: { fontSize: '1rem' },
  mobileCheckoutButton: { padding: '8px 16px', backgroundColor: '#004085', color: 'white', textDecoration: 'none', borderRadius: '20px', fontSize: '0.9rem' },
  // --- Suggestion styles ---
  suggestionsSection: { marginTop: '40px', borderTop: '8px solid #f4f4f4', paddingTop: '20px' },
  suggestionsTitle: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' },
  suggestionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' },
  suggestionCard: { border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' },
  suggestionImage: { width: '100%', height: '150px', objectFit: 'cover', backgroundColor: '#f8f9fa' },
  suggestionDetails: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px' },
  suggestionPrice: { fontWeight: 'bold', fontSize: '0.9rem' },
  suggestionAddButton: {
    background: '#eef6ff',
    border: '1px solid #004085',
    color: '#004085',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  // Keyframe animation for shaking
  '@keyframes shake': {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
  },
};

export default CartPage;