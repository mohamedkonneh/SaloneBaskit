import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
 
import styles from './ProductDetailsPage.module.css'; // Import CSS Module
import ProductDetailsCard from '../components/ProductDetailsCard';
import FeaturedProductsCarousel from '../components/FeaturedProductsCarousel';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current product, all categories, and all products in parallel
        const [productRes, categoriesRes, allProductsRes] = await Promise.all([
          api.get(`/api/products/${productId}`),
          api.get('/api/categories'),
          api.get('/api/products')
        ]);

        const currentProduct = productRes.data;
        setProduct(currentProduct);
        setCategories(categoriesRes.data);

        // Filter for related products from the same category
        const related = allProductsRes.data.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id);
        setRelatedProducts(related.slice(0, 4)); // Show up to 4 related products

      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  return ( // No change needed here, it's a public page.
    <div className={styles.page}>
      {/* Category Navigation Bar */}
      <div className={styles.categoryNav}>
        {categories.map(cat => (
          <Link to={`/categories/${cat.name}`} key={cat.id} className={styles.categoryLink}>
            {cat.name}
          </Link>
        ))}
      </div>

      <main className={styles.main}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            <ProductDetailsCard product={product} />
            {relatedProducts.length > 0 && (
              <FeaturedProductsCarousel products={relatedProducts} title="You Might Also Like" />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ProductDetailsPage;