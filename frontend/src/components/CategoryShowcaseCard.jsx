import React from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:5000';
const PLACEHOLDER_IMAGE = 'https://placehold.co/200x200/e9ecef/6c757d?text=...';

const CategoryShowcaseCard = ({ category, products }) => {
  const navigate = useNavigate();

  // Get up to 3 product images for the collage
  const displayProducts = products.slice(0, 3);

  const handleCardClick = () => {
    navigate(`/category/${category.name}`);
  };

  return (
    <div style={styles.card} onClick={handleCardClick}>
      <div style={styles.content}>
        <h3 style={styles.title}>{category.name}</h3>
        <p style={styles.subtitle}>Explore the full collection and find your next favorite item.</p>
        <button style={styles.button}>Shop Now</button>
      </div>
      <div style={styles.imageCollage}>
        {displayProducts.map((p, index) => (
          <div key={p.id} style={{ ...styles.imageWrapper, ...styles[`gridItem${index}`] }}>
            <img 
              src={p.image_url ? `${BACKEND_URL}${p.image_url}` : PLACEHOLDER_IMAGE} 
              alt={p.name} 
              style={styles.image} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    width: '100%',
    height: '300px',
    borderRadius: '16px', // Reduced border effect via rounding
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#007bff', // The "surface color"
    color: 'white',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  content: {
    flex: 1,
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '1rem',
    lineHeight: '1.5',
    marginBottom: '25px',
    opacity: 0.9,
  },
  button: {
    padding: '10px 20px',
    border: '2px solid white',
    borderRadius: '50px',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  imageCollage: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: '8px',
    padding: '8px',
  },
  imageWrapper: {
    borderRadius: '8px',
    overflow: 'hidden',
  },
  gridItem0: {
    gridColumn: '1 / 2',
    gridRow: '1 / 3', // First image is tall
  },
  gridItem1: {
    gridColumn: '2 / 3',
    gridRow: '1 / 2',
  },
  gridItem2: {
    gridColumn: '2 / 3',
    gridRow: '2 / 3',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};

export default CategoryShowcaseCard;