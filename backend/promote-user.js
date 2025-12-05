const path = require('path');
// Load environment variables from the root .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const db = require('./src/config/db');

const promoteUser = async () => {
  // Get the email from the command-line arguments
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide an email address.');
    console.log('Usage: node scripts/promote-user.js <user-email>');
    process.exit(1);
  }

  try {
    console.log(`Searching for user with email: ${email}`);
    const result = await db.query(
      'UPDATE users SET is_admin = TRUE WHERE email = $1 RETURNING id, name, email, is_admin',
      [email]
    );

    if (result.rows.length === 0) {
      console.error(`Error: User with email "${email}" not found.`);
      process.exit(1); // Exit with failure code
    } else {
      console.log('Successfully promoted user to admin:');
      console.table(result.rows);
    }
  } catch (error) {
    console.error('Failed to promote user:', error);
    process.exit(1); // Exit with failure code
  } finally {
    // Close the database connection pool
    db.getPool().end();
  }
};

promoteUser();