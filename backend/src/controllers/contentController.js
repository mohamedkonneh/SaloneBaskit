const db = require('../config/db');

// @desc    Get content by page key
// @route   GET /api/content/:key
// @access  Public
const getContentByKey = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM site_content WHERE page_key = $1', [req.params.key]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update content by page key
// @route   PUT /api/content/:key
// @access  Private/Admin
const updateContentByKey = async (req, res) => {
  const { content } = req.body;
  try {
    const result = await db.query(
      'UPDATE site_content SET content = $1, updated_at = NOW() WHERE page_key = $2 RETURNING *',
      [content, req.params.key]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getContentByKey, updateContentByKey };