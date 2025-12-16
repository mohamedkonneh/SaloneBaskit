import React from 'react';

const ContactPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contact Us</h1>
      <p style={styles.text}>
        Have questions? We'd love to hear from you. Reach out to us via email or phone.
      </p>
      <p><strong>Email:</strong> support@salonebaskit.com</p>
      <p><strong>Phone:</strong> +123 456 7890</p>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
  title: { fontSize: '2.5rem', marginBottom: '20px' },
  text: { fontSize: '1.1rem', lineHeight: '1.6' },
};

export default ContactPage;