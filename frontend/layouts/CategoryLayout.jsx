import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import api from '../src/api/axiosConfig';
 

const CategoryLayout = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.page}>
      {isMobile && (
        <div style={styles.mobileCategoryNav}>
          {categories.map(cat => (
            <NavLink 
              key={cat.id} 
              to={`/categories/${cat.name}`}
              style={({ isActive }) => ({
                ...styles.mobileCategoryItem, 
                ...(isActive ? styles.activeMobileCategory : {}),
                ...(hoveredCategory === cat.id && !isActive ? styles.hoverMobileCategory : {})
              })}
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >{cat.name}</NavLink>
          ))}
        </div>
      )}
      <main style={styles.main}>
        <div style={styles.container}>
          {!isMobile && (
            <aside style={styles.sidebar}>
              <h2 style={styles.sidebarTitle}>Categories</h2>
              {loading ? <p>Loading...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
                categories.map(category => (
                  <NavLink 
                    to={`/categories/${category.name}`} 
                    key={category.id} 
                    style={({ isActive }) => ({ ...styles.categoryLink, ...(isActive ? styles.activeLink : {}) })}
                  >
                    {category.name}
                  </NavLink>
                ))
              )}
            </aside>
          )}
          <div style={styles.content}>
            <Outlet /> {/* Child routes will be rendered here */}
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#f4f6f9',
    minHeight: '100vh',
  },
  main: {
    padding: '30px 20px',
  },
  container: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    maxWidth: '1400px', // Constrain the content width, not the whole page
    margin: '0 auto',
  },
  sidebar: {
    flex: '0 0 140px', // Further reduced sidebar width
    position: 'sticky',
    top: '100px', // Adjusted for sticky header
  },
  sidebarTitle: {
    fontSize: '1.1rem', // Reduced font size
    fontWeight: 'bold',
    marginBottom: '15px', // Reduced margin
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
    color: '#666',
  },
  categoryLink: {
    display: 'block',
    padding: '6px 10px', // Reduced padding for a more compact look
    textDecoration: 'none',
    color: '#333',
    borderRadius: '5px',
    marginBottom: '4px', // Reduced margin
    fontWeight: '500',
    fontSize: '0.85rem', // Made font smaller
  },
  activeLink: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  mobileCategoryNav: {
    display: 'flex',
    overflowX: 'auto',
    gap: '10px',
    padding: '15px',
    backgroundColor: 'white',
    borderBottom: '1px solid #eee',
    scrollbarWidth: 'none', // For Firefox
  },
  mobileCategoryItem: {
    padding: '8px 15px',
    borderRadius: '20px',
    backgroundColor: '#e9ecef',
    color: '#495057',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    transition: 'background-color 0.2s, color 0.2s',
  },
  activeMobileCategory: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  hoverMobileCategory: {
    backgroundColor: '#d1e7ff', // Lighter blue on hover
  },
  content: {
    flex: 1,
  },
};

export default CategoryLayout;