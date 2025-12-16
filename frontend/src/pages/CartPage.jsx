import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { getImageUrl } from './imageUrl';
import { useMediaQuery } from '../hooks/useMediaQuery';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { convertPrice } = useSettings();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p style={styles.text}>Your cart is currently empty. <Link to="/categories">Start shopping!</Link></p>
      ) : (
        <div style={styles.cartLayout(isMobile)}>
          <div style={styles.itemsList}>
            {cartItems.map(item => (
              <div key={item.id} style={styles.item(isMobile)}>
                <img src={getImageUrl(item.image_urls[0])} alt={item.name} style={styles.itemImage(isMobile)} />
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemPrice}>{convertPrice(item.price)}</p>
                </div>
                <div style={styles.itemActions}>
                  <input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    style={styles.quantityInput}
                    min="1"
                  />
                  <button onClick={() => removeFromCart(item.id)} style={styles.removeButton}>Remove</button>
                </div>
              </div>
            ))}
          </div>
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
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  title: { fontSize: '2.2rem', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' },
  text: { fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'center' },
  cartLayout: (isMobile) => ({ 
    display: 'flex', 
    gap: '30px', 
    flexDirection: isMobile ? 'column' : 'row' 
  }),
  itemsList: { flex: 2 },
  item: (isMobile) => ({ 
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: '20px', 
    borderBottom: '1px solid #eee', 
    paddingBottom: '20px',
    flexDirection: isMobile ? 'column' : 'row',
  }),
  itemImage: (isMobile) => ({ width: isMobile ? '100%' : '100px', height: isMobile ? 'auto' : '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: isMobile ? '15px' : '0' }),
  itemDetails: { flex: 1, marginLeft: '20px' },
  itemName: { fontSize: '1.1rem', margin: '0 0 10px 0' },
  itemPrice: { fontSize: '1rem', color: '#555', margin: 0 },
  itemActions: { display: 'flex', alignItems: 'center', gap: '10px' },
  quantityInput: { width: '50px', textAlign: 'center', padding: '5px' },
  removeButton: { border: 'none', background: 'transparent', color: '#dc3545', cursor: 'pointer' },
  summary: { flex: 1, backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', height: 'fit-content' },
  summaryTitle: { fontSize: '1.5rem', marginBottom: '20px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  summaryTotal: { fontWeight: 'bold', fontSize: '1.2rem', borderTop: '1px solid #ddd', paddingTop: '15px' },
  checkoutButton: { display: 'block', width: '100%', padding: '15px', border: 'none', borderRadius: '4px', backgroundColor: '#004085', color: 'white', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' },
};

export default CartPage;