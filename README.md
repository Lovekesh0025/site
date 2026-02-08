# CupidCrafts E-Commerce Shop

A full-stack e-commerce website with admin panel built with Node.js, Express, and PostgreSQL.

## Features

- **Customer Features:**
  - Browse products by category
  - User registration and login
  - Shopping cart functionality
  - Product details page
  - Responsive design

- **Admin Features:**
  - Dashboard with statistics
  - Product management (CRUD)
  - Category management
  - Order management
  - Admin authentication

## Requirements

- Node.js (v14+) ✅ **Already Installed**
- PostgreSQL (local server) ⚠️ **NEEDS INSTALLATION** - See [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)
- npm or yarn ✅ **Already Installed**

## Installation

1. **Install PostgreSQL:** 
   - See [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md) for detailed instructions
   - Create local PostgreSQL database: `cutegoods_db`

2. **Clone the repository:**
```bash
cd website
```

3. **Install dependencies:**
```bash
npm install
```
(Already completed! All 145+ packages installed)

3. **Setup PostgreSQL Database:**
   - Create a local PostgreSQL database: `cutegoods_db`
   - Update credentials in `.env` if needed (default: postgres/localdb)

4. **Configure Environment Variables:**
   Edit `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cutegoods_db
   DB_USER=postgres
   DB_PASSWORD=localdb
   SESSION_SECRET=your-secret-key
   NODE_ENV=development
   PORT=3000
   ```

5. **Initialize Database:**
```bash
npm run seed
```

This will:
- Create all necessary database tables
- Add sample products
- Create admin user (email: admin@cupidcrafts.com, password: admin123)

6. **Start the Server:**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
website/
├── config/
│   ├── database.js      # PostgreSQL connection
│   └── schema.js        # Database schema initialization
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── shop.js          # Shop/product routes
│   └── admin.js         # Admin panel routes
├── views/
│   ├── shop/            # Customer-facing templates
│   ├── auth/            # Login/Register templates
│   ├── admin/           # Admin panel templates
│   └── error pages
├── public/              # Static files
├── scripts/
│   └── seed.js          # Database seeding
├── server.js            # Main server file
├── package.json
└── .env                 # Environment variables
```

## Usage

### Customer Section
- **Home Page:** Browse all products or filter by category
- **Product Details:** Click on a product to see details
- **Shopping Cart:** Add items to cart and view cart
- **Login/Register:** Create account or login to access cart

### Admin Section
- **Login:** Use admin credentials (admin@cupidcrafts.com / admin123)
- **Dashboard:** View statistics and recent orders
- **Products:** Add, edit, or delete products
- **Categories:** Manage product categories
- **Orders:** View all customer orders

## Default Admin Credentials

- **Email:** admin@cupidcrafts.com
- **Password:** admin123

> ⚠️ **Important:** Change the admin password after first login in production

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Templates:** EJS
- **Authentication:** bcryptjs, express-session
- **Styling:** CSS (Responsive Design)

## Security Notes

- Passwords are hashed using bcryptjs
- Session-based authentication
- SQL queries use parameterized queries to prevent SQL injection
- CSRF protection should be added for production

## Future Enhancements

- Payment gateway integration
- Email notifications
- Product reviews and ratings
- Wishlist functionality
- Product image upload
- Order tracking
- Email verification
- Two-factor authentication

## License

ISC

## Support

For issues or questions, contact: support@cupidcrafts.com
