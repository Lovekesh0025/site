const express = require('express');
const pool = require('../config/database');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for photo uploads
const uploadsDir = path.join(__dirname, '../public/uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP allowed.'));
    }
  }
});

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
router.post('/products', adminAuth, upload.array('photos', 10), async (req, res) => {
  const { name, description, price, category_id, stock } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  try {
    const productResult = await pool.query(
      'INSERT INTO products (name, slug, description, price, category_id, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, slug, description, price, category_id, stock]
    );

    const productId = productResult.rows[0].id;

    // Insert photos
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        await pool.query(
          'INSERT INTO product_photos (product_id, photo_url, display_order) VALUES ($1, $2, $3)',
          [productId, '/uploads/products/' + req.files[i].filename, i]
        );
      }
    }

    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).render('error', { error: 'Error adding product' });
  }
});

// Edit product
router.get('/products/:id/edit', adminAuth, async (req, res) => {
  try {
    const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    const photosResult = await pool.query('SELECT * FROM product_photos WHERE product_id = $1 ORDER BY display_order', [req.params.id]);
    const categoriesResult = await pool.query('SELECT * FROM categories');

    if (productResult.rows.length === 0) {
      return res.status(404).render('404');
    }

    res.render('admin/product-form', {
      product: productResult.rows[0],
      photos: photosResult.rows,
      categories: categoriesResult.rows
    });
  } catch (err) {
    res.status(500).render('error', { error: 'Error loading product' });
  }
});

// Update product
router.post('/products/:id', adminAuth, upload.array('photos', 10), async (req, res) => {
  const { name, description, price, category_id, stock } = req.body;

  try {
    await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, category_id=$4, stock=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6',
      [name, description, price, category_id, stock, req.params.id]
    );

    // Insert new photos
    if (req.files && req.files.length > 0) {
      const existingPhotos = await pool.query('SELECT COUNT(*) FROM product_photos WHERE product_id = $1', [req.params.id]);
      const startOrder = parseInt(existingPhotos.rows[0].count);

      for (let i = 0; i < req.files.length; i++) {
        await pool.query(
          'INSERT INTO product_photos (product_id, photo_url, display_order) VALUES ($1, $2, $3)',
          [req.params.id, '/uploads/products/' + req.files[i].filename, startOrder + i]
        );
      }
    }

    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).render('error', { error: 'Error updating product' });
  }
});

// Delete product
router.post('/products/:id/delete', adminAuth, async (req, res) => {
  try {
    // Delete associated photos from filesystem
    const photosResult = await pool.query('SELECT photo_url FROM product_photos WHERE product_id = $1', [req.params.id]);
    photosResult.rows.forEach(photo => {
      const filePath = path.join(__dirname, '../public' + photo.photo_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).render('error', { error: 'Error deleting product' });
  }
});

// Delete specific product photo
router.post('/products/:id/photos/:photoId/delete', adminAuth, async (req, res) => {
  try {
    const photoResult = await pool.query('SELECT photo_url FROM product_photos WHERE id = $1', [req.params.photoId]);
    if (photoResult.rows.length > 0) {
      const filePath = path.join(__dirname, '../public' + photoResult.rows[0].photo_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await pool.query('DELETE FROM product_photos WHERE id = $1 AND product_id = $2', [req.params.photoId, req.params.id]);
    res.redirect(`/admin/products/${req.params.id}/edit`);
  } catch (err) {
    res.status(500).render('error', { error: 'Error deleting photo' });
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
