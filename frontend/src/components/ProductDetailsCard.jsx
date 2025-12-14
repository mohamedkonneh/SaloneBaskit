import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaStar, FaLock, FaShippingFast, FaShareAlt, FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext'; // Import settings hook
import { useAuth } from '../hooks/useAuth'; // Import useAuth
import { getImageUrl } from '../pages/imageUrl'; // Import the helper
import FeaturedProductsCarousel from './FeaturedProductsCarousel'; // Import the carousel

const PLACEHOLDER_IMAGE = 'https://placehold.co/500x500/e9ecef/6c757d?text=No+Image'; 

// A mapping of color names to valid CSS color codes.
const colorMap = {
  'red': '#dc3545',
  'blue': '#007bff',
  'green': '#28a745',
  'black': '#343a40',
  'white': '#f8f9fa',
  'grey': '#6c757d',
  'yellow': '#ffc107',
  'purple': '#6f42c1',
  'pink': '#e83e8c',
  'orange': '#fd7e14',
  // Add any other common colors you expect admins to use
};

const ProductDetailsCard = ({ product, relatedProducts }) => {
  const images = product?.image_urls || [];
  const [selectedImage, setSelectedImage] = useState(0); 
  // Initialize state based on product data. Use null or undefined if not available.
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { settings } = useSettings(); // Get global settings
  const { userInfo } = useAuth(); // Get user info for review submission
  const [userRating, setUserRating] = useState(0); // State for user's selected rating
  const [reviewText, setReviewText] = useState(''); // State for user's review comment
  const [hoverRating, setHoverRating] = useState(0); // State for star hover effect
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isBuyNowHovered, setIsBuyNowHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!product) {
    return <div>Loading product details...</div>;
  }

  const hasDiscount = product.discounted_price && product.discounted_price < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.discounted_price) / product.price) * 100) : 0;

  // Helper function to format price based on selected currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat(settings.language, {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    // Only add color and size if they are available and have been selected.
    const itemToAdd = { 
      ...product, 
      quantity,
      color: selectedColor,
      size: selectedSize,
      price: product.discounted_price || product.price // Use the correct price for the cart
    };
    addToCart(itemToAdd);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // This else block is now handled by rendering a different button.
      // The function will only be called if navigator.share exists.
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Product link copied to clipboard!');
  };

  const handleReviewSubmit = async () => {
    if (!userInfo) {
      toast.error("Please log in to submit a review.");
      return;
    }
    if (userRating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (reviewText.trim() === '') {
      toast.error("Please enter your review text.");
      return;
    }

    try {
      // Assuming a new backend endpoint for submitting reviews
      await api.post(`/products/${product.id}/reviews`, { rating: userRating, comment: reviewText });
      toast.success("Review submitted successfully!");
      setUserRating(0); // Reset form
      setReviewText(''); // Reset form
      // Optionally, you might want to re-fetch product details to update the displayed average rating/reviews
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <>
      <div style={styles.card(isMobile)}>
        <div style={styles.grid(isMobile)}>
          {/* --- Image Gallery --- */}
          <div style={styles.imageGallery}>
            <div style={styles.mainImageContainer}>
                <img 
                  src={images.length > 0 ? getImageUrl(images[selectedImage]) : PLACEHOLDER_IMAGE} 
                  alt={product.name} 
                  style={styles.mainImage}
                />
              </div>
            <div style={styles.thumbnailContainer}>
              {images.map((img, index) => (
                <div 
                  key={index} 
                  style={{...styles.thumbnail, ...(selectedImage === index ? styles.activeThumbnail : {})}}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={getImageUrl(img)} alt={`thumbnail ${index + 1}`} style={styles.thumbnailImage} />
                </div>
              ))}
            </div>
          </div>

          {/* --- Product Details --- */}
          <div style={styles.detailsColumn}>
            <div style={styles.metaInfo}>
              <span style={styles.category}>{product.category}</span>
              {product.brand && product.supplier_id && ( // Add check for product.supplier_id
                <Link to={`/suppliers/${product.supplier_id}`} style={styles.brandLink} onClick={(e) => e.stopPropagation()}>
                  Brand: {product.brand}
                </Link>
              )}
              {navigator.share ? (
                <button onClick={handleShare} style={styles.shareButton} title="Share this product">
                  <FaShareAlt /> Share
                </button>
              ) : (
                <button onClick={handleCopyLink} style={styles.shareButton} title="Copy product link">
                  <FaCopy /> Copy Link
                </button>
              )}
            </div>
            <h1 style={styles.title(isMobile)}>{product.name}</h1>

            <div style={styles.ratingContainer}>
              <FaStar color="#ffc107" />
              <span style={styles.ratingText}>{Number(product.rating || 0).toFixed(1)}</span>
              <span style={styles.reviewsText}>({product.num_reviews || 0} reviews)</span>
            </div>

            <div style={styles.priceSection(isMobile)}>
              {hasDiscount ? (
                <>
                  <p style={styles.discountedPrice(isMobile)}>{formatPrice(product.discounted_price)}</p>
                  <p style={styles.originalPrice}>{formatPrice(product.price)}</p>
                  <span style={styles.discountBadge}>{`-${discountPercentage}%`}</span>
                </>
              ) : (
                <p style={styles.price(isMobile)}>{formatPrice(product.price)}</p>
              )}
            </div>

            <div style={styles.deliveryInfo}>
              <div style={styles.deliveryTextContainer}>
                {product.has_free_delivery && <p style={styles.deliveryMainText}>FREE Delivery</p>}
                {product.estimated_delivery && <p style={styles.deliverySubText}>Arrives by: <strong>{product.estimated_delivery}</strong></p>}
              </div>
            </div>

            <p style={styles.stockStatus(product.count_in_stock > 0)}>
              {product.count_in_stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>

            <div style={{borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px'}}>
              <p style={styles.description}>{product.description || 'No description available for this product.'}</p>
            </div>

            <p style={styles.description}>{product.description || 'No description available for this product.'}</p>

            {product.colors && product.colors.length > 0 && (
              <div style={styles.optionsSection}>
                <p style={styles.optionsLabel}>Color:</p>
                <div style={styles.swatchContainer}>
                  {product.colors.map(color => (
                    <div
                      key={color} 
                      // Use the colorMap to get a valid CSS color, or use the input directly if it's already a code (e.g., #FFF)
                      style={{
                        ...styles.colorSwatch, 
                        backgroundColor: colorMap[color.toLowerCase()] || color, 
                        ...(selectedColor === color ? styles.activeSwatch : {})
                      }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div style={styles.optionsSection}>
                <p style={styles.optionsLabel}>Size:</p>
                <div style={styles.sizeContainer}>
                  {product.sizes.map(size => (
                    <button 
                      key={size} 
                      style={{...styles.sizeButton, ...(selectedSize === size ? styles.activeSizeButton : {})}}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.optionsSection}>
              <label style={styles.optionsLabel}>Quantity:</label>
              <div style={styles.quantitySelector}>
                <button style={styles.quantityBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span style={styles.quantityValue}>{quantity}</span>
                <button style={styles.quantityBtn} onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            <div style={styles.actions}>
              <button 
                onClick={handleAddToCart} 
                style={{...styles.actionButton, ...styles.addToCartBtn, ...(isCartHovered ? styles.buttonHover : {})}}
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                Add to Cart
              </button>
              <button onClick={handleBuyNow} 
                style={{...styles.actionButton, ...styles.buyNowBtn, ...(isBuyNowHovered ? styles.buttonHover : {})}}
                onMouseEnter={() => setIsBuyNowHovered(true)}
                onMouseLeave={() => setIsBuyNowHovered(false)}>
                Buy Now
              </button>
            </div>

            <div style={styles.secureTransaction}>
              <FaLock size={14} color="#6c757d" />
              <span>Secure transaction</span>
            </div>
          </div>
        </div>
      </div>
      {relatedProducts && relatedProducts.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <FeaturedProductsCarousel products={relatedProducts} title="Related Products" />
        </div>
      )}
    </>
  );
};

const styles = {
  card: (isMobile) => ({ 
    backgroundColor: 'white', 
    borderRadius: '8px', // Reduced border radius for a sharper look
    padding: isMobile ? '20px' : '40px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Made the shadow more subtle
    fontFamily: 'system-ui, sans-serif' 
  }),
  grid: (isMobile) => ({ 
    display: 'grid', 
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr', 
    gap: isMobile ? '30px' : '50px' 
  }),
  // Image Gallery
  imageGallery: {},
  mainImageContainer: { width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f4f6f9', marginBottom: '15px' },
  mainImage: { width: '100%', height: 'auto', display: 'block' },
  thumbnailContainer: { display: 'flex', gap: '10px' },
  thumbnail: { 
    width: '50px', 
    height: '80px',
    borderRadius: '8px', 
    overflow: 'hidden', 
    cursor: 'pointer', 
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'transparent'
  },
  activeThumbnail: { borderColor: '#007bff' },
  thumbnailImage: { width: '100%', height: '100%', objectFit: 'cover' },
  // Details
  detailsColumn: { display: 'flex', flexDirection: 'column' },
  metaInfo: { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' },
  category: { color: '#007bff', fontWeight: '600', fontSize: '0.9rem' },
  brandLink: { color: '#6c757d', fontSize: '0.9rem', textDecoration: 'none' },
  shareButton: {
    background: '#f0f2f5',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 15px',
    cursor: 'pointer',
    color: '#495057',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto', // Pushes the button to the far right
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s ease, transform 0.2s ease',
  },
  title: (isMobile) => ({ 
    fontSize: isMobile ? '1.8rem' : '2.5rem', 
    fontWeight: 'bold', 
    margin: '0 0 15px 0' 
  }),
  ratingContainer: { display: 'flex', alignItems: 'center', color: '#6c757d', fontSize: '1rem', marginBottom: '20px' },
  ratingText: { marginLeft: '8px', fontWeight: 'bold', color: '#333' },
  reviewsText: { marginLeft: '8px' },
  description: { fontSize: '1rem', lineHeight: '1.6', color: '#555', margin: 0 },
  // Price
  priceSection: (isMobile) => ({ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '15px' }),
  price: (isMobile) => ({ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 'bold', color: '#333', margin: 0 }),
  discountedPrice: (isMobile) => ({ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 'bold', color: '#dc3545', margin: 0 }),
  originalPrice: { fontSize: '1.2rem', color: '#6c757d', textDecoration: 'line-through', margin: 0 },
  discountBadge: { backgroundColor: '#dc3545', color: 'white', padding: '4px 10px', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold' },
  // Options
  optionsSection: { marginBottom: '20px' },
  optionsLabel: { fontWeight: '600', marginBottom: '10px' },
  swatchContainer: { display: 'flex', gap: '10px' },
  colorSwatch: { 
    width: '30px', 
    height: '30px', 
    borderRadius: '50%', 
    cursor: 'pointer', 
    border: '2px solid white', 
    boxShadow: '0 0 0 1px #ccc',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease' // Add smooth transition
  },
  activeSwatch: { 
    boxShadow: '0 0 0 2px #007bff',
    transform: 'scale(1.15)' // Make the selected swatch pop
  },
  sizeContainer: { display: 'flex', gap: '10px' },
  sizeButton: { 
    padding: '8px 15px', 
    border: '1px solid #ccc', 
    borderRadius: '8px', 
    background: 'white', 
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease', // Add smooth transition
  },
  activeSizeButton: {
    backgroundColor: '#343a40',
    color: 'white',
    borderColor: '#343a40',
  },
  quantitySelector: { display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px', width: 'fit-content' },
  quantityBtn: { background: 'none', border: 'none', fontSize: '1.2rem', padding: '8px 15px', cursor: 'pointer' },
  quantityValue: { padding: '8px 15px', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', fontWeight: 'bold' },
  // Actions
  actions: { display: 'flex', flexDirection: 'column', gap: '10px' },
  actionButton: {
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'filter 0.2s ease-in-out', // Smooth transition for hover effect
  },
  addToCartBtn: {
    backgroundColor: '#ffd814', // Amazon-like yellow
    color: '#0f1111',
  },
  buyNowBtn: {
    backgroundColor: '#ffa41c', // Amazon-like orange
    color: '#0f1111',
  },
  buttonHover: {
    filter: 'brightness(0.95)', // Slightly darken the button on hover
  },
  // Delivery
  deliveryInfo: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  deliveryTextContainer: {},
  deliveryMainText: { color: '#007185', fontSize: '1rem', margin: '0 0 4px 0' },
  deliverySubText: { color: '#565959', fontSize: '0.9rem', margin: 0 },
  stockStatus: (inStock) => ({
    fontSize: '1.2rem',
    fontWeight: '500',
    color: inStock ? '#007600' : '#B12704',
    marginBottom: '15px',
  }),
  secureTransaction: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#565959',
    marginTop: '15px',
  },
};

export default ProductDetailsCard;