# Sayansi Yathu - Virtual Science Lab for Zambian Education

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Overview

**Sayansi Yathu** (meaning "Our Science" in Chichewa/Chinyanja) is a comprehensive virtual science laboratory platform designed specifically for Zambian secondary schools. It provides interactive 3D and 2D simulations for physics, chemistry, and biology experiments, with AI-powered tutoring and offline capabilities.

### Key Features

- 🧪 **Interactive 3D Experiments** - High-quality simulations using Ursina Engine and Three.js
- 🤖 **AI-Powered Tutoring** - Intelligent assistance for students struggling with concepts
- 📱 **Progressive Web App (PWA)** - Works offline with service workers
- 🎯 **Curriculum Aligned** - Matches Zambian Form 1-4 science syllabus
- 📊 **Real-time Progress Tracking** - Monitor student performance and completion
- 🔊 **Voice Assistant** - Audio support for accessibility
- 🎓 **Multi-Role Support** - Student, Teacher, HOD, and Admin dashboards
- 🔒 **Secure Authentication** - JWT tokens, account lockout, device fingerprinting

---

## 🏗️ System Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  HTML5 + CSS3 + JavaScript (Three.js, p5.js, Ursina)      │
│  Progressive Web App (Service Workers for Offline)         │
└────────────────┬────────────────────────────────────────────┘
                 │
      ┌──────────┴───────────┐
      │                      │
┌─────▼─────────┐  ┌────────▼──────────┐
│  Backend-PHP  │  │  Backend-Python   │
│  Port 8000    │  │  Port 5000        │
│               │  │                   │
│ • Auth/Login  │  │ • AI Tutoring     │
│ • User API    │  │ • Simulations     │
│ • Progress    │  │ • Physics Engine  │
│ • Experiments │  │ • Chemistry       │
│               │  │ • Biology         │
│               │  │ • Ursina 3D       │
└───────┬───────┘  └───────────────────┘
        │
┌───────▼────────┐
│   MySQL DB     │
│ sayansi_yathu  │
└────────────────┘
```

### Technology Stack

**Frontend:**

- HTML5, CSS3, JavaScript ES6+
- Three.js (3D Physics/Biology simulations)
- p5.js (2D Chemistry reactions)
- Service Workers (PWA/Offline mode)

**Backend - PHP (Port 8000):**

- PHP 7.4+ with MySQL PDO
- RESTful API for authentication and data
- JWT token management
- Session handling with device fingerprinting

**Backend - Python (Port 5000):**

- Flask web framework
- NumPy (physics calculations)
- Ursina Engine (new 3D lab simulations)
- AI modules (tutoring, adaptive learning)

**Database:**

- MySQL 5.7+
- 7 core tables: users, students, teachers, experiments, progress, ai_interactions, security_logs

---

## 📦 Installation & Setup

### Prerequisites

- **PHP** 7.4+ with `pdo_mysql` extension
- **Python** 3.8+ (3.13 recommended)
- **MySQL** 5.7+
- **Modern Browser** (Chrome, Firefox, Edge)

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sayansi-yathu.git
cd sayansi-yathu
```

#### 2. Database Setup

