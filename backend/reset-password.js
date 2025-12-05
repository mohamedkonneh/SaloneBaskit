const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables from the root .env file
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const db = require('./src/config/db');

const resetPassword = async () => {
  // Get email and new password from command-line arguments
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error('Please provide an email address and a new password.');
    console.log('Usage: node backend/reset-password.js <user-email> <new-password>');
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.error('Error: Password must be at least 6 characters long.');
    process.exit(1);
  }

  try {
    console.log(`Attempting to reset password for user: ${email}`);

    // 1. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // 2. Update the user's password_hash in the database
    const result = await db.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email, name',
      [passwordHash, email]
    );

    if (result.rows.length === 0) {
      console.error(`Error: User with email "${email}" not found.`);
    } else {
      console.log('Password has been reset successfully for:');
      console.table(result.rows);
    }
  } catch (error) {
    console.error('Failed to reset password:', error);
  } finally {
    db.getPool().end();
  }
};

resetPassword();