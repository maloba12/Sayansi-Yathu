#!/bin/bash

# Function to kill process on a port
kill_port() {
    local port=$1
    local pid=$(lsof -t -i:$port)
    if [ ! -z "$pid" ]; then
        echo "Cleaning up port $port (PID $pid)..."
        kill -9 $pid
    fi
}

# Cleanup existing processes
kill_port 8000
kill_port 5000
kill_port 3000
kill_port 3001

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

# Start Frontend + React Server (Vite handles everything)
echo "Starting Vite Frontend Server on port 3000..."
cd frontend && npx vite --port 3000 --host > ../vite-frontend.log 2>&1 &
VITE_PID=$!
cd ..
echo "Vite Frontend Server started with PID $VITE_PID"

echo "All servers started!"
echo "Main App: http://localhost:3000"
echo "Dashboard: http://localhost:3000/dashboard.html"
echo "Backend PHP: http://localhost:8000"
echo "Backend Python: http://localhost:5000"

# Wait for user input to stop
read -p "Press Enter to stop all servers..."

kill $PHP_PID
kill $PYTHON_PID
kill $VITE_PID
echo "Servers stopped."
