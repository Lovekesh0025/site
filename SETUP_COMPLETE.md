# CupidCrafts E-Commerce Project - Setup Complete ✅

Your Node.js e-commerce website with admin panel has been successfully created!

## 📁 Project Overview

This is a full-featured e-commerce platform replicating the CupidCrafts shop with a complete admin panel.

### What's Included:

**Frontend (Customer Area):**
- Homepage with product listings
- Category filtering
- Product detail pages
- Shopping cart system
- User authentication (register/login)
- Responsive design

**Admin Panel:**
- Dashboard with statistics
- Product CRUD operations
- Category management
- Order management system
- Admin-only access control

**Backend:**
- Node.js + Express server
- PostgreSQL database
- Session-based authentication
- Secure password hashing (bcryptjs)
- RESTful API structure

## 🚀 Getting Started

### 1. **Setup PostgreSQL Database**
```sql
CREATE DATABASE cutegoods_db;
```

### 2. **Install Dependencies** (Already Done!)
```bash
npm install
```

### 3. **Initialize Database with Sample Data**
```bash
npm run seed
```

This creates:
- All database tables
- Sample products (8 items from original shop)
- Admin user account

**Default Admin Credentials:**
- Email: `admin@cupidcrafts.com`
- Password: `admin123`

### 4. **Start the Server**
```bash
npm run dev        # Development mode (with auto-reload)
# or
npm start          # Production mode
```

Server runs on: **http://localhost:3000**

## 📂 Project Structure

```
website/
├── config/
│   ├── database.js       # PostgreSQL connection
│   └── schema.js         # Database table definitions
├── routes/
│   ├── auth.js           # Login/Register/Logout
│   ├── shop.js           # Products & Cart
│   └── admin.js          # Admin panel
├── views/
│   ├── shop/
│   │   ├── index.ejs     # Product listing
│   │   ├── product.ejs   # Product detail
│   │   └── cart.ejs      # Shopping cart
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   ├── products.ejs
│   │   ├── categories.ejs
│   │   ├── orders.ejs
│   │   └── product-form.ejs
│   ├── 404.ejs
│   └── error.ejs
├── scripts/
│   └── seed.js           # Database seeding
├── server.js             # Main app entry
├── package.json
├── .env                  # Environment config
└── README.md
```

## 🛒 Main URLs

**Customer Section:**
- `http://localhost:3000/` - Homepage/Shop
- `http://localhost:3000/auth/login` - Login
- `http://localhost:3000/auth/register` - Register
- `http://localhost:3000/cart` - Shopping cart

**Admin Section:**
- `http://localhost:3000/admin/dashboard` - Dashboard
- `http://localhost:3000/admin/products` - Product management
- `http://localhost:3000/admin/categories` - Category management
- `http://localhost:3000/admin/orders` - Order management

## 🔧 Environment Configuration

The `.env` file is pre-configured for local development:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cutegoods_db
DB_USER=postgres
DB_PASSWORD=localdb
SESSION_SECRET=your-super-secret-session-key-change-this
NODE_ENV=development
PORT=3000
```

**To change database credentials:**
1. Edit `.env` file
2. Ensure PostgreSQL has matching user/password
3. Restart server

## 📦 Database Schema

**Tables Created:**
- `users` - Customer and admin accounts
- `categories` - Product categories
- `products` - Product inventory
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `cart` - Shopping cart items

## 🔐 Security Features

✅ Password hashing (bcryptjs)
✅ Session-based authentication
✅ Admin-only access control
✅ SQL injection prevention (parameterized queries)

## 🎨 Features

### Customer Features:
- ✅ Product browsing with category filters
- ✅ Product search and details
- ✅ User registration and login
- ✅ Shopping cart with persistent storage
- ✅ Responsive mobile-friendly design

### Admin Features:
- ✅ Dashboard with statistics
- ✅ Add/Edit/Delete products
- ✅ Manage categories
- ✅ View all orders
- ✅ Secure admin authentication

## 📝 Sample Data Included

The seeding script adds:
- **8 Products** from the original CupidCrafts shop
- **10 Categories** (Soft Toys, Mugs, Hoodies, etc.)
- **Admin User** for management

## 🛠️ Available Commands

```bash
npm start          # Start server (production)
npm run dev        # Start with auto-reload (development)
npm run seed       # Initialize database with sample data
npm install        # Install dependencies
```

## 📚 Documentation

- `README.md` - Complete documentation
- `QUICKSTART.md` - Quick setup guide
- `server.js` - Main application code with comments

## 🐛 Troubleshooting

**Database Connection Issues:**
- Verify PostgreSQL is running: `psql -U postgres -c "SELECT 1"`
- Check database exists: `psql -U postgres -l | grep cutegoods`
- Verify .env credentials match your PostgreSQL setup

**Port Already in Use:**
- Change `PORT` in `.env` to 3001, 3002, etc.
- Or kill existing process on port 3000

**Missing node_modules:**
```bash
npm install
```

**Reset Database:**
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE cutegoods_db;"
psql -U postgres -c "CREATE DATABASE cutegoods_db;"
npm run seed
```

## 🌐 Next Steps

1. **Customize Products** - Add your own products in admin panel
2. **Change Admin Password** - Update admin credentials
3. **Add Payment Gateway** - Integrate Stripe, PayPal, etc.
4. **Deploy** - Use Heroku, AWS, Digital Ocean, etc.
5. **Add Features** - Reviews, wishlists, email notifications, etc.

## 📞 Support

For issues or questions:
- Check README.md for detailed documentation
- Review QUICKSTART.md for setup help
- Check server logs for error messages

---

**Project successfully initialized!** 🎉

Your e-commerce platform is ready to use. Run `npm run dev` to start developing!
