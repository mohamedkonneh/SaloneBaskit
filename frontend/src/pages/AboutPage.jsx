import React from 'react';

const AboutPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About SaloneBaskit</h1>
      <p style={styles.text}>
        Welcome to SaloneBaskit, your one-stop shop for the best products delivered right to your doorstep. Our mission is to provide quality, convenience, and outstanding customer service.
      </p>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
  title: { fontSize: '2.5rem', marginBottom: '20px' },
  text: { fontSize: '1.1rem', lineHeight: '1.6' },
};

export default AboutPage;