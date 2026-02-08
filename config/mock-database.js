// Mock database for local development without PostgreSQL
const mockDatabase = {
  categories: [
    { id: 1, name: 'Soft Toys', slug: 'soft-toys' },
    { id: 2, name: 'Pendants', slug: 'pendants' },
    { id: 3, name: 'Bracelets', slug: 'bracelets' },
    { id: 4, name: 'Rings', slug: 'rings' },
    { id: 5, name: 'Mugs', slug: 'mugs' },
    { id: 6, name: 'Hampers', slug: 'hampers' },
  ],
  products: [
    { id: 1, name: 'Cute Teddy Bear', slug: 'cute-teddy-bear', description: 'Adorable soft teddy bear', price: 29.99, category_id: 1, image: '/images/teddy.jpg', stock: 50, featured: true, created_at: new Date(), updated_at: new Date() },
    { id: 2, name: 'Heart Pendant', slug: 'heart-pendant', description: 'Beautiful heart pendant', price: 19.99, category_id: 2, image: '/images/pendant.jpg', stock: 100, featured: true, created_at: new Date(), updated_at: new Date() },
    { id: 3, name: 'Friendship Bracelet', slug: 'friendship-bracelet', description: 'Colorful friendship bracelet', price: 14.99, category_id: 3, image: '/images/bracelet.jpg', stock: 75, featured: false, created_at: new Date(), updated_at: new Date() },
    { id: 4, name: 'Silver Ring', slug: 'silver-ring', description: 'Elegant silver ring', price: 34.99, category_id: 4, image: '/images/ring.jpg', stock: 30, featured: true, created_at: new Date(), updated_at: new Date() },
    { id: 5, name: 'Love Mug', slug: 'love-mug', description: 'Coffee mug with love design', price: 12.99, category_id: 5, image: '/images/mug.jpg', stock: 60, featured: false, created_at: new Date(), updated_at: new Date() },
  ],
  users: [],
  orders: [],
};

// Mock pool object that mimics pg Pool interface
class MockPool {
  async query(sql, params = []) {
    try {
      // GET products with category filter
      if (sql.includes('SELECT * FROM products') && sql.includes('WHERE')) {
        const slug = params[0];
        const categoryId = mockDatabase.categories.find(c => c.slug === slug)?.id;
        const filtered = categoryId ? mockDatabase.products.filter(p => p.category_id === categoryId) : mockDatabase.products;
        return { rows: filtered };
      }
      
      // GET all products
      if (sql.includes('SELECT * FROM products')) {
        return { rows: mockDatabase.products };
      }
      
      // GET all categories
      if (sql.includes('SELECT * FROM categories')) {
        return { rows: mockDatabase.categories };
      }
      
      // GET single product by slug
      if (sql.includes('WHERE slug')) {
        const product = mockDatabase.products.find(p => p.slug === params[0]);
        return { rows: product ? [product] : [] };
      }
      
      // INSERT user (register)
      if (sql.includes('INSERT INTO users')) {
        const user = {
          id: mockDatabase.users.length + 1,
          email: params[0],
          password: params[1],
          is_admin: false,
          created_at: new Date(),
        };
        mockDatabase.users.push(user);
        return { rows: [user] };
      }
      
      // SELECT user by email (login)
      if (sql.includes('SELECT * FROM users WHERE email')) {
        const user = mockDatabase.users.find(u => u.email === params[0]);
        return { rows: user ? [user] : [] };
      }
      
      return { rows: [] };
    } catch (err) {
      console.error('Mock DB Error:', err.message);
      return { rows: [] };
    }
  }

  on(event, callback) {
    // Mock error handler
  }
}

module.exports = new MockPool();
