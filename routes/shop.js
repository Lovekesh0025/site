const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    let query = 'SELECT * FROM products';
    let params = [];

    if (category) {
      query += ` WHERE category_id = (SELECT id FROM categories WHERE slug = $1)`;
      params.push(category);
    }

    const productsResult = await pool.query(query, params);
    
    // Fetch photos for each product
    const productsWithPhotos = await Promise.all(
      productsResult.rows.map(async (product) => {
        const photosResult = await pool.query(
          'SELECT photo_url FROM product_photos WHERE product_id = $1 ORDER BY display_order LIMIT 1',
          [product.id]
        );
        return {
          ...product,
          firstPhoto: photosResult.rows.length > 0 ? photosResult.rows[0].photo_url : null
        };
      })
    );

    const categoriesResult = await pool.query('SELECT * FROM categories');

    res.render('shop/index', {
      products: productsWithPhotos,
      categories: categoriesResult.rows,
      currentCategory: category || null,
      user: req.session.userId ? { id: req.session.userId } : null
    });
  } catch (err) {
    console.error('Shop Error Details:', err);
    console.error('Error Message:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).render('error', { error: 'Error loading shop' });
  }
});

// Product detail
router.get('/product/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) {
      return res.status(404).render('404');
    }

    const photosResult = await pool.query(
      'SELECT * FROM product_photos WHERE product_id = $1 ORDER BY display_order',
      [result.rows[0].id]
    );

    res.render('shop/product', {
      product: result.rows[0],
      photos: photosResult.rows,
      user: req.session.userId ? { id: req.session.userId } : null
    });
  } catch (err) {
    res.status(500).render('error', { error: 'Error loading product' });
  }
});

// Cart page
router.get('/cart', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }

  try {
    const result = await pool.query(
      `SELECT c.*, p.name, p.price, p.image FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.session.userId]
    );

    const total = result.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.render('shop/cart', {
      items: result.rows,
      total: total,
      user: { id: req.session.userId }
    });
  } catch (err) {
    res.status(500).render('error', { error: 'Error loading cart' });
  }
});

// Add to cart
router.post('/cart/add', async (req, res) => {
  if (!req.session.userId) {
    return res.json({ success: false, message: 'Please login first' });
  }

  const { productId, quantity } = req.body;

  try {
    await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
      [req.session.userId, productId, quantity]
    );

    res.json({ success: true, message: 'Added to cart' });
  } catch (err) {
    res.json({ success: false, message: 'Error adding to cart' });
  }
});

module.exports = router;
