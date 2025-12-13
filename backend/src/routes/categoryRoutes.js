const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory, getShowcasedCategories } = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/showcase', getShowcasedCategories);
router.route('/').get(getCategories).post(protect, admin, createCategory);
router.route('/:id').put(protect, admin, updateCategory).delete(protect, admin, deleteCategory);

module.exports = router;