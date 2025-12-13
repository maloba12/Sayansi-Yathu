#!/bin/bash
echo "Setting up 'sayansi_admin' database user..."
sudo mysql < backend-php/setup_db_user.sql
echo "Done! You can now run the migration."
