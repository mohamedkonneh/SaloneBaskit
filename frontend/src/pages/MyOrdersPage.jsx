import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axiosConfig'; // Import the configured Axios instance
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo, loading: authLoading } = useAuth(); // Get the loading state from AuthContext

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        // Use the 'api' instance; the token is added automatically by the interceptor.
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        setError('Could not fetch your orders.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch orders if authentication is not loading AND a user is logged in.
    if (!authLoading && userInfo) {
      fetchMyOrders();
    } else if (!authLoading) {
      // If auth is done and there's no user, stop loading.
      setLoading(false);
    }
  }, [userInfo, authLoading]);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={styles.title}>My Orders</h1>
      {loading ? <p>Loading...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
        <div style={styles.orderList}>
          {orders.length === 0 ? (
            <p>You have no orders.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <p style={styles.orderId}>Order #{order.id}</p>
                    <p style={styles.orderDate}>Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{...styles.statusBadge, ...styles[order.status?.toLowerCase()]}}>{order.status}</div>
                </div>
                <div style={styles.cardBody}>
                  <p><strong>Total:</strong> ${Number(order.total_price).toFixed(2)}</p>
                  {order.admin_note && <p style={styles.adminNote}><strong>Note:</strong> {order.admin_note}</p>}
                </div>
                <div style={styles.cardFooter}>
                  <Link to={`/my-orders/${order.id}`} style={styles.detailsButton}>View Details</Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  title: { marginBottom: '20px' },
  orderList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  orderCard: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#f8f9fa' },
  orderId: { margin: 0, fontWeight: 'bold' },
  orderDate: { margin: '4px 0 0 0', fontSize: '0.9rem', color: '#6c757d' },
  statusBadge: { padding: '5px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '0.9rem' },
  cardBody: { padding: '20px' },
  adminNote: { fontStyle: 'italic', color: '#555', backgroundColor: '#f0f2f5', padding: '10px', borderRadius: '5px' },
  cardFooter: { padding: '15px 20px', textAlign: 'right', borderTop: '1px solid #eee' },
  detailsButton: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
  },
  // Status colors
  processing: { backgroundColor: '#fffbe6', color: '#d46b08' },
  shipped: { backgroundColor: '#e6f7ff', color: '#0050b3' },
  delivered: { backgroundColor: '#f6ffed', color: '#389e0d' },
};

export default MyOrdersPage;