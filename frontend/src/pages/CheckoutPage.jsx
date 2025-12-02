import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../context/SettingsContext'; // Import settings hook
import api from '../api/axiosConfig';

const BACKEND_URL = 'http://localhost:5000';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { settings } = useSettings(); // Get global settings
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { userInfo } = useAuth();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', address: '', city: 'Freetown', phone: ''
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [paymentDetails, setPaymentDetails] = useState({
    mobileMoneyNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.discounted_price || item.price) * item.quantity, 0);
  const shippingFee = 0; // Assuming free shipping for now
  const total = subtotal + shippingFee;

  // Helper function to format price based on selected currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat(settings.language, {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: shippingInfo,
        paymentMethod: paymentMethod,
        totalPrice: total,
      };
      const { data } = await api.post('/orders', orderData);

      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/my-orders`); // Navigate to the user's order list

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Checkout</h1>
        <p>Your cart is empty. You cannot proceed to checkout.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Checkout</h1>
      <form onSubmit={handlePlaceOrder} style={{...styles.grid, gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr'}}>
        {/* Left Column: Shipping & Payment */}
        <div style={styles.leftColumn}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Shipping Information</h2>
            <input name="fullName" value={shippingInfo.fullName} onChange={handleInputChange} placeholder="Full Name" style={styles.input} required />
            <input name="address" value={shippingInfo.address} onChange={handleInputChange} placeholder="Address" style={styles.input} required />
            <input name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="City" style={styles.input} required />
            <input name="phone" value={shippingInfo.phone} onChange={handleInputChange} placeholder="Phone Number" style={styles.input} required />
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Payment Method</h2>
            <div style={styles.paymentOptions}>
              <div onClick={() => setPaymentMethod('cod')} style={{...styles.paymentOption, ...(paymentMethod === 'cod' ? styles.activePayment : {})}}>
                <FaMoneyBillWave size={24} /> <span>Cash on Delivery</span>
              </div>
              <div onClick={() => setPaymentMethod('card')} style={{...styles.paymentOption, ...(paymentMethod === 'card' ? styles.activePayment : {})}}>
                <FaCreditCard size={24} /> <span>Credit/Debit Card</span>
              </div>
              <div onClick={() => setPaymentMethod('orange')} style={{...styles.paymentOption, ...(paymentMethod === 'orange' ? styles.activePayment : {})}}>
                <FaMobileAlt size={24} /> <span>Orange Money</span>
              </div>
              <div onClick={() => setPaymentMethod('afri')} style={{...styles.paymentOption, ...(paymentMethod === 'afri' ? styles.activePayment : {})}}>
                <FaMobileAlt size={24} /> <span>AfriMoney</span>
              </div>
            </div>
            {/* --- DYNAMIC PAYMENT DETAILS --- */}
            <div style={styles.paymentDetailsSection}>
              {paymentMethod === 'card' && (
                <div style={styles.cardInputs}>
                  <input name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentInputChange} placeholder="Card Number" style={styles.input} required />
                  <div style={styles.inlineInputs}>
                    <input name="expiryDate" value={paymentDetails.expiryDate} onChange={handlePaymentInputChange} placeholder="MM/YY" style={styles.input} required />
                    <input name="cvc" value={paymentDetails.cvc} onChange={handlePaymentInputChange} placeholder="CVC" style={styles.input} required />
                  </div>
                </div>
              )}
              {(paymentMethod === 'orange' || paymentMethod === 'afri') && (
                <div>
                  <p style={styles.paymentInstruction}>Please enter your mobile money number. You will receive a prompt to confirm the payment.</p>
                  <input name="mobileMoneyNumber" value={paymentDetails.mobileMoneyNumber} onChange={handlePaymentInputChange} placeholder="e.g., 077 123456" style={styles.input} required />
                </div>
              )}
              {paymentMethod === 'cod' && (
                <div style={styles.codMessage}>
                  <FaShieldAlt color="#28a745" />
                  <p>You will pay with cash upon delivery of your order.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div style={styles.rightColumn}>
          <div style={{...styles.section, ...styles.summary}}>
            <h2 style={styles.sectionTitle}>Order Summary</h2>
            <div style={styles.summaryItems}>
              {cartItems.map(item => (
                <div key={item.cartItemId} style={styles.summaryItem}>
                  <img 
                    src={item.image_urls && item.image_urls.length > 0 ? `${BACKEND_URL}${item.image_urls[0]}` : 'https://placehold.co/60x60/e9ecef/6c757d?text=N/A'} 
                    alt={item.name} style={styles.summaryImage} 
                  />
                  <div style={styles.summaryDetails}>
                    <p style={styles.summaryItemName}>{item.name}</p>
                    <p style={styles.summaryItemQty}>Qty: {item.quantity}</p>
                  </div>
                  <p style={styles.summaryItemPrice}>{formatPrice(item.quantity * (item.discounted_price || item.price))}</p>
                </div>
              ))}
            </div>
            <div style={styles.summaryRow}><span>Subtotal</span> <span>{formatPrice(subtotal)}</span></div>
            <div style={styles.summaryRow}><span>Shipping</span> <span>{formatPrice(shippingFee)}</span></div>
            <div style={{...styles.summaryRow, ...styles.totalRow}}><strong>Total</strong> <strong>{formatPrice(total)}</strong></div>
            <button type="submit" style={styles.placeOrderButton}>Place Order</button>
          </div>
        </div>
      </form>
    </div>
  );
};

const styles = {
  page: { maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f7f9fc' },
  title: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' },
  leftColumn: {},
  rightColumn: {},
  section: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', marginBottom: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
  sectionTitle: { marginTop: 0, marginBottom: '20px', fontSize: '1.4rem' },
  input: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', boxSizing: 'border-box', fontSize: '1rem', marginBottom: '15px' },
  // Payment Options
  paymentOptions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px',
    border: '2px solid #eee',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background-color 0.2s',
  },
  activePayment: {
    border: '2px solid #007bff',
    backgroundColor: '#f0f8ff',
  },
  paymentDetailsSection: { marginTop: '20px' },
  paymentInstruction: { fontSize: '0.9rem', color: '#555', marginBottom: '10px' },
  cardInputs: {},
  inlineInputs: { display: 'flex', gap: '15px' },
  codMessage: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f0fff4', padding: '15px', borderRadius: '8px', color: '#28a745' },
  // Order Summary
  summary: { position: 'sticky', top: '20px' },
  summaryItems: { maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' },
  summaryItem: { display: 'flex', alignItems: 'center', marginBottom: '15px' },
  summaryImage: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' },
  summaryDetails: { flexGrow: 1 },
  summaryItemName: { margin: 0, fontWeight: '500', fontSize: '0.9rem' },
  summaryItemQty: { margin: '4px 0 0 0', fontSize: '0.8rem', color: '#6c757d' },
  summaryItemPrice: { margin: 0, fontWeight: '600' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1rem' },
  totalRow: { fontSize: '1.3rem', paddingTop: '15px', borderTop: '1px solid #eee', marginTop: '10px' },
  placeOrderButton: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default CheckoutPage;