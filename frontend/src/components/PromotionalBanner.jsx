import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from "react-slick";

import { useMediaQuery } from '../hooks/useMediaQuery';
// You need to import the slick-carousel css files
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// A palette of vibrant colors for the text
const nameColors = ['#FFFFFF', '#81D4FA', '#FFCC80', '#A5D6A7', '#CE93D8'];

// Keyframes for our animations
const animationKeyframes = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 30px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translate3d(-50px, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale3d(0.3, 0.3, 0.3);
    }
    to {
      opacity: 1;
    }
  }
`;

// Custom Arrow Components for the Slider
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button style={{...styles.arrow, ...styles.nextArrow}} onClick={onClick}>
      <FaChevronRight />
    </button>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button style={{...styles.arrow, ...styles.prevArrow}} onClick={onClick}>
      <FaChevronLeft />
    </button>
  );
};

// An array of different animation styles to cycle through
const animationStyles = [
  'fadeInUp 0.8s ease-out 0.3s both',
  'fadeInLeft 0.8s ease-out 0.3s both',
  'zoomIn 0.7s ease-out 0.3s both',
];

const PromotionalBanner = () => {
  const [promoProducts, setPromoProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    const fetchPromoProducts = async () => {
      try {
        const { data } = await api.get('/products/promotions');
        // Add mock seasonal promotion for demonstration
        const seasonalPromo = {
          id: 'seasonal-1',
          name: 'Summer Collection is Here!',
          description: 'Up to 40% off on all summer wear.',
          image_url: 'https://placehold.co/1200x400/007bff/white?text=Summer+Sale',
          is_seasonal: true,
        };
        setPromoProducts([seasonalPromo, ...data]);
      } catch (error) {
        console.error("Failed to fetch promotional products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromoProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500, // The speed of the slide transition itself (0.5 seconds)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Pause for 5 seconds before the next slide
    arrows: !isMobile, // Only show arrows on desktop
    fade: true, // Use fade transition for a smoother background change
    cssEase: 'ease-in-out', // A smoother easing for the transition
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const getTag = (product) => {
    if (product.is_deal_of_the_day) return { text: 'Deal of the Day', color: '#dc3545' };
    if (product.is_flash_sale) return { text: 'Flash Sale', color: '#ffc107' };
    if (product.is_new_arrival) return { text: 'New Arrival', color: '#28a745' };
    if (product.is_seasonal) return { text: 'Seasonal Offer', color: '#17a2b8' };
    return null;
  };

  if (loading || promoProducts.length === 0) {
    return null; // Don't render anything if loading or no promos
  }

  return (
    <div style={styles.bannerContainer}>
      <style>{animationKeyframes}</style> {/* Inject keyframes into the page */}
      <Slider {...settings}>
        {promoProducts.map((product, index) => {
          const tag = getTag(product);
          // Correctly get the image URL from the new 'image_urls' array for real products
          const imageUrl = product.is_seasonal 
            ? product.image_url 
            : (product.image_urls && product.image_urls.length > 0 
                ? getImageUrl(product.image_urls[0]) 
                : 'https://placehold.co/1200x400/e9ecef/6c757d?text=Promotion');

          return (
            <Link to={!product.is_seasonal ? `/product/${product.id}` : '#'} key={product.id} style={{textDecoration: 'none'}}>
              <div style={{ ...styles.slide(isMobile), backgroundImage: `url(${imageUrl})` }}>
                <div style={styles.overlay}>
                  {/* Only show the product name with a dynamic color */}
                  <h2 style={{...styles.title, color: nameColors[index % nameColors.length], animation: animationStyles[index % animationStyles.length]}}>{product.name}</h2>
                </div>
              </div>
            </Link>
          );
        })}
      </Slider>
    </div>
  );
};

const styles = {
  bannerContainer: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  slide: (isMobile) => ({
    height: isMobile ? '180px' : '350px', // Further reduced height for mobile
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    color: 'white',
  }),
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,    
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.8) 100%)', // Darker overlay for better text contrast
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
  },
  tag: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 'clamp(2rem, 6vw, 3.5rem)', // Made font slightly larger to be the main focus
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    background: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    color: 'white',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  nextArrow: {
    right: '15px',
  },
  prevArrow: {
    left: '15px',
  },
  description: {
    fontSize: 'clamp(1rem, 3vw, 1.2rem)', // Responsive font size
    maxWidth: '600px',
    marginBottom: '20px',
  },
  button: {
    padding: '12px 25px',
    border: '2px solid white',
    borderRadius: '50px',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
  },
};

export default PromotionalBanner;