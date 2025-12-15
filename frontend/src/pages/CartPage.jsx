import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    return acc + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyCartContainer}>
        <h2 style={styles.title}>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
      </div>
    );
  }

  // Endless scroll logic for recommended products
  const lastProductElementRef = useCallback(
    (node) => {
      if (recLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setRecPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [recLoading, hasMore]
  );

  // Fetch recommended products
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

  return (
    <div style={styles.page(isMobile)}>
      <div style={styles.layout(isMobile)}>
        {/* Cart Items */}
        {isMobile ? (
          <div style={styles.itemsList}>
            {cartItems.map((item) => {
              const price = parseFloat(item.price) || 0;
              return (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  style={styles.item(isMobile)}
                >
                  <img
                    src={getImageUrl(item.image_urls[0])}
                    alt={item.name}
                    style={styles.itemImage(isMobile)}
                  />
                  <div style={styles.itemContentMobile}>
                    <div style={styles.itemDetails}>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemPrice}>${price.toFixed(2)}</p>
                      {item.color && <p style={styles.itemVariant}>Color: {item.color}</p>}
                      {item.size && <p style={styles.itemVariant}>Size: {item.size}</p>}
                    </div>
                    <div style={styles.itemActions}>
                      <div style={styles.quantitySelector}>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                          }
                          style={styles.quantityBtn}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={styles.quantityBtn}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={styles.removeBtn}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={{ ...styles.th, ...styles.thProduct }}>Product</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Subtotal</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const price = parseFloat(item.price) || 0;
                return (
                  <tr
                    key={`${item.id}-${item.color}-${item.size}`}
                    style={styles.tableRow}
                  >
                    <td style={styles.td}>
                      <div style={styles.productCell}>
                        <img
                          src={getImageUrl(item.image_urls[0])}
                          alt={item.name}
                          style={styles.itemImage(isMobile)}
                        />
                        <div>
                          <p style={styles.itemName}>{item.name}</p>
                          {item.color && (
                            <p style={styles.itemVariant}>Color: {item.color}</p>
                          )}
                          {item.size && (
                            <p style={styles.itemVariant}>Size: {item.size}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>${price.toFixed(2)}</td>
                    <td style={styles.td}>
                      <div style={styles.quantitySelector}>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                          }
                          style={styles.quantityBtn}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={styles.quantityBtn}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={styles.td}>${(price * item.quantity).toFixed(2)}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={styles.removeBtn}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Desktop Summary */}
        {!isMobile && (
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
              <strong>Total</strong>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <button onClick={handleCheckout} style={styles.checkoutButton}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* Recommended Products */}
      <div style={styles.recommendationsContainer}>
        <h2 style={styles.recommendationsTitle}>You Might Also Like</h2>
        <div style={styles.productGrid(isMobile)}>
          {recommendedProducts.map((product, index) => {
            const isLast = index === recommendedProducts.length - 1;
            return (
              <div ref={isLast ? lastProductElementRef : null} key={product.id}>
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
        {recLoading && <p style={{ textAlign: 'center' }}>Loading more products...</p>}
      </div>

      {/* Mobile Sticky Checkout */}
      {isMobile && (
        <div style={styles.stickyFooter}>
          <div style={styles.stickySummary}>
            <div>
              <strong>Total</strong>
              <div>${subtotal.toFixed(2)}</div>
            </div>
            <button onClick={handleCheckout} style={styles.stickyCheckoutButton}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: (isMobile) => ({
    maxWidth: '1200px',
    margin: '40px auto',
    padding: isMobile ? '0 15px 120px 15px' : '0 20px',
    fontFamily: 'system-ui, sans-serif',
  }),
  layout: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
    gap: '30px',
  }),
  itemsList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  tableHead: { borderBottom: '2px solid #dee2e6' },
  th: {
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#495057',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
  },
  thProduct: { width: '50%' },
  tableRow: { borderBottom: '1px solid #f1f3f5' },
  td: { padding: '15px', verticalAlign: 'middle' },
  productCell: { display: 'flex', alignItems: 'center', gap: '15px' },
  item: (isMobile) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    gap: '15px',
    flexDirection: 'row',
  }),
  itemImage: (isMobile) => ({
    width: isMobile ? '70px' : '80px',
    height: isMobile ? '70px' : '80px',
    objectFit: 'cover',
    borderRadius: '4px',
    flexShrink: 0,
  }),
  itemContentMobile: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 },
  itemDetails: { flexGrow: 1 },
  itemName: { fontWeight: '600', margin: '0 0 5px 0' },
  itemPrice: { color: '#555', margin: 0 },
  itemVariant: { fontSize: '0.85rem', color: '#777', margin: '4px 0 0 0' },
  itemActions: { display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' },
  quantitySelector: { display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px' },
  quantityBtn: { background: 'none', border: 'none', padding: '8px 12px', cursor: 'pointer', fontSize: '1rem' },
  removeBtn: { background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '1rem' },
  summary: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', height: 'fit-content' },
  summaryTitle: { marginTop: 0, fontSize: '1.4rem', borderBottom: '1px solid #eee', paddingBottom: '15px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', margin: '15px 0' },
  totalRow: { fontSize: '1.2rem', borderTop: '1px solid #eee', paddingTop: '15px' },
  checkoutButton: { width: '100%', padding: '15px', border: 'none', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  emptyCartContainer: { textAlign: 'center', padding: '80px 20px' },
  stickyFooter: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', padding: '15px', zIndex: 1000 },
  stickySummary: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  stickyCheckoutButton: { padding: '10px 25px', border: 'none', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  recommendationsContainer: { marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eee' },
  recommendationsTitle: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '25px' },
  productGrid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: isMobile ? '15px' : '25px',
  }),
};

export default CartPage;
