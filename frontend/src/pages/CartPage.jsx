import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { getImageUrl } from './imageUrl';
import { FaTrash } from 'react-icons/fa';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recPage, setRecPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const handleCheckout = () => navigate('/checkout');

  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyCartContainer}>
        <h2 style={styles.title}>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" style={styles.shopLink}>Continue Shopping</Link>
      </div>
    );
  }

  const lastProductElementRef = useCallback(node => {
    if (recLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setRecPage(p => p + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [recLoading, hasMore]);

  useEffect(() => {
    const fetchRecommended = async () => {
      setRecLoading(true);
      try {
        const categories = [...new Set(cartItems.map(i => i.category))];
        const { data } = await api.get('/products');
        const filtered = data.filter(
          p => categories.includes(p.category) &&
          !cartItems.find(c => c.id === p.id)
        );
        const next = filtered.slice((recPage - 1) * 10, recPage * 10);
        setRecommendedProducts(prev => [...prev, ...next]);
        setHasMore(next.length > 0);
      } catch (e) {
        console.error(e);
      }
      setRecLoading(false);
    };
    fetchRecommended();
  }, [cartItems, recPage]);

  return (
    <>
      {/* PAGE CONTENT */}
      <div style={styles.page(isMobile)}>
        <h1 style={styles.title}>Shopping Cart</h1>

        <div style={styles.layout(isMobile)}>
          <div style={styles.itemsList}>
            {cartItems.map(item => (
              <div key={`${item.id}-${item.color}-${item.size}`} style={styles.item}>
                <img
                  src={getImageUrl(item.image_urls[0])}
                  alt={item.name}
                  style={styles.itemImage}
                />
                <div style={{ flex: 1 }}>
                  <p style={styles.itemName}>{item.name}</p>
                  <p>${item.price.toFixed(2)}</p>
                  <div style={styles.itemActions}>
                    <div style={styles.quantitySelector}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isMobile && (
            <div style={styles.summary}>
              <h3>Order Summary</h3>
              <div style={styles.summaryRow}>
                <span>Total</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <button style={styles.checkoutButton} onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>

        <div style={styles.recommendationsContainer}>
          <h2>You Might Also Like</h2>
          <div style={styles.productGrid(isMobile)}>
            {recommendedProducts.map((p, i) => (
              <div
                key={p.id}
                ref={i === recommendedProducts.length - 1 ? lastProductElementRef : null}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ MOBILE STICKY CHECKOUT — OUTSIDE PAGE */}
      {isMobile && (
        <div style={styles.stickyFooter}>
          <div>
            <strong>Total</strong>
            <div>${subtotal.toFixed(2)}</div>
          </div>
          <button style={styles.stickyCheckoutButton} onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </>
  );
};

const styles = {
  page: isMobile => ({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '15px 15px 120px' : '20px'
  }),
  layout: isMobile => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
    gap: '30px'
  }),
  itemsList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  item: {
    display: 'flex',
    gap: '15px',
    padding: '15px',
    background: '#fff',
    borderRadius: '8px'
  },
  itemImage: { width: 70, height: 70, objectFit: 'cover' },
  itemName: { fontWeight: 600 },
  itemActions: { display: 'flex', justifyContent: 'space-between', marginTop: 10 },
  quantitySelector: { display: 'flex', gap: 10 },
  removeBtn: { background: 'none', border: 'none', color: 'red' },
  summary: { background: '#fff', padding: 20, borderRadius: 8 },
  summaryRow: { display: 'flex', justifyContent: 'space-between' },
  checkoutButton: { width: '100%', padding: 15, marginTop: 15 },
  stickyFooter: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.15)',
    zIndex: 9999
  },
  stickyCheckoutButton: {
    padding: '10px 25px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px'
  }
};

export default CartPage;
