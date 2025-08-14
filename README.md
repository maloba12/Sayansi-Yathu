# Sayansi Yathu - Virtual Science Lab for Zambian Education

## Overview
Sayansi Yathu is a comprehensive virtual science laboratory designed specifically for Zambian secondary schools. It provides interactive 3D and 2D simulations for physics, chemistry, and biology experiments, with AI-powered tutoring and offline capabilities.

## Features
- 🧪 Interactive 3D science experiments
- 🤖 AI-powered tutoring system
- 📱 Progressive Web App (PWA) for offline use
- 🎯 Zambian curriculum aligned
- 📊 Real-time progress tracking
- 🔊 Voice assistant support

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript, Three.js, p5.js
- **Backend**: PHP (authentication & API), Python Flask (simulations & AI)
- **Database**: MySQL
- **PWA**: Service workers for offline functionality

## Installation

### Prerequisites
- PHP 7.4+ with MySQL extension
- Python 3.8+ with Flask
- MySQL 5.7+
- Web server (Apache/Nginx)

### Setup Steps
1. Clone the repository
2. Set up MySQL database using `database/schema.sql`
3. Configure database connection in `backend-php/config/db.php`
4. Install Python dependencies: `pip install flask flask-cors openai`
5. Start PHP server: `php -S localhost:8080 -t backend-php`
6. Start Python server: `python backend-python/app.py`
7. Open `frontend/index.html` in browser

## Usage
1. Register as a student, teacher, or admin
2. Select subject and experiment
3. Follow interactive tutorials
4. Track progress and achievements

## Contributing
We welcome contributions! Please see CONTRIBUTING.md for guidelines.