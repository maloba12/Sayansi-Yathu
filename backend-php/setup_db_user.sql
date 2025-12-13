-- Create a specific user for the application to avoid root auth_socket issues
CREATE USER IF NOT EXISTS 'sayansi_admin'@'localhost' IDENTIFIED BY 'password';

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS sayansi_yathu;

-- Grant privileges
GRANT ALL PRIVILEGES ON sayansi_yathu.* TO 'sayansi_admin'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

SELECT "User 'sayansi_admin' created successfully." as Status;
