import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../api/axiosConfig';

const ReturnPolicyPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [pageData, setPageData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const fetchContent = async () => {
      try {
        const { data } = await api.get('/content/return-policy');
        setPageData(data);
      } catch (error) {
        console.error("Failed to load page content", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.page(isMobile)}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <FaArrowLeft style={{ marginRight: '8px' }} /> Back
        </button>
        <h1 style={styles.mainTitle}>{pageData.title || 'Return Policy'}</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.content} dangerouslySetInnerHTML={{ __html: pageData.content }} />
        )}
      </div>
    </div>
  );
};

const styles = {
  page: (isMobile) => ({
    backgroundColor: '#f9fafb',
    padding: isMobile ? '20px 15px' : '40px 20px',
    fontFamily: 'system-ui, sans-serif',
  }),
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#6c757d',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  mainTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '30px',
    borderBottom: '1px solid #eee',
    paddingBottom: '20px',
  },
  content: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: '#6b7280',
    // Basic styling for content coming from dangerouslySetInnerHTML
    'h2': { fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '15px', marginTop: '30px' },
    'p': { marginBottom: '15px' },
  },
};

export default ReturnPolicyPage;