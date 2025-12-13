const express = require('express');
const router = express.Router();
const { getContentByKey, updateContentByKey } = require('../controllers/contentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/:key')
  .get(getContentByKey)
  .put(protect, admin, updateContentByKey);

module.exports = router;