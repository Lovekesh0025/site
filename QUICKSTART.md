# Quick Start Guide - CupidCrafts Shop

## Prerequisites
- PostgreSQL installed and running locally
- Node.js v14+ installed

## Step 1: Verify PostgreSQL is Running
Make sure your PostgreSQL server is running on localhost:5432

## Step 2: Create the Database
```sql
CREATE DATABASE cutegoods_db;
```

You can do this through:
- pgAdmin (GUI)
- Command line: `psql -U postgres -c "CREATE DATABASE cutegoods_db;"`

## Step 3: Seed the Database
```bash
npm run seed
```

This will:
- Create all tables
- Add sample products
- Create admin user

**Output:**
```
Admin credentials:
Email: admin@cupidcrafts.com
Password: admin123
```

## Step 4: Start the Server
```bash
npm start        # Production mode
npm run dev      # Development mode with hot reload
```

## Step 5: Access the Application
- **Customer Site:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/dashboard
  - Login with: admin@cupidcrafts.com / admin123

## Testing the Application

### As a Customer:
1. Visit http://localhost:3000
2. Click "Register" or "Login"
3. Create a new account
4. Browse products
5. Add items to cart
6. View cart (login required)

### As an Admin:
1. Login to http://localhost:3000/admin/dashboard
2. Use: admin@cupidcrafts.com / admin123
3. Manage products, categories, and view orders

## Troubleshooting

**Database Connection Error:**
- Verify PostgreSQL is running
- Check `.env` file has correct credentials
- Ensure database `cutegoods_db` exists

**Port Already in Use:**
- Change PORT in `.env` file to another port (e.g., 3001)

**Missing Dependencies:**
```bash
npm install
```

## Environment Variables (.env)
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

## File Structure
- `server.js` - Main application entry point
- `routes/` - API and page routes
- `views/` - EJS templates (HTML)
- `config/` - Database configuration
- `scripts/seed.js` - Database seeding script
- `public/` - Static files (CSS, JS, images)

## Features Included

✅ Product catalog with categories
✅ User authentication (register/login)
✅ Shopping cart
✅ Admin dashboard
✅ Product management
✅ Category management
✅ Order tracking
✅ Responsive design

## Support
For issues, check the README.md file or contact support@cupidcrafts.com
