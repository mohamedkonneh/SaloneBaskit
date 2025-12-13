const db = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  try {
    // Start a transaction
    await db.query('BEGIN');

    // Determine payment status based on method
    const isPaid = paymentMethod !== 'cod';
    const paidAt = isPaid ? 'NOW()' : 'NULL';

    // Insert into orders table
    const orderQuery = `
      INSERT INTO orders (user_id, shipping_address, payment_method, total_price, is_paid, paid_at)
      VALUES ($1, $2, $3, $4, $5, ${paidAt})
      RETURNING id
    `;
    const orderResult = await db.query(orderQuery, [req.user.id, shippingAddress, paymentMethod, totalPrice, isPaid]);
    const newOrderId = orderResult.rows[0].id;

    // Insert into order_items table
    for (const item of orderItems) {
      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, name, quantity, price, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await db.query(itemQuery, [newOrderId, item.id, item.name, item.quantity, (item.discounted_price || item.price), item.image_url]);
    }

    // Commit the transaction
    await db.query('COMMIT');

    res.status(201).json({ id: newOrderId });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(orders.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
  try {
    const orderQuery = db.query('SELECT o.*, u.name as user_name, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = $1', [req.params.id]);
    const orderItemsQuery = db.query('SELECT * FROM order_items WHERE order_id = $1', [req.params.id]);

    const [orderResult, orderItemsResult] = await Promise.all([orderQuery, orderItemsQuery]);

    if (orderResult.rows.length > 0) {
      const order = { ...orderResult.rows[0], orderItems: orderItemsResult.rows };
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get user order by ID
// @route   GET /api/orders/myorders/:id
// @access  Private
const getMyOrderById = async (req, res) => {
  try {
    const orderQuery = db.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    const orderItemsQuery = db.query('SELECT * FROM order_items WHERE order_id = $1', [req.params.id]);

    const [orderResult, orderItemsResult] = await Promise.all([orderQuery, orderItemsQuery]);

    if (orderResult.rows.length > 0) {
      const order = { ...orderResult.rows[0], orderItems: orderItemsResult.rows };
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);

    if (order.rows.length > 0) {
      const updatedOrder = await db.query(
        'UPDATE orders SET is_delivered = true, delivered_at = NOW() WHERE id = $1 RETURNING *',
        [req.params.id]
      );
      res.json(updatedOrder.rows[0]);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status, admin_note } = req.body;
  try {
    const order = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);

    if (order.rows.length > 0) {
      // Also update delivered status if applicable
      const isDelivered = status === 'Delivered';
      const deliveredAt = isDelivered ? 'NOW()' : 'NULL';

      const updatedOrder = await db.query(
        `UPDATE orders SET status = $1, admin_note = $2, is_delivered = $3, delivered_at = ${deliveredAt} WHERE id = $4 RETURNING *`,
        [status, admin_note, isDelivered, req.params.id]
      );
      res.json(updatedOrder.rows[0]);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const query = `
      SELECT o.*, u.name as user_name, (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    const orders = await db.query(query);
    res.json(orders.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { addOrderItems, getMyOrders, getMyOrderById, getOrderById, getOrders, updateOrderToDelivered, updateOrderStatus };