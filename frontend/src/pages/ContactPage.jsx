import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import countryCodes from '../data/countryCodes.json'; // We will create this file

const YOUR_WHATSAPP_NUMBER = '23212345678'; // Replace with your business WhatsApp number

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+232',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track submission success
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
      const submissionData = { ...formData, phone: fullPhoneNumber };

      const { data } = await api.post('/contact', submissionData);
      toast.success(data.message || 'Message sent successfully!');
      setIsSubmitted(true); // Show the success message
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the form and allow another submission
  const handleSendAnother = () => {
    setFormData({ name: '', email: '', countryCode: '+232', phone: '', message: '' });
    setIsSubmitted(false);
  };

  return (
    <div style={styles.page(isMobile)}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <FaArrowLeft style={{ marginRight: '8px' }} /> Back
      </button>
      <div style={styles.header(isMobile)}>
        <h1 style={{...styles.title, fontSize: isMobile ? '2.5rem' : '3rem'}}>Get In Touch</h1>
        <p style={{...styles.subtitle, fontSize: isMobile ? '1rem' : '1.1rem'}}>We'd love to hear from you. Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.</p>
      </div>
      <div style={styles.container(isMobile)}>
        {/* All content is now in a single flow */}
        <div style={styles.formContent}>
          {isSubmitted ? (
            <div style={styles.successContainer}>
              <h2 style={styles.successTitle}>Thank You!</h2>
              <p style={styles.successMessage}>Your message has been sent successfully. We will get back to you shortly.</p>
              <button onClick={handleSendAnother} style={styles.submitButton}>Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.label}>Name</label> 
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} style={styles.input(isMobile)} required />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} style={styles.input(isMobile)} required />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="phone" style={styles.label}>Phone Number</label>
                <div style={styles.phoneInputContainer}>
                  <select name="countryCode" value={formData.countryCode} onChange={handleChange} style={styles.countryCodeSelect} required>
                    {countryCodes.map(country => (
                      <option key={country.code} value={country.dial_code}>{country.name} ({country.dial_code})</option>
                    ))}
                  </select>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} style={styles.phoneInput} required placeholder="Enter your number" />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="message" style={styles.label}>Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} style={styles.textarea(isMobile)} rows="5" required></textarea>
              </div>
              <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              {/* Contact Info integrated below the form */}
              <div style={styles.infoSection}>
                <h2 style={styles.infoTitle}>Or Reach Us Directly</h2>
                <div style={styles.infoItem}>
                  <FaEnvelope style={styles.infoIcon} />
                  <span>support@salonebaskit.com</span>
                </div>
                <div style={styles.infoItem}>
                  <FaMapMarkerAlt style={styles.infoIcon} />
                  <span>123 Shopping Lane, Freetown, Sierra Leone</span>
                </div>
                <a href={`https://wa.me/${YOUR_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" style={styles.whatsappButton}>
                  <FaWhatsapp style={{ marginRight: '10px' }} />
                  Chat on WhatsApp
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: (isMobile) => ({ backgroundColor: '#f9fafb', padding: isMobile ? '30px 15px' : '60px 20px' }),
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
  header: (isMobile) => ({ textAlign: 'center', marginBottom: isMobile ? '30px' : '50px', maxWidth: '700px', margin: `0 auto ${isMobile ? '30px' : '50px'}` }),
  title: { fontSize: '3rem', fontWeight: 'bold', color: '#111827', marginBottom: '15px' },
  subtitle: { color: '#6b7280', lineHeight: '1.6' },
  container: (isMobile) => ({
    maxWidth: '800px', // A more focused width for a single form
    margin: '0 auto',
    backgroundColor: 'white',
    padding: isMobile ? '20px' : '50px', // Reduced mobile padding
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    boxSizing: 'border-box', // Ensure padding is included in the width
  }),
  formContent: {},
  successContainer: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  successTitle: {
    fontSize: '2rem',
    color: '#28a745',
    marginBottom: '15px',
  },
  successMessage: {
    fontSize: '1.1rem',
    color: '#6c757d',
    marginBottom: '30px',
  },
  infoSection: { marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #eee' },
  infoTitle: { fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginTop: 0, marginBottom: '20px', textAlign: 'center' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', color: '#374151', justifyContent: 'center' },
  infoIcon: { color: '#007bff', fontSize: '1.2rem' },
  whatsappButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 20px',
    backgroundColor: '#25D366',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: 'auto',
    textAlign: 'center',
  },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151', fontSize: '0.9rem' },
  input: (isMobile) => ({
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: isMobile ? '0.9rem' : '1rem',
    boxSizing: 'border-box',
  }),
  phoneInputContainer: { 
    display: 'flex', 
    alignItems: 'center',
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    overflow: 'hidden', // This is key to making it look like one input
  },
  phoneInput: {
    flex: 1,
    border: 'none',
    padding: '12px',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '1rem',
  },
  countryCodeSelect: {
    padding: '12px',
    border: 'none',
    borderRight: '1px solid #d1d5db', // Separator line
    backgroundColor: '#f9fafb',
    outline: 'none',
    width: '130px', // Give the select a fixed width
    flexShrink: 0, // Prevent it from shrinking
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  textarea: (isMobile) => ({
    width: '100%',
    padding: '12px',
    border: '1px solid #271575ff',
    borderRadius: '8px',
    fontSize: isMobile ? '0.9rem' : '1rem',
    boxSizing: 'border-box',
    resize: 'vertical',
  }),
  submitButton: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default ContactPage;