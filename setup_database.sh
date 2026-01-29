#!/bin/bash

echo "🔧 Setting up Sayansi Yathu Database..."

# Check if MySQL is running
if ! systemctl is-active --quiet mysql && ! systemctl is-active --quiet mariadb; then
    echo "⚠️  MySQL is not running. Starting MySQL..."
    sudo systemctl start mysql
    sleep 2
fi

# Import schema
echo "📊 Creating database and tables..."
mysql -u root -p < database/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema imported successfully"
else
    echo "❌ Schema import failed. Check MySQL credentials."
    exit 1
fi

# Import seed data
echo "🌱 Seeding database with sample data..."
mysql -u root -p sayansi_yathu < database/seed.sql

if [ $? -eq 0 ]; then
    echo "✅ Seed data imported successfully"
else
    echo "❌ Seed import failed"
    exit 1
fi

# Verify
echo ""
echo "🔍 Verifying database setup..."
php check_experiments.php

echo ""
echo "✅ Database setup complete!"
echo ""
echo "You can now login with:"
echo "  Email: MpunduM@sayansi-yathu.com"
echo "  Password: password"
