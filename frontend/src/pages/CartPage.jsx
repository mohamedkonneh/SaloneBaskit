import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { getImageUrl } from './imageUrl';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import { createPortal } from 'react-dom';

const MobileCheckoutBar = ({ total, onCheckout }) => {
  return createPortal(
    <div style={styles.stickyFooter}>
      <div style={styles.stickySummary}>
        <div>
          <strong>Total</strong>
          <div>${Number(total).toFixed(2)}</div>
        </div>
        <button onClick={onCheckout} style={styles.stickyCheckoutButton}>
          Checkout
        </button>
      </div>
    </div>,
    document.body
  );
};

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
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  const handleCheckout = () => navigate('/checkout');

  const lastProductElementRef = useCallback(
    (node) => {
      if (recLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) setRecPage((prev) => prev + 1);
      });
      if (node) observer.current.observe(node);
    },
    [recLoading, hasMore]
  );

  useEffect(() => {
    const fetchRecommended = async () => {
      if (cartItems.length === 0) return;
      setRecLoading(true);
      try {
        const categoriesInCart = [...new Set(cartItems.map((item) => item.category))];
        const { data } = await api.get('/products');
        const filtered = data.filter(
          (p) =>
            categoriesInCart.includes(p.category) &&
            !cartItems.find((cartItem) => cartItem.id === p.id)
        );

        const newProducts = filtered.slice((recPage - 1) * 10, recPage * 10);
        setRecommendedProducts((prev) => [...prev, ...newProducts]);
        setHasMore(newProducts.length > 0);
      } catch (error) {
        console.error('Failed to fetch recommendations', error);
      }
      setRecLoading(false);
    };

    fetchRecommended();
  }, [cartItems, recPage]);

  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyCartContainer}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Home
        </button>
        <h2>Your Cart is Empty</h2>
        <p>Add some products to your cart.</p>
      </div>
    );
  }

  return (
    <div style={styles.page(isMobile)}>
      {/* Back to Home */}
      <button style={styles.backBtn} onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Home
      </button>

      {/* Cart Items */}
      <div style={styles.itemsList}>
        {cartItems.map((item) => (
          <div key={item.id} style={styles.item(isMobile)}>
            <img src={getImageUrl(item.image_urls[0])} alt={item.name} style={styles.itemImage(isMobile)} />
            <div style={styles.itemContentMobile}>
              <div style={styles.itemDetails}>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemPrice}>${Number(item.price).toFixed(2)}</p>
                {item.color && <p style={styles.itemVariant}>Color: {item.color}</p>}
                {item.size && <p style={styles.itemVariant}>Size: {item.size}</p>}
              </div>
              <div style={styles.itemActions}>
                <div style={styles.quantitySelector}>
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
                    style={styles.quantityBtn}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={styles.quantityBtn}>
                    +
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div style={styles.recommendationsContainer}>
          <h2 style={styles.recommendationsTitle}>You Might Also Like</h2>
          <div style={styles.productGrid(isMobile)}>
            {recommendedProducts.map((product, index) => {
              const isLast = index + 1 === recommendedProducts.length;
              return (
                <div key={product.id} ref={isLast ? lastProductElementRef : null}>
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
          {recLoading && <p style={{ textAlign: 'center' }}>Loading more products...</p>}
        </div>
      )}

      {/* Mobile Sticky Checkout */}
      {isMobile && cartItems.length > 0 && <MobileCheckoutBar total={subtotal} onCheckout={handleCheckout} />}
    </div>
  );
};

const styles = {
  page: (isMobile) => ({ maxWidth: '1200px', margin: '20px auto', padding: isMobile ? '0 15px 100px 15px' : '0 20px', fontFamily: 'system-ui, sans-serif' }),
  backBtn: { background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginBottom: '20px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 5 },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '80px' },
  item: (isMobile) => ({
    display: 'flex',
    gap: '15px',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    alignItems: 'center',
    flexDirection: 'row',
  }),
  itemImage: (isMobile) => ({ width: isMobile ? 70 : 80, height: isMobile ? 70 : 80, objectFit: 'cover', borderRadius: 4 }),
  itemContentMobile: { display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' },
  itemDetails: { flexGrow: 1 },
  itemName: { fontWeight: '600', margin: '0 0 5px 0' },
  itemPrice: { margin: 0 },
  itemVariant: { fontSize: 12, color: '#555', margin: '2px 0' },
  itemActions: { display: 'flex', gap: 15, alignItems: 'center', marginTop: 10 },
  quantitySelector: { display: 'flex', border: '1px solid #ccc', borderRadius: 5, alignItems: 'center' },
  quantityBtn: { border: 'none', background: 'none', padding: '5px 10px', cursor: 'pointer', fontSize: 14 },
  removeBtn: { border: 'none', background: 'none', color: '#dc3545', cursor: 'pointer', fontSize: 16 },
  stickyFooter: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '0 16px',
    backgroundColor: 'white',
    borderTop: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 999999,
    height: 70,
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  stickySummary: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  stickyCheckoutButton: { padding: '12px 28px', border: 'none', borderRadius: 8, backgroundColor: '#007bff', color: 'white', fontSize: 16, fontWeight: 'bold', cursor: 'pointer' },
  recommendationsContainer: { marginTop: 60, paddingTop: 40, borderTop: '1px solid #eee' },
  recommendationsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 25 },
  productGrid: (isMobile) => ({ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))', gap: isMobile ? 15 : 25 }),
};

export default CartPage;
