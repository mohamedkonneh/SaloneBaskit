import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserCircle, FaChevronDown, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const searchSuggestions = [
  "products...",
  "new arrivals...",
  "special offers...",
  "flash deals...",
  "deals of the day...",
];

const Header = ({ categories = [], searchTerm, onSearchChange, selectedCategory, onCategoryChange, onFilterClick }) => {
  const [placeholder, setPlaceholder] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const { userInfo } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const currentSuggestion = `Search for ${searchSuggestions[suggestionIndex]}`;
    let timeout;

    if (isDeleting) {
      // Handle deleting
      if (placeholder.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholder(prev => prev.slice(0, -1));
        }, 80); // Faster deleting speed
      } else {
        setIsDeleting(false);
        setSuggestionIndex((prevIndex) => (prevIndex + 1) % searchSuggestions.length);
      }
    } else {
      // Handle typing
      if (placeholder.length < currentSuggestion.length) {
        timeout = setTimeout(() => {
          setPlaceholder(currentSuggestion.substring(0, placeholder.length + 1));
        }, 120); // Typing speed
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2500); // Wait before deleting
      }
    }

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, suggestionIndex]);

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Handler for selecting a category from the custom dropdown
  const handleCategorySelect = (categoryName) => {
    onCategoryChange({ target: { value: categoryName } }); // Mimic event object for parent handler
    setIsDropdownOpen(false);
  };

  return (
    <header style={styles.header(isMobile)}>
      <div style={styles.container(isMobile)}>
        {/* Top row for logo and account icon */}
        <div style={styles.topRow}>
          <h1 style={styles.logo(isMobile)}>SaloneBaskit</h1>
          {userInfo && (
            <Link to="/account" style={styles.accountLink}>
              <FaUserCircle size={isMobile ? 26 : 30} />
            </Link>
          )}
        </div>

        {/* Search bar container */}
        <div style={styles.searchContainer(isMobile)}>
          {/* Category select is only shown on desktop */}
          {!isMobile && (
            <div style={styles.categoryDropdownContainer} ref={dropdownRef}>
              <button style={styles.categoryButton} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <span style={styles.categoryButtonText}>{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>
                <FaChevronDown style={{...styles.chevronIcon, transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'}} />
              </button>
              {isDropdownOpen && (
                <div style={styles.dropdownMenu}>
                  <div style={styles.dropdownItem} onClick={() => handleCategorySelect('all')}>
                    All Categories
                  </div>
                  {categories.map(cat => (
                    <div key={cat.id} style={styles.dropdownItem} onClick={() => handleCategorySelect(cat.name)}>
                      {cat.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <input type="text" placeholder={placeholder} style={styles.searchInput} value={searchTerm} onChange={onSearchChange} />
          {isMobile && (
            <button style={styles.filterButton} onClick={onFilterClick}>
              <FaFilter />
            </button>
          )}
          <button style={styles.searchButton(isMobile)}>
            <FaSearch />
          </button>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: (isMobile) => ({
    backgroundColor: '#FF7043', // Modern orange background
    padding: isMobile ? '8px 15px' : '12px 20px', // Reduced padding
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1050,
  }),
  container: (isMobile) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    gap: isMobile ? '10px' : '0',
  }),
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: (isMobile) => ({
    fontSize: isMobile ? '1.5rem' : '1.8rem',
    fontWeight: 'bold',
    color: 'white', // Changed for contrast
    margin: 0,
    flexShrink: 0,
  }),
  searchContainer: (isMobile) => ({
    display: 'flex',
    alignItems: 'center',
    borderRadius: '50px',
    overflow: 'hidden',
    flexGrow: 1,
    marginLeft: isMobile ? 0 : '25px',
    width: isMobile ? '100%' : 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Lighter background for contrast
    border: '1px solid transparent', // For focus effect
    transition: 'border-color 0.2s',
  }),
  categoryDropdownContainer: {
    position: 'relative',
  },
  categoryButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px', // Reduced padding
    border: 'none',
    borderRight: '1px solid #d1d5db',
    backgroundColor: 'transparent',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    color: '#495057',
  },
  categoryButtonText: {
    marginRight: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '120px',
  },
  chevronIcon: {
    transition: 'transform 0.2s ease-in-out',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '110%',
    left: 0,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    zIndex: 10,
    width: '200px',
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #eee',
  },
  dropdownItem: {
    padding: '12px 15px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
    '&:hover': { // Note: This is pseudo-code for hover, React handles this differently
      backgroundColor: '#f0f2f5',
    }
  },
  searchInput: {
    flexGrow: 1,
    padding: '10px 20px', // Reduced padding
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: 'transparent',
  },
  filterButton: {
    padding: '0 15px',
    height: '100%',
    border: 'none',
    borderLeft: '1px solid #d1d5db',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#495057',
    fontSize: '1rem',
  },
  searchButton: (isMobile) => ({
    width: isMobile ? '40px' : '38px', // Reduced size
    height: isMobile ? '40px' : '38px', // Reduced size
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent', // Made transparent
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  accountLink: {
    marginLeft: '20px',
    color: 'white', // Changed for contrast
    display: 'flex',
    alignItems: 'center',
  },
};

export default Header;