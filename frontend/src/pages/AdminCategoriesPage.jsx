import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import ConfirmationModal from '../components/ConfirmationModal';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [formState, setFormState] = useState({ name: '', description: '', is_showcased: false });
  const [editingCategory, setEditingCategory] = useState(null); // Add is_showcased to form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo, loading: authLoading } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: checked }));
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      setError('Could not fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && userInfo?.isAdmin) {
      fetchCategories();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [userInfo, authLoading]);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormState({ name: category.name || '', description: category.description || '', is_showcased: category.is_showcased || false });
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // The token is added automatically by the interceptor
      await api.delete(`/categories/${categoryToDelete}`);
      fetchCategories();
    } catch (err) {
      setError('Could not delete category.');
    } finally {
      setIsModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setFormState({ name: '', description: '', is_showcased: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formState);
      } else {
        await api.post('/categories', formState);
      }
      fetchCategories();
    } catch (err) {
      setError('Failed to save category. The name may already exist.');
    } finally {
      cancelEdit();
    }
  };

  return (
    <div style={styles.container}>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
      <h1 style={styles.header}>Product Categories</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div style={styles.grid}>
        <div style={styles.formCard}>
          <h2 style={styles.subHeader}>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category Name</label>
              <input type="text" name="name" value={formState.name} onChange={handleInputChange} style={styles.input} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea name="description" value={formState.description} onChange={handleInputChange} style={styles.textarea}></textarea>
            </div>
            <div style={styles.toggleGroup}>
              <label style={styles.label}>Showcase on Home Page</label>
              <input type="checkbox" name="is_showcased" checked={formState.is_showcased} onChange={handleToggleChange} />
            </div>
            <div style={styles.formButtonGroup}>
              {editingCategory && (
                <button type="button" onClick={cancelEdit} style={{...styles.button, ...styles.cancelButton}}>Cancel</button>
              )}
              <button type="submit" style={styles.button}>{editingCategory ? 'Update Category' : 'Add Category'}</button>
            </div>
          </form>
        </div>
        <div style={styles.listCard}>
          <h2 style={styles.subHeader}>Existing Categories</h2>
          {loading ? <p>Loading...</p> : (
            <ul style={styles.list}>
              {categories.map(category => (
                <li key={category.id} style={styles.listItem}>
                  <div>
                    <strong style={styles.listItemName}>
                      {category.name}
                      {category.is_showcased && <FaStar style={styles.starIcon} />}
                    </strong>
                    <p style={styles.listItemDesc}>{category.description}</p>
                  </div>
                  <div style={styles.buttonGroup}>
                    <button onClick={() => handleEdit(category)} style={{...styles.iconButton, ...styles.editButton}}><FaEdit /></button>
                    <button onClick={() => handleDelete(category.id)} style={{...styles.iconButton, ...styles.deleteButton}}><FaTrash /></button>
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

// Reusing styles from AdminSuppliersPage for consistency
const styles = {
  container: { fontFamily: 'system-ui, sans-serif' },
  header: { marginBottom: '30px', color: '#333' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  formCard: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  listCard: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  subHeader: { marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' },
  toggleGroup: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', border: '1px solid #eee', borderRadius: '8px', padding: '10px' },
  input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', minHeight: '80px' },
  button: { width: '100%', padding: '12px', border: 'none', borderRadius: '4px', backgroundColor: '#28a745', color: 'white', fontSize: '1rem', cursor: 'pointer' },
  formButtonGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
  cancelButton: { backgroundColor: '#6c757d' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' },
  listItemName: { fontWeight: 'bold' },
  listItemDesc: { color: '#777', fontSize: '0.9rem', margin: '4px 0 0 0' },
  starIcon: { marginLeft: '10px', color: '#ffc107' },
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

export default AdminCategoriesPage;