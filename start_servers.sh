#!/bin/bash

# Start Backend PHP Server
echo "Starting Backend PHP Server on port 8000..."
php -S localhost:8000 -t backend-php > backend-php.log 2>&1 &
PHP_PID=$!
echo "Backend PHP Server started with PID $PHP_PID"

# Start Backend Python Server
echo "Starting Backend Python Server on port 5000..."
backend-python/venv/bin/python backend-python/app.py > backend-python.log 2>&1 &
PYTHON_PID=$!
echo "Backend Python Server started with PID $PYTHON_PID"

# Start Frontend Server
echo "Starting Frontend Server on port 3000..."
python3 -m http.server 3000 -d frontend > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend Server started with PID $FRONTEND_PID"

echo "All servers started!"
echo "Frontend: http://localhost:3000"
echo "Backend PHP: http://localhost:8000"
echo "Backend Python: http://localhost:5000"

# Wait for user input to stop
read -p "Press Enter to stop all servers..."

kill $PHP_PID
kill $PYTHON_PID
kill $FRONTEND_PID
echo "Servers stopped."
