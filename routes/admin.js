const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// Admin auth middleware
const adminAuth = (req, res, next) => {
  if (!req.session.userId || !req.session.isAdmin) {
    return res.status(403).render('error', { error: 'Access denied' });
  }
  next();
};

// Dashboard
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const productsCount = await pool.query('SELECT COUNT(*) FROM products');
    const ordersCount = await pool.query('SELECT COUNT(*) FROM orders');
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const recentOrders = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');

    res.render('admin/dashboard', {
      stats: {
        products: productsCount.rows[0].count,
        orders: ordersCount.rows[0].count,
        users: usersCount.rows[0].count
      },
      recentOrders: recentOrders.rows
    });
  } catch (err) {
    res.status(500).render('error', { error: 'Error loading dashboard' });
  }
});

// Products management
router.get('/products', adminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.render('admin/products', { products: result.rows });
  } catch (err) {
    res.status(500).render('error', { error: 'Error loading products' });
  }
});

// Add product form
router.get('/products/new', adminAuth, async (req, res) => {
  try {
    const categories = await pool.query('SELECT * FROM categories');
    res.render('admin/product-form', { categories: categories.rows, product: null });
  } catch (err) {
    res.status(500).render('error', { error: 'Error loading form' });
  }
});

// Add product
router.post('/products', adminAuth, async (req, res) => {
  const { name, description, price, category_id, stock } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  try {
    await pool.query(
      'INSERT INTO products (name, slug, description, price, category_id, stock) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, slug, description, price, category_id, stock]
    );

    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).render('error', { error: 'Error adding product' });
  }
});

// Edit product
router.get('/products/:id/edit', adminAuth, async (req, res) => {
  try {
    const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    const categoriesResult = await pool.query('SELECT * FROM categories');

    if (productResult.rows.length === 0) {
      return res.status(404).render('404');
    }

    res.render('admin/product-form', {
      product: productResult.rows[0],
      categories: categoriesResult.rows
    });
  } catch (err) {
    res.status(500).render('error', { error: 'Error loading product' });
  }
});

// Update product
router.post('/products/:id', adminAuth, async (req, res) => {
  const { name, description, price, category_id, stock } = req.body;

  try {
    await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, category_id=$4, stock=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6',
      [name, description, price, category_id, stock, req.params.id]
    );

    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).render('error', { error: 'Error updating product' });
  }
});

// Delete product
router.post('/products/:id/delete', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).render('error', { error: 'Error deleting product' });
  }
});

// Categories
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.render('admin/categories', { categories: result.rows });
  } catch (err) {
    res.status(500).render('error', { error: 'Error loading categories' });
  }
});

// Add category
router.post('/categories', adminAuth, async (req, res) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  try {
    await pool.query('INSERT INTO categories (name, slug) VALUES ($1, $2)', [name, slug]);
    res.redirect('/admin/categories');
  } catch (err) {
    res.status(500).render('error', { error: 'Error adding category' });
  }
});

// Delete category
router.post('/categories/:id/delete', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.redirect('/admin/categories');
  } catch (err) {
    res.status(500).render('error', { error: 'Error deleting category' });
  }
});

// Orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.render('admin/orders', { orders: result.rows });
  } catch (err) {
    res.status(500).render('error', { error: 'Error loading orders' });
  }
});

module.exports = router;
