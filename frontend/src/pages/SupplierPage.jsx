import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import ProductCard from '../components/ProductCard';
import { useMediaQuery } from '../hooks/useMediaQuery'; // Import the custom hook

const SupplierPage = () => {
  const { supplierId } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use the 'api' instance for all calls. The interceptor will handle the token.
        const [supRes, prodRes] = await Promise.all([
          api.get(`/suppliers/${supplierId}`),
          api.get(`/products`) // Fetch all products and filter them client-side
        ]);
        
        setSupplier(supRes.data);
        // Filter products by the current supplier's ID
        const supplierProducts = prodRes.data.filter(p => p.supplier_id === parseInt(supplierId));
        setProducts(supplierProducts);

      } catch (error) {
        console.error("Failed to fetch supplier data", error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for the auth check to complete, then fetch data if we have a supplierId.
    if (!authLoading && supplierId) {
      fetchData();
    } else if (!supplierId) {
      setLoading(false);
    }
  }, [supplierId, authLoading]);

  const isMobile = useMediaQuery('(max-width: 767px)'); // Use the custom hook
  if (authLoading || loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Loading supplier details...</p>;
  if (!supplier) return <p>Supplier not found.</p>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>{supplier.name}</h1>
        <p>{supplier.address}</p>
      </div>
      <h2 style={styles.subTitle}>Products from this supplier</h2>
      <div style={styles.productGrid(isMobile)}>
        {products.map(product => (
          <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth: '1200px', margin: '40px auto', padding: '0 20px' },
  header: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '40px',
    textAlign: 'center',
  },
  contactButton: {
    padding: '10px 25px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
  },
  subTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '25px',
  },
  productGrid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: isMobile ? '10px' : '25px',
  }),
};

export default SupplierPage;