import React from 'react';

const BACKEND_URL = 'http://localhost:5000';

const UserOrderDetails = ({ order }) => {
  if (!order) return null;

  const { shipping_address: shipping, orderItems } = order;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Order Details #{order.id}</h2>
        <div style={{...styles.statusBadge, ...styles[order.status?.toLowerCase()]}}>{order.status}</div>
      </div>

      {order.admin_note && (
        <div style={styles.noteDisplay}><strong>Note from seller:</strong> {order.admin_note}</div>
      )}

      <div style={styles.grid}>
        <div>
          <h3 style={styles.subTitle}>Shipping To</h3>
          <p>{shipping.fullName}</p>
          <p>{shipping.address}, {shipping.city}</p>
          <p><strong>Phone:</strong> {shipping.phone}</p>
        </div>
        <div>
          <h3 style={styles.subTitle}>Payment</h3>
          <p><strong>Method:</strong> {order.payment_method}</p>
          <p><strong>Status:</strong> {order.is_paid ? `Paid on ${new Date(order.paid_at).toLocaleDateString()}` : 'Payment on Delivery'}</p>
        </div>
      </div>

      <h3 style={styles.subTitle}>Order Items</h3>
      <div style={styles.itemsContainer}>
        {order.orderItems.map(item => (
          <div key={item.id} style={styles.item}>
            <img 
              src={item.image_urls && item.image_urls.length > 0 ? `${BACKEND_URL}${item.image_urls[0]}` : 'https://placehold.co/60x60/e9ecef/6c757d?text=N/A'} 
              alt={item.name} style={styles.itemImage} 
            />
            <div style={styles.itemDetails}>
              <div>
                <span>{item.name}</span>
                {(item.color || item.size) && <p style={styles.itemOptions}>{item.color && `Color: ${item.color}`} {item.size && `Size: ${item.size}`}</p>}
              </div>
              <span>{item.quantity} x ${Number(item.price).toFixed(2)}</span>
            </div>
            <strong>${(item.quantity * item.price).toFixed(2)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' },
  title: { marginTop: 0, marginBottom: 0 },
  statusBadge: { padding: '6px 15px', borderRadius: '20px', fontWeight: '600', fontSize: '1rem' },
  noteDisplay: { marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', fontStyle: 'italic', border: '1px solid #eee' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '20px' },
  subTitle: { fontSize: '1.2rem', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '10px' },
  itemsContainer: { border: '1px solid #eee', borderRadius: '8px', padding: '10px' },
  item: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f4f4f4' },
  itemImage: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' },
  itemDetails: { flexGrow: 1, display: 'flex', flexDirection: 'column' },
  itemOptions: { margin: '4px 0 0 0', fontSize: '0.85rem', color: '#6c757d' },
  // Status colors
  processing: { backgroundColor: '#fffbe6', color: '#d46b08' },
  shipped: { backgroundColor: '#e6f7ff', color: '#0050b3' },
  delivered: { backgroundColor: '#f6ffed', color: '#389e0d' },
};

export default UserOrderDetails;
