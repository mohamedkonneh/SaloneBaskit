const { Pool } = require('pg');

// In a production environment like Render, DATABASE_URL will be set.
// This is a more reliable check than NODE_ENV for this specific script's purpose.
const isProduction = !!process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

const createTables = async () => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS suppliers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      contact_person VARCHAR(255),
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50),
      address TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      is_showcased BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255),
      count_in_stock INTEGER NOT NULL DEFAULT 0,
      image_urls TEXT[],
      brand VARCHAR(255),
      rating DECIMAL(3, 2) DEFAULT 0,
      num_reviews INTEGER DEFAULT 0,
      supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
      is_deal_of_the_day BOOLEAN DEFAULT FALSE,
      is_flash_sale BOOLEAN DEFAULT FALSE,
      is_new_arrival BOOLEAN DEFAULT FALSE,
      is_highlighted BOOLEAN DEFAULT FALSE,
      discounted_price DECIMAL(10, 2),
      has_free_delivery BOOLEAN DEFAULT FALSE,
      estimated_delivery VARCHAR(255),
      colors TEXT[],
      sizes TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      avatar_url VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Add password_hash to users table if it doesn't exist for backward compatibility
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    -- If new users must have a password, you might want to alter existing rows
    -- For example: UPDATE users SET password_hash = 'some_default_placeholder' WHERE password_hash IS NULL;

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'Processing',
      shipping_address JSONB,
      payment_method VARCHAR(50),
      is_paid BOOLEAN DEFAULT FALSE,
      paid_at TIMESTAMP WITH TIME ZONE,
      is_delivered BOOLEAN DEFAULT FALSE,
      delivered_at TIMESTAMP WITH TIME ZONE,
      admin_note TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER,
      name VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      image_url VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS content (
      page_key VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255),
      content TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      message TEXT NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      replied BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      subscription JSONB NOT NULL,
      endpoint VARCHAR(512) NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mailbox (
      id SERIAL PRIMARY KEY,
      recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subject VARCHAR(255),
      body TEXT,
      is_read BOOLEAN DEFAULT FALSE,
      original_message_id INTEGER REFERENCES contact_submissions(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, supplier_id)
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id INTEGER NOT NULL REFERENCES users(id),
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log('Starting database migration...');
    await pool.query(createTablesQuery);
    console.log('Database migration completed successfully.');
  } catch (err) {
    console.error('Error during database migration:', err);
    // Exit with an error code, which will fail the build on Render
    process.exit(1);
  } finally {
    // It's important to end the connection pool, otherwise the script might hang
    await pool.end();
    console.log('Database connection closed.');
  }
};

// This makes the script run itself when you execute `node database.js`
createTables();