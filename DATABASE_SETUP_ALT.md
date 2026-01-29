# Database Setup - Alternative Methods

## Issue

System MariaDB/MySQL service is failing to start. This guide provides alternatives.

## Option 1: Use XAMPP (Recommended)

If you have XAMPP installed:

```bash
# Start XAMPP MySQL
sudo /opt/lampp/lampp startmysql

# Import using XAMPP's MySQL client
/opt/lampp/bin/mysql -u root < database/schema.sql
/opt/lampp/bin/mysql -u root sayansi_yathu < database/seed.sql

# Update database config to use XAMPP socket
# Edit backend-php/config/db.php and change:
# private $host = "localhost:/opt/lampp/var/mysql/mysql.sock";
```

## Option 2: Use phpMyAdmin

1. Start XAMPP control panel: `sudo /opt/lampp/manager-linux-x64.run`
2. Navigate to http://localhost/phpmyadmin
3. Click "Import"
4. Upload `database/schema.sql`
5. Select `sayansi_yathu` database
6. Import `database/seed.sql`

## Option 3: Fix System MariaDB

The database directory exists but service won't start. Try:

```bash
# Check for existing processes
sudo pkill -9 mysqld
sudo pkill -9 mariadbd

# Fix permissions
sudo chown -R mysql:mysql /var/lib/mysql
sudo chmod -R 755 /var/lib/mysql

# Try starting again
sudo systemctl start mariadb
```

## Option 4: Manual SQL (if MariaDB runs)

```bash
# If you can get MariaDB running temporarily
sudo mariadb

# Then in MySQL prompt:
USE sayansi_yathu;
SOURCE /full/path/to/database/schema.sql;
SOURCE /full/path/to/database/seed.sql;
```

## Verify Database

After any method:

```bash
php check_experiments.php
# Should show: Experiment Count: 6
```

## Test Login

- URL: http://localhost:3000
- Email: `MpunduM@sayansi-yathu.com`
- Password: `password`
