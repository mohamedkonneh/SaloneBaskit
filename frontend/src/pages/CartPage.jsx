import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from './imageUrl';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

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
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Home
        </button>
        <h2>Your Cart is Empty</h2>
        <p>Add some products to your cart.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Back to Home */}
      <button style={styles.backBtn} onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Home
      </button>

      {/* Cart Items */}
      <div style={styles.itemsList}>
        {cartItems.map((item) => {
          const price = parseFloat(item.price) || 0;
          return (
            <div key={item.id} style={styles.item}>
              <img src={getImageUrl(item.image_urls[0])} alt={item.name} style={styles.itemImage} />
              <div style={styles.itemDetails}>
                <p style={styles.itemName}>{item.name}</p>
                <p>${price.toFixed(2)}</p>
                {item.color && <p>Color: {item.color}</p>}
                {item.size && <p>Size: {item.size}</p>}
                <div style={styles.actions}>
                  <button onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}><FaTrash /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile / Desktop Sticky Checkout */}
      <div style={styles.stickyFooter}>
        <div>
          <strong>Total: ${subtotal.toFixed(2)}</strong>
        </div>
        <button style={styles.checkoutBtn} onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif', position: 'relative' },
  backBtn: { background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginBottom: '20px', fontSize: '16px' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '80px' },
  item: { display: 'flex', gap: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', alignItems: 'center' },
  itemImage: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' },
  itemDetails: { flexGrow: 1 },
  itemName: { fontWeight: 'bold', margin: '0 0 5px 0' },
  actions: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' },
  removeBtn: { color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' },
  stickyFooter: { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '15px', backgroundColor: 'white', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 },
  checkoutBtn: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  emptyCartContainer: { textAlign: 'center', padding: '60px 20px' },
};

export default CartPage;
