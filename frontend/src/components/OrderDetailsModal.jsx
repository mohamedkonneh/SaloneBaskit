import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:5000';

const OrderDetailsModal = ({ isOpen, onClose, order, isAdminView = false, onSaveChanges }) => {
  const [note, setNote] = useState('');
  
  useEffect(() => {
    if (order) {
      setNote(order.admin_note || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const { shipping_address: shipping, orderItems } = order;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Order #{order.id}</h2>
        <div style={styles.grid}>
          <div>
            <h3 style={styles.subTitle}>Shipping To</h3>
            <p>{shipping.fullName}</p>
            <p>{shipping.address}, {shipping.city}</p>
            <p><strong>Phone:</strong> {shipping.phone}</p>
            <p><strong>Email:</strong> {order.email}</p>
          </div>
          <div>
            <h3 style={styles.subTitle}>Payment</h3>
            <p><strong>Method:</strong> {order.payment_method}</p>
            <p><strong>Status:</strong> {order.is_paid ? 'Paid' : 'Not Paid'}</p>
          </div>
        </div>

        <h3 style={styles.subTitle}>Order Items</h3>
        <div style={styles.itemsContainer}>
          {order.orderItems.map(item => (
            <div key={item.id} style={styles.item}>
              <img src={`${BACKEND_URL}${item.image_url}`} alt={item.name} style={styles.itemImage} />
              <div style={styles.itemDetails}>
                <span>{item.name}</span>
                <span>{item.quantity} x ${Number(item.price).toFixed(2)}</span>
              </div>
              <strong>${(item.quantity * item.price).toFixed(2)}</strong>
            </div>
          ))}
        </div>

        {isAdminView ? (
          <>
            <h3 style={styles.subTitle}>Admin Note (Visible to Customer)</h3>
            <textarea 
              style={styles.noteTextarea}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., 'Ships in 3 business days'"
            />
          </>
        ) : order.admin_note && (
          <div style={styles.noteDisplay}><strong>Note from seller:</strong> {order.admin_note}</div>
        )}

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.closeButton}>Close</button>
          {isAdminView && 
            <button onClick={() => onSaveChanges(order.id, order.status, note)} style={styles.saveButton}>Save Changes</button>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 },
  modal: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' },
  title: { marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '15px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  subTitle: { fontSize: '1.1rem', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '10px' },
  itemsContainer: { border: '1px solid #eee', borderRadius: '8px', padding: '10px', maxHeight: '250px', overflowY: 'auto' },
  item: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f4f4f4' },
  itemImage: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' },
  itemDetails: { flexGrow: 1, display: 'flex', flexDirection: 'column' },
  noteDisplay: { marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', fontStyle: 'italic' },
  noteTextarea: { width: '100%', minHeight: '60px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' },
  footer: { marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  closeButton: { padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#6c757d', color: 'white', cursor: 'pointer' },
  saveButton: { padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' },
};

export default OrderDetailsModal;