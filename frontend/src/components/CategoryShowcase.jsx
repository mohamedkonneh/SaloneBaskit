import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import CategoryShowcaseCard from './CategoryShowcaseCard'; // Use the new card
import axios from 'axios';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const CategoryShowcase = ({ products }) => {
  const [showcasedCategories, setShowcasedCategories] = useState([]);

  useEffect(() => {
    const fetchShowcasedCategories = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/categories/showcase');
        setShowcasedCategories(data);
      } catch (error) {
        console.error("Could not fetch showcased categories", error);
      }
    };

    fetchShowcasedCategories();
  }, []);


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Pause for 5 seconds
    arrows: false,
    fade: true, // A fade transition looks best with this card design
  };

  // Create a map of products by category for easy lookup
  const productsByCategory = products.reduce((acc, product) => {
    const categoryName = product.category;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});
  if (!showcasedCategories || showcasedCategories.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.mainTitle}>Featured Categories</h2>
      <Slider {...settings}>
        {showcasedCategories.map(category => (
          <div key={category.id}>
            <CategoryShowcaseCard 
              category={category} 
              products={productsByCategory[category.name] || []} 
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

const styles = {
  container: { margin: '50px 0' },
  mainTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '25px',
    textAlign: 'center',
  },
};

export default CategoryShowcase;