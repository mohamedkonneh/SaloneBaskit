import React from 'react';
import Slider from 'react-slick';
import LandscapeProductCard from './LandscapeProductCard';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const cardColors = ['#4A90E2', '#D0021B', '#F5A623', '#7ED321', '#BD10E0', '#4A4A4A'];

const LandscapeProductsCarousel = ({ products, title }) => {
  const settings = {
    dots: true, // Show dots for better navigation feedback
    infinite: products.length > 3, // Loop if there are more products than slides shown
    speed: 500, // The speed of the slide transition (0.5 seconds)
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Set autoplay speed to 2 seconds
    cssEase: 'ease-in-out', // A standard, smooth easing for the transition
    pauseOnHover: true, // Pause the slideshow when the user hovers over it
    slidesToShow: 3,
    slidesToScroll: 1, // Scroll one at a time for a continuous flow
    arrows: true, // Enable navigation arrows for manual control
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2.5,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{title}</h2>
      <Slider {...settings}>
        {products.map((product, index) => (
          <div key={product.id} style={styles.slideWrapper}>
            <LandscapeProductCard 
              product={product} 
              backgroundColor={cardColors[index % cardColors.length]} 
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

const styles = {
  container: { margin: 0, overflow: 'hidden' }, // Removed margin
  title: { fontSize: '0.9rem', fontWeight: 'bold', color: '#333', marginBottom: '25px', paddingLeft: '20px' },
  slideWrapper: { padding: '0 12px' },
};

export default LandscapeProductsCarousel;