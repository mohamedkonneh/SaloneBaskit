import React from 'react';
// import { useCart } from '../context/CartContext'; // You can uncomment this later

const CartPage = () => {
  // const { cart } = useCart(); // Example of getting cart data

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Shopping Cart</h1>
      <p style={styles.text}>
        Your cart is currently empty. Start shopping to add items!
      </p>
      {/* You will map through cart items here later */}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
  title: { fontSize: '2.5rem', marginBottom: '20px' },
  text: { fontSize: '1.1rem', lineHeight: '1.6' },
};

export default CartPage;