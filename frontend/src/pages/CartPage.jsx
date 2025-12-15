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
  const observer = useRef(null);

  // ✅ SAFE subtotal calculation
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyCartContainer}>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/" style={styles.shopLink}>Continue Shopping</Link>
      </div>
    );
  }

  // Infinite scroll ref
  const lastProductRef = useCallback(node => {
    if (recLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setRecPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [recLoading, hasMore]);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommended = async () => {
      setRecLoading(true);
      try {
        const { data } = await api.get('/products');
        const categories = [...new Set(cartItems.map(i => i.category))];
        const filtered = data.filter(
          p => categories.includes(p.category) &&
          !cartItems.some(ci => ci.id === p.id)
        );

        const slice = filtered.slice((recPage - 1) * 10, recPage * 10);
        setRecommendedProducts(prev => [...prev, ...slice]);
        setHasMore(slice.length > 0);
      } catch (e) {
        console.error(e);
      }
      setRecLoading(false);
    };

    fetchRecommended();
  }, [cartItems, recPage]);

  return (
    <div style={styles.page(isMobile)}>
      <h1 style={styles.title}>Shopping Cart</h1>

      <div style={styles.layout(isMobile)}>
        {/* CART ITEMS */}
        <div style={styles.itemsList}>
          {cartItems.map(item => {
            const price = Number(item.price || 0);

            return (
              <div key={`${item.id}-${item.color}-${item.size}`} style={styles.item}>
                <img
                  src={getImageUrl(item.image_urls?.[0])}
                  alt={item.name}
                  style={styles.itemImage}
                />

                <div style={styles.itemContent}>
                  <div>
                    <strong>{item.name}</strong>
                    <div>${price.toFixed(2)}</div>
                    {item.color && <div>Color: {item.color}</div>}
                    {item.size && <div>Size: {item.size}</div>}
                  </div>

                  <div style={styles.itemActions}>
                    <div style={styles.qtyBox}>
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
            );
          })}
        </div>

        {/* DESKTOP SUMMARY */}
        {!isMobile && (
          <div style={styles.summary}>
            <h3>Order Summary</h3>
            <div style={styles.row}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div style={styles.row}><span>Shipping</span><span>Calculated at checkout</span></div>
            <div style={styles.total}><strong>Total</strong><strong>${subtotal.toFixed(2)}</strong></div>
            <button style={styles.checkoutBtn} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* RECOMMENDATIONS */}
      <div style={styles.recommendations}>
        <h2>You Might Also Like</h2>
        <div style={styles.grid(isMobile)}>
          {recommendedProducts.map((p, i) => {
            const last = i === recommendedProducts.length - 1;
            return (
              <div ref={last ? lastProductRef : null} key={p.id}>
                <ProductCard product={p} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ MOBILE STICKY CHECKOUT */}
      {isMobile && (
        <div style={styles.stickyFooter}>
          <div>
            <strong>Total</strong>
            <div>${subtotal.toFixed(2)}</div>
          </div>
          <button style={styles.stickyBtn} onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

/* ===================== STYLES ===================== */

const styles = {
  page: isMobile => ({
    maxWidth: 1200,
    margin: '30px auto',
    padding: isMobile ? '0 15px 120px' : '0 20px',
    fontFamily: 'system-ui'
  }),
  title: { marginBottom: 20 },
  layout: isMobile => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
    gap: 30
  }),
  itemsList: { display: 'flex', flexDirection: 'column', gap: 15 },
  item: {
    display: 'flex',
    gap: 15,
    background: '#fff',
    padding: 15,
    borderRadius: 8
  },
  itemImage: { width: 80, height: 80, objectFit: 'cover' },
  itemContent: { flex: 1, display: 'flex', justifyContent: 'space-between' },
  itemActions: { display: 'flex', alignItems: 'center', gap: 15 },
  qtyBox: { display: 'flex', gap: 10, alignItems: 'center' },
  removeBtn: { border: 'none', background: 'none', color: 'red' },
  summary: { background: '#fff', padding: 20, borderRadius: 8 },
  row: { display: 'flex', justifyContent: 'space-between', margin: '10px 0' },
  total: { display: 'flex', justifyContent: 'space-between', fontSize: 18 },
  checkoutBtn: { marginTop: 15, padding: 15 },
  recommendations: { marginTop: 50 },
  grid: isMobile => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(250px,1fr))',
    gap: 20
  }),
  stickyFooter: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    boxShadow: '0 -2px 10px rgba(0,0,0,.1)',
    zIndex: 1000
  },
  stickyBtn: {
    padding: '10px 25px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 8
  },
  emptyCartContainer: { textAlign: 'center', padding: 80 },
  shopLink: { display: 'inline-block', marginTop: 20 }
};

export default CartPage;
