import React, { useState, useEffect } from 'react';
import logoImage from '../assets/logo.png'; // Import your logo file

const WelcomeSplashScreen = ({ fadeOut }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      ...styles.splashScreen, 
      animation: fadeOut ? 'fadeOut 0.5s ease-out forwards' : 'animateGradient 10s ease infinite'
    }}>
      <div style={styles.content}>
        <div style={styles.logoContainer}>
          <img src={logoImage} alt="SaloneBaskit Logo" style={styles.logoImage} />
        </div>
        {isMobile ? (
          <div style={styles.spinner}></div>
        ) : (
          <div style={styles.loader}>
            <div style={{...styles.dot, animationDelay: '0s'}}></div>
            <div style={{...styles.dot, animationDelay: '0.2s'}}></div>
            <div style={{...styles.dot, animationDelay: '0.4s'}}></div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  splashScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
    backgroundSize: '400% 400%',
    color: 'white',
    zIndex: 9999,
    fontFamily: 'system-ui, sans-serif',
  },
  content: {
    textAlign: 'center',
  },
  logoContainer: {
    textShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    animation: 'bounceIn 1.2s ease-out',
  },
  logoImage: {
    width: '200px', // Adjust the size of your logo as needed
    height: 'auto',
    objectFit: 'contain',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  dot: {
    width: '12px',
    height: '12px',
    margin: '0 6px',
    backgroundColor: 'white',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out both',
  },
  spinner: {
    width: '30px',
    height: '30px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    margin: '20px auto 0 auto',
    animation: 'spin 1s linear infinite',
  },
};

// Add keyframes for the animations to the document's head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes animateGradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @keyframes bounce {
    0%, 80%, 100% { 
      transform: scale(0);
    } 40% { 
      transform: scale(1.0);
    }
  }

  @keyframes fadeOut {
    to {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: translateY(-100px) scale(0.8);
    }
    60% {
      opacity: 1;
      transform: translateY(10px) scale(1.05);
    }
    80% {
      transform: translateY(-5px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default WelcomeSplashScreen;