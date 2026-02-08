## Setup Instructions

### 1. PostgreSQL Setup
The application requires PostgreSQL to be running on your local machine.

**Windows Installation:**
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and note your password
3. During installation, make sure to select "PostgreSQL Server" and "pgAdmin 4"
4. Start PostgreSQL service (should auto-start after installation)

**Verify PostgreSQL is running:**
```powershell
netstat -ano | findstr ":5432"
```

### 2. Create Database
Open pgAdmin 4 or pgSQL command line and create the database:

```sql
CREATE DATABASE website_db;
```

**Or via command line:**
```powershell
psql -U postgres -c "CREATE DATABASE website_db;"
```

### 3. Initialize Tables
After PostgreSQL is running and database is created, run:

```powershell
npm run seed
```

This will create all necessary tables and add sample data.

### 4. Update .env (if needed)
Edit `.env` file with your PostgreSQL credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=website_db
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD_HERE
SESSION_SECRET=your-secret-key-change-in-production
PORT=3000
NODE_ENV=development
```

### 5. Start the Server
```powershell
npm start
```

Visit: http://localhost:3000

### Troubleshooting

**"Database connection failed"**
- Ensure PostgreSQL is running: `get-service postgresql*`
- Verify database exists: `psql -U postgres -l | findstr website_db`
- Check .env credentials match your PostgreSQL setup

**"Database tables not found"**
- Run: `npm run seed`

**"Cannot find module"**
- Run: `npm install`
