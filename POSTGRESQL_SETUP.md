# PostgreSQL Installation Guide

## Status: PostgreSQL NOT YET INSTALLED ⚠️

Your CupidCrafts project is ready, but PostgreSQL needs to be installed.

---

## 🚀 Install PostgreSQL (Windows)

### Option 1: Download Installer (Recommended)

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the latest version (15 or newer)

2. **Run Installer:**
   - Open the downloaded .exe file
   - Follow setup wizard
   - Default port: 5432 (keep as is)
   - Default username: `postgres`
   - **SET PASSWORD: `localdb`** (as in .env file)

3. **Verify Installation:**
   Open PowerShell and run:
   ```powershell
   psql --version
   ```
   Should show: `psql (PostgreSQL) X.X`

### Option 2: Using Windows Package Manager (Chocolatey)

```powershell
# Install Chocolatey first if not installed
# Then run:
choco install postgresql
```

### Option 3: Using WSL (Windows Subsystem for Linux)

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

---

## 🔧 After Installation

### 1. Verify PostgreSQL is Running

Windows Services:
- Open Services (services.msc)
- Find "postgresql-x64-15" (or your version)
- Status should be "Running"
- If not, right-click → Start

### 2. Test Connection

Open PowerShell and run:
```powershell
psql -U postgres -c "SELECT version();"
```

Should output PostgreSQL version information.

### 3. Create Database

```powershell
psql -U postgres
```

Then paste:
```sql
CREATE DATABASE cutegoods_db;
\q
```

### 4. Run Project Setup

```powershell
cd c:\Users\Administrator\Desktop\website
npm run seed
npm run dev
```

---

## 📋 Products Already Configured

Your project already has 8 sample products:

1. **Anatomical Heart Couple Hoodie** - ₹2799
2. **Sweet Charm Embossed Mug** - ₹599
3. **Radiant Love Multi-Heart Bracelet** - ₹1049
4. **Ultimate Valentine Treat Box** - ₹2199
5. **Reversible Mood Octopus Plush Toy** - ₹299
6. **Scarlet Lovestone Pendant** - ₹1099
7. **Golden Heartline Bracelet** - ₹899
8. **Amor Petite Heart Ring** - ₹349

**10 Categories:**
- Soft Toys
- Pendants
- Bracelets
- Rings
- Mugs
- Hampers
- Hoodies
- T-Shirts
- Candles
- Bag Charms

These are in `scripts/seed.js` and will be added to database when you run:
```powershell
npm run seed
```

---

## ✅ Git Initialized

Your project is now under version control:
- ✅ `.git` folder created
- ✅ All files committed
- ✅ Ready for development

Check status:
```powershell
git status
```

---

## 🎯 Next Steps

1. **Install PostgreSQL** (choose one of the 3 options above)
2. **Create database:**
   ```powershell
   psql -U postgres
   CREATE DATABASE cutegoods_db;
   \q
   ```

3. **Initialize with sample data:**
   ```powershell
   cd c:\Users\Administrator\Desktop\website
   npm run seed
   ```

4. **Start server:**
   ```powershell
   npm run dev
   ```

5. **Open browser:**
   http://localhost:3000

---

## 🔑 Connection Details

After PostgreSQL installation:
- **Host:** localhost
- **Port:** 5432
- **Database:** cutegoods_db (create after install)
- **User:** postgres
- **Password:** localdb (set during installation)

These match your `.env` file.

---

## 💡 Troubleshooting

**psql command not found:**
- PostgreSQL not installed
- Or not in system PATH
- Solution: Reinstall or add to PATH

**Cannot connect to database:**
- PostgreSQL service not running
- Check Services (services.msc)
- Start "postgresql-x64-XX" service

**Port 5432 already in use:**
- Another PostgreSQL instance running
- Or different port in use
- Solution: Change port or stop other instance

**Wrong password:**
- Default password is `postgres`
- Set to `localdb` during installation
- If incorrect, you may need to reinstall

---

## ✨ All Set!

Once PostgreSQL is installed:
1. Create the database
2. Run `npm run seed`
3. Run `npm run dev`
4. Access http://localhost:3000

Your CupidCrafts e-commerce platform will be live! 🚀
