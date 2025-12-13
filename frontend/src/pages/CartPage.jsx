import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import ConfirmationModal from '../components/ConfirmationModal';
import RecommendedProducts from '../components/RecommendedProducts'; // Import the new component
import api from '../api/axiosConfig';
import { useSettings } from '../context/SettingsContext'; // Import settings hook

const BACKEND_URL = 'http://localhost:5000';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const { settings } = useSettings(); // Get global settings
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.discounted_price || item.price;
    return acc + item.quantity * price;
  }, 0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Helper function to format price based on selected currency
    const formatPrice = (amount) => {
      return new Intl.NumberFormat(settings.language, {
        style: 'currency',
        currency: settings.currency,
      }).format(amount);
    };
    const fetchRecommendations = async () => {
      if (cartItems.length === 0) {
        setRecommendedProducts([]);
        return;
      }
      try {
        // Get unique supplier IDs from the cart
        const supplierIds = [...new Set(cartItems.map(item => item.supplier_id))];
        
        // In a real app, you'd have a dedicated endpoint like:
        // const { data } = await api.get(`/products/recommendations?supplierIds=${supplierIds.join(',')}`);
        // setRecommendedProducts(data);

        // For now, we'll fetch all products and filter them on the frontend.
        const { data: allProducts } = await api.get('/products');
        const cartProductIds = new Set(cartItems.map(item => item.id));
        
        const recommendations = allProducts.filter(p => 
          supplierIds.includes(p.supplier_id) && !cartProductIds.has(p.id)
        ).slice(0, 10); // Show a maximum of 10 recommendations

        setRecommendedProducts(recommendations);
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      }
    };

    fetchRecommendations();
  }, [cartItems, settings.language, settings.currency]); // Add settings to dependency array

  // Helper function to format price based on selected currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat(settings.language, {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  };

  return (
    <div style={styles.page}>
      <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={() => { clearCart(); setIsClearModalOpen(false); }}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your shopping cart?"
      />
      <div style={styles.header}>
        <h1 style={styles.title}>Shopping Cart</h1>
        {cartItems.length > 0 && (
          <button onClick={() => setIsClearModalOpen(true)} style={styles.clearCartButton}>Clear All</button>
        )}
      </div>
      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <p>Your cart is empty.</p>
          <Link to="/" style={styles.shopLink}>Continue Shopping</Link>
        </div>
      ) : (
        <div style={{...styles.grid, gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr'}}>
          <div style={styles.cartItems}>
            {cartItems.map(item => (
              <div key={item.cartItemId} style={styles.itemCard}>
              <img 
                src={item.image_urls && item.image_urls.length > 0 ? `${BACKEND_URL}${item.image_urls[0]}` : 'https://placehold.co/80x80/e9ecef/6c757d?text=N/A'} 
                alt={item.name} style={styles.itemImage} 
              />
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemOptions}>
                    {item.color && `Color: ${item.color}`} {item.size && `Size: ${item.size}`}
                  </p>
                  <p style={styles.itemPrice}>{formatPrice(item.discounted_price || item.price)}</p>
                </div>
                <div style={styles.itemActions}>
                  <div style={styles.quantitySelector}>
                    <button style={styles.quantityBtn} onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}><FaMinus /></button>
                    <span style={styles.quantityValue}>{item.quantity}</span>
                    <button style={styles.quantityBtn} onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}><FaPlus /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.cartItemId)} style={styles.removeButton} title="Remove item"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
          <div style={{...styles.summary, position: isMobile ? 'relative' : 'sticky', top: isMobile ? '0' : '100px'}}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <input type="text" placeholder="Enter Promo Code" style={styles.promoInput} />
              <button style={styles.applyButton}>Apply</button>
            </div>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div style={{...styles.summaryRow, ...styles.totalRow}}>
              <strong>Total</strong>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <Link to="/checkout" style={{textDecoration: 'none'}}>
              <button style={styles.checkoutButton}>Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      )}
      {/* --- NEW RECOMMENDED PRODUCTS SECTION --- */}
      <RecommendedProducts products={recommendedProducts} />
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px 20px' },
  title: { fontSize: '2.5rem', fontWeight: 'bold', margin: 0 },
  emptyCart: { textAlign: 'center', padding: '80px 0', backgroundColor: 'white', borderRadius: '16px' },
  shopLink: { textDecoration: 'none', backgroundColor: '#007bff', color: 'white', padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' },
  cartItems: {}, // Removed styles that are now in page style
  itemCard: { display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  itemImage: { width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '20px' },
  itemDetails: { flexGrow: 1 },
  itemName: { margin: '0 0 5px 0', fontWeight: '600' },
  itemOptions: { margin: '0 0 10px 0', fontSize: '0.9rem', color: '#6c757d' },
  itemPrice: { margin: 0, fontWeight: 'bold' },
  itemActions: { display: 'flex', alignItems: 'center', gap: '20px' },
  quantitySelector: { display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px' },
  quantityBtn: { background: 'none', border: 'none', fontSize: '1rem', padding: '5px 10px', cursor: 'pointer' },
  quantityValue: { padding: '5px 10px', fontWeight: 'bold' },
  removeButton: {
    background: '#ffeef0',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: '100px', // Adjust based on your header height
  },
  summaryTitle: { marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '15px', fontSize: '1.4rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' },
  promoInput: {
    flexGrow: 1,
    border: '1px solid #ccc',
    borderRight: 'none',
    padding: '10px',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    outline: 'none',
  },
  applyButton: {
    padding: '10px 15px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: 'white',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    cursor: 'pointer',
  },
  totalRow: { fontSize: '1.2rem', paddingTop: '15px', borderTop: '1px solid #eee' },
  checkoutButton: { width: '100%', padding: '15px', border: 'none', borderRadius: '8px', backgroundColor: '#28a745', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' },
};

export default CartPage;