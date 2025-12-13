import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import api from '../api/axiosConfig'; // Import the configured Axios instance
import { useAuth } from '../hooks/useAuth';
import OrderDetailsModal from '../components/OrderDetailsModal';

const AdminOrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { userInfo, loading: authLoading } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
      setError("You are not authorized to view this page.");
    }
  }, [userInfo, authLoading]);

  const handleStatusChange = async (orderId, newStatus, adminNote) => {
    try {
      // Note: The adminNote is passed from the modal, but here we just pass the existing one
      await api.put(`/orders/${orderId}/status`, { status: newStatus, admin_note: adminNote });
      toast.success(`Order #${orderId} status updated.`);
      fetchOrders(); // Refresh the order list
    } catch (error) {
      toast.error('Failed to update order status.');
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setSelectedOrder(data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Could not fetch order details.');
    }
  };

  return (
    <div style={styles.container}>
      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        isAdminView={true}
        onSaveChanges={handleStatusChange}
      />
      <h1 style={styles.header}>Manage Orders</h1>
      {loading ? <p>Loading...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>DATE</th>
              <th style={styles.th}>USER ID</th>
              <th style={styles.th}>USER</th>
              <th style={styles.th}>ITEMS</th>
              <th style={styles.th}>TOTAL</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={styles.td}>{order.id}</td>
                <td style={styles.td}>{new Date(order.created_at).toLocaleDateString()}</td>
                <td style={styles.td}>{order.user_id}</td>
                <td style={styles.td}>{order.user_name}</td>
                <td style={styles.td}>{order.item_count}</td>
                <td style={styles.td}>${Number(order.total_price).toFixed(2)}</td>
                <td style={styles.td}>
                  <select 
                    value={order.status || ''}
                    onChange={(e) => handleStatusChange(order.id, e.target.value, order.admin_note)}
                    style={{...styles.statusSelect, ...styles[order.status?.toLowerCase()]}}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <button onClick={() => viewOrderDetails(order.id)} style={styles.detailsButton}><FaEye /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', fontFamily: 'system-ui, sans-serif' },
  header: { marginBottom: '20px' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '2px solid #dee2e6',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa', // Light grey header
  },
  td: {
    borderBottom: '1px solid #dee2e6',
    padding: '12px',
    verticalAlign: 'middle',
  },
  detailsButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#007bff',
    fontSize: '1.1rem',
  },
  statusSelect: {
    padding: '5px 8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontWeight: '600',
  },
  processing: { backgroundColor: '#fffbe6', color: '#d46b08' },
  shipped: { backgroundColor: '#e6f7ff', color: '#0050b3' },
  delivered: { backgroundColor: '#f6ffed', color: '#389e0d' },
};

export default AdminOrderListPage;