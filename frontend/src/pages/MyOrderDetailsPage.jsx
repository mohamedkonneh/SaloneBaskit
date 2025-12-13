import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import UserOrderDetails from '../components/UserOrderDetails';

const MyOrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo, loading: authLoading } = useAuth(); // Correctly get authLoading

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await api.get(`/orders/myorders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError('Could not fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    // This is the crucial fix:
    if (!authLoading && userInfo) { // Wait for auth check AND ensure user is logged in
      fetchOrderDetails();
    } else if (!authLoading && !userInfo) {
      // If auth is done and there's no user, stop loading and show an error.
      setLoading(false);
      setError("You must be logged in to view this page.");
    }
    // The dependency array MUST include authLoading
  }, [userInfo, authLoading, orderId]);

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/my-orders" style={styles.backLink}>&larr; Back to My Orders</Link>
      {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <div style={{ maxWidth: '900px', margin: '20px auto' }}>
          <UserOrderDetails order={order} />
        </div>
      )}
    </div>
  );
};

const styles = {
  backLink: {
    display: 'inline-block',
    marginBottom: '20px',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#007bff',
  }
};

export default MyOrderDetailsPage;