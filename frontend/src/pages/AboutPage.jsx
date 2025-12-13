import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AboutPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.page(isMobile)}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <FaArrowLeft style={{ marginRight: '8px' }} /> Back
        </button>
        <h1 style={styles.mainTitle}>About SaloneBaskit</h1>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.paragraph}>
            Our mission is to revolutionize the online shopping experience in Sierra Leone by providing a seamless, reliable, and user-friendly platform. We aim to connect customers with a wide range of quality products, ensuring convenience and satisfaction with every purchase.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Story</h2>
          <p style={styles.paragraph}>
            Founded in Freetown, SaloneBaskit was born from a desire to bridge the gap between local consumers and the vast world of e-commerce. We noticed the challenges many faced with accessing diverse products and envisioned a solution that was tailored for the Sierra Leonean market. From a small idea, we've grown into a trusted online marketplace dedicated to serving our community.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Meet the Team</h2>
          <p style={styles.paragraph}>
            We are a passionate team of developers, customer service experts, and logistics professionals committed to excellence. Our diverse backgrounds and shared vision drive us to continuously improve and innovate, ensuring that SaloneBaskit remains the number one choice for online shopping in the region.
          </p>
        </section>
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
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '15px',
  },
  paragraph: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: '#6b7280',
  },
};

export default AboutPage;