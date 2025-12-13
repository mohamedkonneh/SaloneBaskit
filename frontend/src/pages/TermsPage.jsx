import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const TermsPage = () => {
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
        <h1 style={styles.mainTitle}>Terms & Privacy</h1>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Introduction</h2>
          <p style={styles.paragraph}>
            Welcome to SaloneBaskit. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions. Do not continue to use SaloneBaskit if you do not agree to all of the terms and conditions stated on this page.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Intellectual Property Rights</h2>
          <p style={styles.paragraph}>
            Other than the content you own, under these Terms, SaloneBaskit and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing the material contained on this Website.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Privacy Policy</h2>
          <p style={styles.paragraph}>
            Your privacy is important to us. Our Privacy Policy, which is available on our website, explains how we collect, use, and protect your personal information. By using our services, you agree to the collection and use of information in accordance with our policy.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Limitation of Liability</h2>
          <p style={styles.paragraph}>
            In no event shall SaloneBaskit, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. SaloneBaskit, including its officers, directors, and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.
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

export default TermsPage;