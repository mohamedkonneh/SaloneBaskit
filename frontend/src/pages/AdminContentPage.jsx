import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const contentPages = [
  { key: 'about', name: 'About The Company' },
  { key: 'terms', name: 'Terms & Privacy' },
  { key: 'help', name: 'Help Center & Contact' },
  { key: 'return-policy', name: 'Return Policy' },
];

const AdminContentPage = () => {
  const [selectedPage, setSelectedPage] = useState(contentPages[0].key);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchContent = async () => {
      if (!selectedPage) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/content/${selectedPage}`);
        setContent(data.content);
      } catch (error) {
        toast.error(`Failed to load content for ${selectedPage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [selectedPage]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/content/${selectedPage}`, { content });
      toast.success('Content saved successfully!');
    } catch (error) {
      toast.error('Failed to save content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Manage Page Content</h1>
      <div style={styles.card}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Page to Edit:</label>
          <select value={selectedPage} onChange={(e) => setSelectedPage(e.target.value)} style={styles.select}>
            {contentPages.map(page => (
              <option key={page.key} value={page.key}>{page.name}</option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Page Content (HTML is allowed):</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
            rows={15}
            disabled={loading}
          />
        </div>
        <button onClick={handleSave} disabled={loading} style={styles.button}>
          {loading ? 'Saving...' : 'Save Content'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'system-ui, sans-serif' },
  header: { marginBottom: '20px' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '600' },
  select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box' },
  button: { padding: '12px 25px', border: 'none', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', fontSize: '1rem', cursor: 'pointer' },
};

export default AdminContentPage;
 