import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmationModal from '../components/ConfirmationModal';
import api from '../api/axiosConfig'; // Import the configured Axios instance
import { useAuth } from '../hooks/useAuth';

const AdminSuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [formState, setFormState] = useState({ name: '', contact: '', email: '', phone: '', address: '' });
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { userInfo, loading: authLoading } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/suppliers');
      setSuppliers(data);
    } catch (err) {
      // Provide a more detailed error message
      setError(err.response?.data?.message || 'Could not fetch suppliers. The server may be experiencing issues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && userInfo?.isAdmin) {
      fetchSuppliers();
    } else if (!authLoading) {
      setLoading(false);
      setError("You are not authorized to view this page.");
    }
  }, [userInfo, authLoading]);

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormState({ name: supplier.name, contact: supplier.contact_person, email: supplier.email, phone: supplier.phone || '', address: supplier.address || '' });
  };

  const handleDelete = (id) => {
    setSupplierToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/suppliers/${supplierToDelete}`);
      fetchSuppliers();
    } catch (err) {
      setError('Could not delete supplier.');
    } finally {
      setIsModalOpen(false);
      setSupplierToDelete(null);
    }
  };

  const cancelEdit = () => {
    setEditingSupplier(null);
    setFormState({ name: '', contact: '', email: '', phone: '', address: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); // Clear previous errors
    const supplierData = { name: formState.name, contact_person: formState.contact_person, email: formState.email, phone: formState.phone, address: formState.address };

    try {
      if (editingSupplier) {
        const { data: updatedSupplier } = await api.put(`/suppliers/${editingSupplier.id}`, supplierData);
        setSuppliers(suppliers.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
      } else {
        if (!userInfo?.id) {
          setError("Authentication error: User ID not found.");
          setIsSubmitting(false);
          return;
        }
        const { data: newSupplier } = await api.post('/suppliers', { ...supplierData, user_id: userInfo.id });
        setSuppliers([newSupplier, ...suppliers]); // Add to the top of the list
      }
      cancelEdit(); // Clear the form
    } catch (error) {
      // Display the actual error message from the backend
      setError(error.response?.data?.message || error.response?.data || 'Failed to save supplier.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this supplier? This action cannot be undone."
      />
      <h1 style={styles.header}>Manage Suppliers</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div style={styles.grid}>
        <div style={styles.formCard}>
          <h2 style={styles.subHeader}>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Supplier Name</label>
              <input type="text" name="name" value={formState.name} onChange={handleInputChange} style={styles.input} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contact Person</label>
              <input type="text" name="contact" value={formState.contact} onChange={handleInputChange} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" name="email" value={formState.email} onChange={handleInputChange} style={styles.input} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input type="tel" name="phone" value={formState.phone} onChange={handleInputChange} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Address</label>
              <textarea name="address" value={formState.address} onChange={handleInputChange} style={styles.textarea}></textarea>
            </div>
            <div style={styles.formButtonGroup}>
              {editingSupplier && (
                <button type="button" onClick={cancelEdit} style={{...styles.button, ...styles.cancelButton}}>Cancel</button>
              )}
              <button type="submit" style={styles.button} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (editingSupplier ? 'Update Supplier' : 'Add Supplier')}</button>
            </div>
          </form>
        </div>
        <div style={styles.listCard}>
          <h2 style={styles.subHeader}>Existing Suppliers</h2>
          {loading ? <p>Loading...</p> : (
            <ul style={styles.list}>
              {suppliers.map(supplier => (
                <li key={supplier.id} style={styles.listItem}>
                  <div>
                    <strong style={styles.listItemName}>{supplier.name}</strong>
                    <br />
                    <span style={styles.listItemEmail}>{supplier.email}</span>
                  </div>
                  <div style={styles.buttonGroup}>
                    <button onClick={() => handleEdit(supplier)} style={{...styles.iconButton, ...styles.editButton}}><FaEdit /></button>
                    <button onClick={() => handleDelete(supplier.id)} style={{...styles.iconButton, ...styles.deleteButton}}><FaTrash /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'system-ui, sans-serif' },
  header: { marginBottom: '30px', color: '#333' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  formCard: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  listCard: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  subHeader: { marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' },
  input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', minHeight: '80px' },
  button: { width: '100%', padding: '12px', border: 'none', borderRadius: '4px', backgroundColor: '#28a745', color: 'white', fontSize: '1rem', cursor: 'pointer' },
  formButtonGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
  cancelButton: { backgroundColor: '#6c757d' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' },
  listItemName: { fontWeight: 'bold' },
  listItemEmail: { color: '#777', fontSize: '0.9rem' },
  buttonGroup: { display: 'flex', gap: '10px' },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '5px',
  },
  editButton: {
    color: '#007bff',
  },
  deleteButton: {
    color: '#dc3545',
  },
};

export default AdminSuppliersPage;