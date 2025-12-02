const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getMyOrderById, getOrderById, getOrders, updateOrderToDelivered, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/myorders/:id').get(protect, getMyOrderById);
router.route('/:id').get(protect, admin, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;