Create the MySQL database and import the schema:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE sayansi_yathu;
exit;
```

```bash
mysql -u root -p sayansi_yathu < database/schema.sql
mysql -u root -p sayansi_yathu < database/seed.sql
```

#### 3. Configure Database Connection

Edit `backend-php/config/db.php`:

```php
<?php
class Database {
    private $host = "localhost";
    private $db_name = "sayansi_yathu";
    private $username = "root";        // Change this
    private $password = "your_password"; // Change this
    // ...
}
```

#### 4. Install Python Dependencies

```bash
cd backend-python
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install flask flask-cors pandas scikit-learn numpy ursina cadquery
cd ..
```

**For 3D Asset Generation (Optional):**

```bash
backend-python/venv/bin/python backend-python/assets/generate_tools.py
```

_Note: If CadQuery installation fails, simulations will use placeholder shapes._

#### 5. Start All Servers

Use the provided startup script:

```bash
chmod +x start_servers.sh
./start_servers.sh
```

This launches:

- **Frontend**: http://localhost:3000
- **Backend PHP**: http://localhost:8000
- **Backend Python**: http://localhost:5000

---

## 🔐 Default Login Credentials

After running the seed script, use these credentials:

| Role    | Email                        | Password   |
| ------- | ---------------------------- | ---------- |
| Student | `NatashaK@sayansi-yathu.com` | `password` |
| Teacher | `mary@sayansi-yathu.com`     | `password` |
| Admin   | `MpunduM@sayansi-yathu.com`  | `password` |

**Students can also login using their Student ID** (e.g., `SY2024PHY001`)

---

## 🧪 Available Experiments

### Physics

- Simple Pendulum (3D Ursina)
- Ohm's Law Circuit (Three.js)
- Optics & Lenses

### Chemistry

- Acid-Base Titration (p5.js)
- Chemical Reactions (p5.js)
- Reactivity Series

### Biology

- Cell Structure (Three.js)
- DNA Replication (Three.js)

---

## 🎨 Features Breakdown

### For Students

- **Simulation Player**: Step-by-step guided experiments
- **Progress Tracking**: See completed experiments and scores
- **AI Tutor**: Ask questions and get contextual help
- **Gamification**: Earn badges and achievements
- **Offline Mode**: Continue learning without internet

### For Teachers

- **Class Management**: View student progress
- **Analytics Dashboard**: Track class performance
- **Experiment Assignment**: Assign specific labs
- **Export Reports**: Generate CSV/PDF reports

### For Admins

- **User Management**: CRUD operations for all roles
- **System Monitoring**: Health checks and logs
- **School Configuration**: Multi-school support

---

## 🚀 Usage Guide

### Running Experiments

1. **Login** at http://localhost:3000
2. **Navigate to Dashboard**
3. **Select Subject** (Physics/Chemistry/Biology)
4. **Choose Experiment**
5. **Follow Step-by-Step Instructions**
6. **Interact with 3D/2D Simulation**
7. **Complete Quiz** (if applicable)

### Launching 3D Simulations (New!)

For experiments marked with `visual: pendulum` or `visual: chemistry_mix`:

1. Click **"Launch 3D View"** button
2. A separate Ursina window will open
3. Use mouse to rotate camera (drag)
4. Use arrow keys to move
5. Press ESC to close simulation

---

## 📁 Project Structure

```
sayansi-yathu/
├── backend-php/              # PHP authentication & API
│   ├── auth/                 # Login, register, logout
│   ├── api/                  # REST endpoints
│   │   ├── progress/         # Save/get user progress
│   │   ├── simulations/      # Experiment data
│   │   └── users/            # User management
│   ├── config/               # Database connection
│   └── utils/                # Helper functions (JWT, etc)
│
├── backend-python/           # Python AI & simulations
│   ├── app.py                # Flask main server
│   ├── simulations/          # Physics/Chemistry/Biology engines
│   ├── ai/                   # AI tutoring modules
│   ├── ursa_lab/             # NEW: Ursina 3D engine
│   │   ├── main.py           # 3D app entry point
│   │   ├── lab_scene.py      # Virtual lab room
│   │   └── simulation.py     # Physics logic (NumPy)
│   └── assets/               # 3D models (CadQuery)
│
├── frontend/                 # HTML/CSS/JS PWA
│   ├── index.html            # Landing page
│   ├── login.html            # Authentication
│   ├── dashboard.html        # Main dashboard
│   ├── simulation-player.html# Experiment runner
│   ├── js/                   # JavaScript modules
│   │   ├── auth.js           # Login handler
│   │   ├── simulation-player.js # Experiment orchestrator
│   │   ├── physics-simulations.js
│   │   ├── chemistry-simulations.js
│   │   └── biology-simulations.js
│   ├── css/                  # Stylesheets
│   └── sw.js                 # Service Worker (offline)
│
├── database/
│   ├── schema.sql            # Database structure
│   └── seed.sql              # Sample data
│
└── start_servers.sh          # Launch script
```

---

## 🔧 API Reference

### Backend-PHP Endpoints (Port 8000)

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| POST   | `/auth/login.php`             | User login             |
| POST   | `/auth/register.php`          | User registration      |
| GET    | `/api/simulations/get.php?id` | Get experiment details |
| POST   | `/api/progress/save.php`      | Save user progress     |
| GET    | `/api/progress/get.php`       | Retrieve progress      |
| GET    | `/api/users/list.php`         | List users (auth)      |

### Backend-Python Endpoints (Port 5000)

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| POST   | `/api/physics/simulate`   | Run physics calculation  |
| POST   | `/api/chemistry/simulate` | Run chemistry simulation |
| POST   | `/api/ai/tutor`           | Ask AI tutor a question  |
| POST   | `/api/launch-simulation`  | Launch Ursina 3D window  |
| GET    | `/api/health`             | Health check             |

---

## 🧑‍💻 Development

### Adding New Experiments

1. **Database**: Insert into `experiments` table
2. **Simulation Logic**: Add to `backend-python/simulations/<subject>_engine.py`
3. **Frontend Handler**: Create simulation class in `frontend/js/<subject>-simulations.js`
4. **Player Integration**: Register in `simulation-player.js` `renderWorkspace()`

### Running in Development Mode

```bash
# Terminal 1: PHP Backend
php -S localhost:8000 -t backend-php

# Terminal 2: Python Backend
backend-python/venv/bin/python backend-python/app.py

# Terminal 3: Frontend
python3 -m http.server 3000 -d frontend
```

---

## 🐛 Troubleshooting

### Issue: "Cannot login"

- Check MySQL is running: `sudo systemctl status mysql`
- Verify database exists: `SHOW DATABASES;`
- Check `backend-php/config/db.php` credentials

### Issue: "3D simulation doesn't launch"

- Ensure Ursina is installed: `backend-python/venv/bin/pip list | grep ursina`
- Check Python backend logs: `tail -f backend-python.log`

### Issue: "PWA doesn't work offline"

- Clear browser cache and re-register service worker
- Check `frontend/sw.js` is being served

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please see `CONTRIBUTING.md` for guidelines.

### Development Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time collaboration (WebRTC)
- [ ] AR experiments (WebXR)
- [ ] Voice-controlled navigation
- [ ] Multilingual support (Bemba, Tonga, Nyanja)

---

## 📞 Support

For issues or questions:

- **Email**: mpundumaloba23@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/maloba12/sayansi-yathu/issues)

---

## 🙏 Acknowledgements

- Zambian Ministry of Education for curriculum alignment
- Open-source contributors (Three.js, Flask, Ursina)
- Schools piloting the platform

---

**Built with ❤️ for Zambian students**
