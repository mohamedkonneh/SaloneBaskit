import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { getImageUrl } from './imageUrl';
import { FaTrash } from 'react-icons/fa';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyCartContainer}>
        <h2 style={styles.title}>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" style={styles.shopLink}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={styles.page(isMobile)}>
      <h1 style={styles.title}>Shopping Cart</h1>
      <div style={styles.layout(isMobile)}>
        <div style={styles.itemsList}>
          {cartItems.map(item => (
            <div key={`${item.id}-${item.color}-${item.size}`} style={styles.item(isMobile)}>
              <img src={getImageUrl(item.image_urls[0])} alt={item.name} style={styles.itemImage} />
              <div style={styles.itemDetails}>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemPrice}>${Number(item.price).toFixed(2)}</p>
                {item.color && <p style={styles.itemVariant}>Color: {item.color}</p>}
                {item.size && <p style={styles.itemVariant}>Size: {item.size}</p>}
              </div>
              <div style={styles.itemActions}>
                <div style={styles.quantitySelector}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={styles.quantityBtn}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={styles.quantityBtn}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>

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
          <div style={{...styles.summaryRow, ...styles.totalRow}}>
            <strong>Total</strong>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <button onClick={handleCheckout} style={styles.checkoutButton}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: (isMobile) => ({
    maxWidth: '1200px',
    margin: '40px auto',
    padding: isMobile ? '0 15px' : '0 20px',
    fontFamily: 'system-ui, sans-serif',
  }),
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  layout: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
    gap: '30px',
  }),
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  item: (isMobile) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    gap: '15px',
    flexDirection: isMobile ? 'column' : 'row',
    textAlign: isMobile ? 'center' : 'left',
  }),
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  itemDetails: {
    flexGrow: 1,
  },
  itemName: {
    fontWeight: '600',
    margin: '0 0 5px 0',
  },
  itemPrice: {
    color: '#555',
    margin: 0,
  },
  itemVariant: {
    fontSize: '0.85rem',
    color: '#777',
    margin: '4px 0 0 0',
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  quantitySelector: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  quantityBtn: {
    background: 'none',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  summary: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    height: 'fit-content', // So it doesn't stretch
  },
  summaryTitle: {
    marginTop: 0,
    fontSize: '1.4rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '15px 0',
  },
  totalRow: {
    fontSize: '1.2rem',
    borderTop: '1px solid #eee',
    paddingTop: '15px',
  },
  checkoutButton: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  emptyCartContainer: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  shopLink: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
  },
};

export default CartPage;
