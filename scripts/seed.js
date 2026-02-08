require('dotenv').config();
const pool = require('../config/database');
const initializeDatabase = require('../config/schema');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Initialize tables
    await initializeDatabase();

    // Add categories
    const categories = [
      { name: 'Soft Toys', slug: 'soft-toys' },
      { name: 'Pendants', slug: 'pendants' },
      { name: 'Bracelets', slug: 'bracelets' },
      { name: 'Rings', slug: 'rings' },
      { name: 'Mugs', slug: 'mugs' },
      { name: 'Hampers', slug: 'hampers' },
      { name: 'Hoodies', slug: 'hoodies' },
      { name: 'T-Shirts', slug: 't-shirts' },
      { name: 'Candles', slug: 'candles' },
      { name: 'Bag Charms', slug: 'bag-charms' }
    ];

    for (const cat of categories) {
      await pool.query(
        'INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [cat.name, cat.slug]
      );
    }

    // Add admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO users (email, password, is_admin) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      ['admin@cupidcrafts.com', adminPassword, true]
    );

    // Add sample products
    const products = [
      {
        name: 'Anatomical Heart Couple Hoodie',
        slug: 'anatomical-heart-couple-hoodie',
        description: 'A premium embroidered hoodie featuring a detailed anatomical heart design',
        price: 2799,
        stock: 50
      },
      {
        name: 'Sweet Charm Embossed Mug',
        slug: 'sweet-charm-embossed-mug',
        description: 'A charming ceramic mug decorated with raised pastel hearts and bows',
        price: 599,
        stock: 100
      },
      {
        name: 'Radiant Love Multi-Heart Bracelet',
        slug: 'radiant-love-multi-heart-bracelet',
        description: 'A delicate adjustable bracelet adorned with multi-colored heart charms',
        price: 1049,
        stock: 75
      },
      {
        name: 'Ultimate Valentine Treat Box',
        slug: 'ultimate-valentine-treat-box',
        description: 'A premium red luxury hamper filled with assorted chocolates and gifts',
        price: 2199,
        stock: 30
      },
      {
        name: 'Reversible Mood Octopus Plush Toy',
        slug: 'reversible-mood-octopus-plush-toy',
        description: 'This adorable plushie flips between two cute expressions',
        price: 299,
        stock: 120
      },
      {
        name: 'Scarlet Lovestone Pendant',
        slug: 'scarlet-lovestone-pendant',
        description: 'Hand-crafted with a radiant scarlet heart crystal',
        price: 1099,
        stock: 40
      },
      {
        name: 'Golden Heartline Bracelet',
        slug: 'golden-heartline-bracelet',
        description: 'A delicate bracelet featuring five mother-of-pearl heart charms',
        price: 899,
        stock: 60
      },
      {
        name: 'Amor Petite Heart Ring',
        slug: 'amor-petite-heart-ring',
        description: 'A dainty ring featuring a vibrant red enamel heart',
        price: 349,
        stock: 150
      }
    ];

    for (const product of products) {
      await pool.query(
        'INSERT INTO products (name, slug, description, price, stock) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [product.name, product.slug, product.description, product.price, product.stock]
      );
    }

    console.log('Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@cupidcrafts.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
