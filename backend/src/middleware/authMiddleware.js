const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (excluding the password)
      const { rows } = await db.query('SELECT id, username, email, is_admin, photo_url FROM users WHERE id = $1', [decoded.id]);
      
      if (!rows[0]) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = rows[0];

      next();
    } catch (error) {
      console.error(error);
      // Use return to stop execution after sending the response
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };