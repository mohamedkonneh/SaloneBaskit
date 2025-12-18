import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import ConfirmationModal from '../components/ConfirmationModal';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axiosConfig'; // Import the configured Axios instance

const AdminProductListPage = () => {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo, loading: authLoading } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formState, setFormState] = useState({
    name: '', description: '', image_url: '', brand: '', category: '',
    price: '', count_in_stock: '', image_urls: [], // Use an array for images
    is_deal_of_the_day: false,
    supplier_id: '', // Add supplier_id to form state
    is_flash_sale: false,
    is_highlighted: false, // Add this for the new feature
    is_new_arrival: false,
    discounted_price: '',
    has_free_delivery: false,
    estimated_delivery: '',
    colors: '', // Add colors as a string
    sizes: '',  // Add sizes as a string
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  // --- DATA FETCHING ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products'); // Use api instance
      setProducts(data);
    } catch (err) {
      setError('Could not fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [catRes, supRes] = await Promise.all([
        api.get('/categories'), // Use api instance
        api.get('/suppliers')    // Use api instance
      ]);
      setCategories(catRes.data);
      setSuppliers(supRes.data);
    } catch (err) {
      setError('Could not fetch categories or suppliers.');
    }
  };

  useEffect(() => {
    fetchProducts();
    if (!authLoading && userInfo?.isAdmin) {
      fetchDropdownData();
    } else if (!authLoading) {
      setLoading(false);
      setError("You are not authorized to view this page.");
    }
  }, [userInfo, authLoading]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const files = Array.from(e.target.files);
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null); // Ensure we are in "add" mode
    // Reset form for a new product
    setFormState({
      name: '', description: '', image_url: '', brand: '', category: '', 
      price: '', count_in_stock: '',
      supplier_id: '',
      is_deal_of_the_day: false,
      is_flash_sale: false,
      is_highlighted: false,
      is_new_arrival: false,
      discounted_price: '',
      has_free_delivery: false,
      estimated_delivery: '',
      image_urls: [],
      colors: '',
      sizes: '',
    });
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormState({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      image_urls: product.image_urls || [],
      brand: product.brand || '',
      category: product.category || '',
      count_in_stock: product.count_in_stock || '',
      supplier_id: product.supplier_id || '',
      is_deal_of_the_day: product.is_deal_of_the_day || false,
      is_flash_sale: product.is_flash_sale || false,
      is_highlighted: product.is_highlighted || false,
      is_new_arrival: product.is_new_arrival || false,
      discounted_price: product.discounted_price || '',
      has_free_delivery: product.has_free_delivery || false,
      estimated_delivery: product.estimated_delivery || '',
      colors: product.colors ? product.colors.join(', ') : '', // Convert array to string
      sizes: product.sizes ? product.sizes.join(', ') : '',   // Convert array to string
    });
    setImagePreviews(product.image_urls ? product.image_urls.map(url => `http://localhost:5000${url}`) : []);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/products/${productToDelete}`); // Use api instance
      fetchProducts();
    } catch (err) {
      setError('Could not delete product.');
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageUrls = [];

    // Step 1: Check if a new file was selected for upload
    const imageFiles = fileInputRef.current.files;
    if (imageFiles.length > 0) {
      const formData = new FormData(); // This FormData should ONLY contain the images.
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
      }
      try {
        // The interceptor adds Authorization. We only need to specify Content-Type for file uploads.
        const { data } = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        uploadedImageUrls = data.imageUrls; // Get the array of URLs from the server
      } catch (uploadError) {
        setError('Image upload failed.');
        return;
      }
    }
    try {
      // When editing, we need to preserve the existing images that were not removed.
      const finalImageUrls = editingProduct ? formState.image_urls : [];
      const productData = { 
        ...formState, 
        image_urls: [...finalImageUrls, ...uploadedImageUrls],
        // Ensure brand name is synced with the selected supplier
        brand: suppliers.find(s => s.id === parseInt(formState.supplier_id))?.name || formState.brand,
        discounted_price: formState.discounted_price === '' ? null : formState.discounted_price,
        // Convert comma-separated strings to arrays, trimming whitespace and removing empty entries
        colors: formState.colors.split(',').map(c => c.trim()).filter(c => c),
        sizes: formState.sizes.split(',').map(s => s.trim()).filter(s => s),
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, productData);
      } else {
        await api.post('/products', productData);
      }
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save product.';
      setError(msg);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div style={styles.container}>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
      {/* --- ADD/EDIT PRODUCT MODAL --- */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalHeader}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                {/* Left side of form */}
                <div style={styles.formColumn}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Product Name</label>
                    <input type="text" name="name" value={formState.name} onChange={handleInputChange} style={styles.input} required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea name="description" value={formState.description} onChange={handleInputChange} style={styles.textarea}></textarea>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Category</label>
                    <select name="category" value={formState.category} onChange={handleInputChange} style={styles.input} required>
                      <option value="">Select a category...</option>
                      {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Brand (Supplier)</label>
                    <select name="supplier_id" value={formState.supplier_id} onChange={handleInputChange} style={styles.input} required>
                      <option value="">Select a supplier...</option>
                      {suppliers.map(sup => (
                        // The value of the option is now the supplier's ID
                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Product Image</label>
                    <div style={styles.imageUploadContainer}>
                      <div style={styles.imagePreviewContainer}>
                        {imagePreviews.map((preview, index) => (
                          <img key={index} src={preview} alt={`Preview ${index}`} style={styles.imagePreview} />
                        ))}
                      </div>
                      <button type="button" onClick={() => fileInputRef.current.click()} style={styles.uploadButton}>
                        <FaUpload /> Select Images
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" multiple />
                      <small>You can select multiple images.</small>
                    </div>
                  </div>
                  {/* We can remove the manual URL inputs for a cleaner UI */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Colors (comma-separated)</label>
                    <input type="text" name="colors" value={formState.colors} onChange={handleInputChange} style={styles.input} placeholder="e.g., Red, Blue, #00FF00" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Sizes (comma-separated)</label>
                    <input type="text" name="sizes" value={formState.sizes} onChange={handleInputChange} style={styles.input} placeholder="e.g., S, M, L, XL" />
                  </div>
                </div>
                {/* Right side of form */}
                <div style={styles.formColumn}>
                  
                  <div style={styles.inlineGroup}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Selling Price ($)</label>
                      <input type="number" name="price" value={formState.price} onChange={handleInputChange} style={styles.input} required step="0.01" />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Stock</label>
                      <input type="number" name="count_in_stock" value={formState.count_in_stock} onChange={handleInputChange} style={styles.input} required />
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Discounted Price ($)</label>
                    <input type="number" name="discounted_price" value={formState.discounted_price} onChange={handleInputChange} style={styles.input} step="0.01" placeholder="Leave blank if no discount" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Estimated Delivery</label>
                    <input type="text" name="estimated_delivery" value={formState.estimated_delivery} onChange={handleInputChange} style={styles.input} placeholder="e.g., 'Arrives by July 30'" />
                  </div>
                  <div style={styles.togglesContainer}>
                    <div style={styles.toggleGroup}>
                      <label style={styles.label}>Deal of the Day</label>
                      <input type="checkbox" name="is_deal_of_the_day" checked={formState.is_deal_of_the_day} onChange={handleToggleChange} />
                    </div>
                    <div style={styles.toggleGroup}>
                      <label style={styles.label}>Flash Sale</label>
                      <input type="checkbox" name="is_flash_sale" checked={formState.is_flash_sale} onChange={handleToggleChange} />
                    </div>
                    <div style={styles.toggleGroup}>
                      <label style={styles.label}>New Arrival</label>
                      <input type="checkbox" name="is_new_arrival" checked={formState.is_new_arrival} onChange={handleToggleChange} />
                    </div>
                    <div style={styles.toggleGroup}>
                      <label style={styles.label}>Free Delivery</label>
                      <input type="checkbox" name="has_free_delivery" checked={formState.has_free_delivery} onChange={handleToggleChange} />
                    </div>
                    <div style={styles.toggleGroup}>
                      <label style={styles.label}>Highlight on Homepage</label>
                      <input type="checkbox" name="is_highlighted" checked={formState.is_highlighted} onChange={handleToggleChange} />
                    </div>
                  </div>
                </div>
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{...styles.button, ...styles.cancelButton}}>Cancel</button>
                <button type="submit" style={{...styles.button, ...styles.saveButton}}>{editingProduct ? 'Update Product' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT --- */}
      <div style={styles.pageHeader}>
        <h1>Manage Products</h1>
        <button onClick={openAddModal} style={{...styles.button, ...styles.addButton}}>
          <FaPlus style={{ marginRight: '8px' }} />
          Add Product
        </button>
      </div>

      {/* --- PRODUCT LIST TABLE --- */}
      {loading ? <p>Loading...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td style={styles.td}>{product.name}</td>
                  <td style={styles.td}>{product.category}</td>
                  <td style={styles.td}>${Number(product.price).toFixed(2)}</td>
                  <td style={styles.td}>{product.count_in_stock}</td>
                  <td style={styles.td}>
                    <button onClick={() => openEditModal(product)} style={{...styles.iconButton, ...styles.editButton}}><FaEdit /></button>
                    <button onClick={() => handleDeleteClick(product.id)} style={{...styles.iconButton, ...styles.deleteButton}}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  // Page Styles
  container: { fontFamily: 'system-ui, sans-serif' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  card: { backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  // Table Styles
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { borderBottom: '1px solid #eee', padding: '12px', textAlign: 'left', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase' },
  td: { borderBottom: '1px solid #eee', padding: '15px 12px' },
  // Modal Styles
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 },
  modalContent: { backgroundColor: 'white', borderRadius: '8px', width: '90%', maxWidth: '800px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { marginTop: 0, marginBottom: '25px' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' },
  // Form Styles
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' },
  formColumn: {},
  formGroup: { marginBottom: '15px' },
  inlineGroup: { display: 'flex', gap: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' },
  togglesContainer: { border: '1px solid #eee', borderRadius: '8px', padding: '15px', marginTop: '15px' },
  toggleGroup: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', minHeight: '80px' },
  // Image Upload
  imageUploadContainer: {
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '10px',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '10px',
  },
  imagePreview: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' },
  uploadButton: {
    marginBottom: '5px',
  },
  // Button Styles
  button: { padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  addButton: { backgroundColor: '#007bff', color: 'white' },
  saveButton: { backgroundColor: '#28a745', color: 'white' },
  cancelButton: { backgroundColor: '#6c757d', color: 'white' },
  iconButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '5px', marginRight: '10px' },
  editButton: { color: '#007bff' },
  deleteButton: { color: '#dc3545' },
};

export default AdminProductListPage;