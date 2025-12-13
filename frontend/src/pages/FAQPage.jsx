import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaArrowLeft } from 'react-icons/fa';

// In-built content for the FAQ page. You can easily add, remove, or edit items here.
const faqData = [
  {
    question: 'How do I place an order?',
    answer: 'Placing an order is simple! Browse our products, select the items you want, choose your preferred color and size, and add them to your cart. When you\'re ready, proceed to checkout, enter your shipping information, and choose your payment method to complete the purchase.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept a variety of payment methods for your convenience, including major credit cards (Visa, MasterCard), mobile money, and Cash on Delivery (COD). All online transactions are secure and encrypted.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We have a 7-day return policy for most items. If you are not satisfied with your purchase, you can return it within 7 days for a full refund or exchange, provided the item is in its original condition. Please see our full Return Policy page for more details.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order has been shipped, you will receive a confirmation email with a tracking number and a link to the tracking page. You can also find your order status and tracking information in the "My Orders" section of your account.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Currently, we primarily ship within Sierra Leone. We are working on expanding our shipping options to include international destinations in the near future. Please check back for updates!',
  },
];

const FAQItem = ({ faq, index, openIndex, setOpenIndex }) => {
  const isOpen = index === openIndex;

  return (
    <div style={styles.faqItem}>
      <button style={styles.questionButton} onClick={() => setOpenIndex(isOpen ? null : index)}>
        <span style={styles.questionText}>{faq.question}</span>
        <FaChevronDown style={{ ...styles.chevron, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>
      <div style={{ ...styles.answerContainer, gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
        <p style={styles.answerText}>{faq.answer}</p>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter FAQ data based on the search term
  const filteredFaqData = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.page(isMobile)}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <FaArrowLeft style={{ marginRight: '8px' }} /> Back
        </button>
        <h1 style={styles.mainTitle}>Frequently Asked Questions</h1>
        
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.faqContainer}>
          {filteredFaqData.length > 0 ? (
            filteredFaqData.map((faq, index) => (
              <FAQItem 
                key={index} 
                faq={faq} 
                index={index} 
                openIndex={openIndex} 
                setOpenIndex={setOpenIndex} 
              />
            ))
          ) : (
            <p style={styles.noResultsText}>No questions found matching your search.</p>
          )}
        </div>
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
  searchContainer: {
    marginBottom: '30px',
  },
  searchInput: {
    width: '100%',
    padding: '15px',
    fontSize: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxSizing: 'border-box',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '20px',
  },
  faqContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  faqItem: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  questionButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
  },
  questionText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#111827',
  },
  chevron: {
    fontSize: '1rem',
    color: '#6b7280',
    transition: 'transform 0.3s ease',
  },
  answerContainer: {
    display: 'grid',
    gridTemplateRows: '0fr',
    transition: 'grid-template-rows 0.3s ease-out',
  },
  answerText: {
    padding: '0 20px 20px 20px',
    margin: 0,
    color: '#374151',
    lineHeight: '1.6',
    // This is crucial for the grid animation to work smoothly
    overflow: 'hidden',
  },
};

export default FAQPage;