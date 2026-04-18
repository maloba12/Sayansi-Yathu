# ⚛️ Sayansi Yathu — React Developer Guide

> **Version:** 1.0 | **Last Updated:** April 2026
> **Stack:** React 18 · Vite · TailwindCSS 3 · React Three Fiber · Framer Motion · Axios

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Getting Started](#2-getting-started)
3. [Project Structure](#3-project-structure)
4. [Design System & Styling](#4-design-system--styling)
5. [Zone 1 — Dashboard App (src/)](#5-zone-1--dashboard-app-src)
   - 5.1 Entry Point `main.jsx`
   - 5.2 App Router `App.jsx`
   - 5.3 Layout Components
   - 5.4 Page Components (Admin, Teacher, Student)
   - 5.5 `AITutorPanel.jsx`
6. [Zone 2 — 3D Simulation Components (components/)](#6-zone-2--3d-simulation-components-components)
   - 6.1 How They Are Rendered
   - 6.2 Technology Used
   - 6.3 Full Simulation Registry
   - 6.4 `ExperimentShell.jsx`
7. [API Integration & Data Flow](#7-api-integration--data-flow)
8. [Key Libraries Reference](#8-key-libraries-reference)
9. [How to Add New Features](#9-how-to-add-new-features)
10. [Known Gaps & TODOs](#10-known-gaps--todos)
11. [Developer Checklist](#11-developer-checklist)
12. [Environment URLs](#12-environment-urls)

---

## 1. Architecture Overview

The React layer of Sayansi Yathu has **two distinct zones** that share the same `package.json` and Vite config but serve completely different purposes.

```
frontend/
├── src/           ← ZONE 1: Role-based Dashboard SPA
└── components/    ← ZONE 2: 3D Simulation Components (41 files)
```

### How the Two Zones Connect

Everything goes through a **single entry point** — `src/main.jsx`. It reads the URL query string to decide what to render:

```
http://localhost:3000/                 → renders <App> (Dashboard SPA)
http://localhost:3000/?type=pendulum   → renders <Pendulum3D_Stable>
http://localhost:3000/?type=circuit    → renders <Circuit3D>
```

### System-Wide Data Flow

```
                    Browser (Port 3000 — Vite Dev Server)
                                   │
                           ┌──── main.jsx ────┐
                           │                  │
                 ?type=X in URL         No ?type param
                           │                  │
               3D Simulation Component    <App> Dashboard
               (from /components/)       (HashRouter)
               @react-three/fiber          │
                                  ┌────────┴────────┐
                                  ▼                 ▼
                           PHP Backend        Python AI Backend
                           Port 8000          Port 5000
                       (Auth, DB, Expts)   (AI Tutor, Content Gen)
                                  │
                             MySQL DB
                          sayansi_yathu
```

---

## 2. Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- All three servers running (PHP :8000, Python :5000, Vite :3000)

### Install Dependencies

```bash
cd frontend
npm install
```

### Start All Servers (Recommended)

```bash
# From the project root:
./start_servers.sh
```

### Start Only the Frontend

```bash
cd frontend
npx vite --port 3000 --host
```

> **Note:** `vite.config.js` defines `port: 3001` as the default. The `start_servers.sh`
> always overrides this to port `3000` with `--port 3000`. Use the shell script to
> ensure consistency.

### Access Points

| URL | What You See |
|-----|--------------|
| `http://localhost:3000/` | Auto-redirects to role dashboard (reads `localStorage`) |
| `http://localhost:3000/#/admin` | Admin Dashboard |
| `http://localhost:3000/#/teacher` | Teacher Dashboard |
| `http://localhost:3000/#/student` | Student Dashboard |
| `http://localhost:3000/#/teacher/generator` | AI Content Generator |
| `http://localhost:3000/#/student/library` | Virtual Lab Library |
| `http://localhost:3000/?type=pendulum` | 3D Pendulum Simulation |
| `http://localhost:3000/?type=circuit` | 3D Circuit Simulation |

### Build for Production

```bash
cd frontend
npm run build
# Output goes to: frontend/dist/
```

---

## 3. Project Structure

```
frontend/
├── vite.config.js                  ← Vite build config (port, plugins)
├── tailwind.config.js              ← Custom design tokens
├── postcss.config.js               ← PostCSS pipeline
├── package.json                    ← All dependencies
├── index_3d.html                   ← HTML shell for 3D simulation mode
│
├── src/                            ← ZONE 1: Dashboard App
│   ├── main.jsx                    ← Entry point + 3D dispatcher
│   ├── App.jsx                     ← HashRouter route tree
│   ├── index.css                   ← Tailwind directives + custom classes
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx         ← Role-aware navigation sidebar
│   │   │   ├── TopNav.jsx          ← Top bar
│   │   │   └── AdminLayout.jsx     ← Admin page wrapper
│   │   └── common/
│   │       └── AITutorPanel.jsx    ← AI Chat panel (wired to Python :5000)
│   │
│   └── pages/
│       ├── admin/
│       │   ├── DashboardHome.jsx   ← Activity chart + system health
│       │   ├── UserManagement.jsx  ← User table with search
│       │   └── SecurityLogs.jsx    ← Security audit log
│       ├── teacher/
│       │   ├── TeacherDashboard.jsx    ← Class chart + AI insights
│       │   └── ContentGenerator.jsx    ← AI content generator ✅ LIVE
│       └── student/
│           ├── StudentDashboard.jsx    ← Student home + recommended labs
│           └── LabLibrary.jsx          ← Experiment browser ✅ LIVE
│
└── components/                     ← ZONE 2: 3D Simulation Components
    ├── ExperimentShell.jsx         ← Shared experiment wrapper
    ├── Pendulum3D_Stable.jsx       ← Physics: Simple Pendulum
    ├── Circuit3D.jsx               ← Physics: Ohm's Law
    ├── FreeFall3D.jsx              ← Physics: Free Fall
    ├── Cell3D.jsx                  ← Biology: Cell Structure
    ├── DNA3D.jsx                   ← Biology: DNA Helix
    └── ... (41 components total)
```

---

## 4. Design System & Styling

All styling is written using **Tailwind CSS v3** with a custom theme defined in `tailwind.config.js`.

### Custom Color Tokens

Always use these tokens. Never use raw hex values in JSX.

| Token | Hex | Purpose |
|-------|-----|---------|
| `primary-dark` | `#172554` | Dark brand backgrounds |
| `primary-blue` | `#1e3a8a` | Dark brand text, headers |
| `primary-vibrant` | `#2563eb` | ⭐ Primary CTA buttons, active states |
| `primary-light` | `#3b82f6` | Hover states, focus rings |
| `accent-emerald` | `#10b981` | Success, Biology theme |
| `accent-cyan` | `#06b6d4` | Info badges |
| `accent-amber` | `#f59e0b` | Warnings, AI alert panels |

```jsx
// ✅ Correct:
<button className="bg-primary-vibrant hover:bg-primary-blue text-white rounded-lg px-4 py-2">
  Launch
</button>

// ❌ Avoid:
<button style={{ backgroundColor: '#2563eb' }}>Launch</button>
```

### Custom Shadow Tokens

| Token | Purpose |
|-------|---------|
| `shadow-premium` | Standard cards and panels |
| `shadow-vibrant` | Primary action elements |

### Pre-built Component Classes

Defined in `src/index.css` — use these for consistent styling:

```jsx
// Primary action button
<button className="btn-premium">Generate Content</button>

// Styled card container
<div className="card-premium">Card body here</div>

// Glassmorphism overlay panel
<div className="glass-morphism p-6">Overlay content</div>
```

### Typography

The project uses **Inter** (via Google Fonts). It's pre-configured in Tailwind:

```js
// tailwind.config.js
fontFamily: { sans: ['Inter', 'sans-serif'] }
```

No additional font imports are required — `body` gets `font-sans` by default.

---

## 5. Zone 1 — Dashboard App (src/)

### 5.1 Entry Point — `src/main.jsx`

This file serves **two purposes** depending on the URL:

#### Mode A — 3D Simulation (URL has `?type=X`)

```jsx
const simType = new URLSearchParams(window.location.search).get('type');

if (simType) {
  const ExperimentComponent = EXPERIMENT_COMPONENTS[simType];
  if (!ExperimentComponent) return <FallbackMessage type={simType} />;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ExperimentComponent />
    </Suspense>
  );
}
```

All 3D components are lazy-loaded with `React.lazy()` for code splitting. A
spinner is shown while the bundle downloads.

#### Mode B — Dashboard SPA (no `?type` param)

```jsx
return <App />;  // Renders the full role-based dashboard
```

#### The Experiment Registry

```js
const EXPERIMENT_COMPONENTS = {
  pendulum:           lazy(() => import('../components/Pendulum3D_Stable.jsx')),
  free_fall:          lazy(() => import('../components/FreeFall3D.jsx')),
  circuit:            lazy(() => import('../components/Circuit3D.jsx')),
  // ... 35 more entries
};
```

> **To add a new experiment:** add its key → component mapping here.
> The key becomes the `?type=KEY` value in the URL.

---

### 5.2 App Router — `src/App.jsx`

Uses `HashRouter` so PHP doesn't need to handle React routes.
Routes are grouped by user role:

```
/#/admin                → DashboardHome
/#/admin/users          → UserManagement
/#/admin/security       → SecurityLogs

/#/teacher              → TeacherDashboard
/#/teacher/generator    → ContentGenerator   ← AI Feature (LIVE)

/#/student              → StudentDashboard
/#/student/library      → LabLibrary          ← DB Fetch (LIVE)
```

**Role detection:** `App.jsx` reads `localStorage.getItem('user_data')`, parses the
`role` field, and the root `<Route path="/">` auto-redirects to `/#/{role}`.

```js
// Written to localStorage by auth.js (vanilla JS) after login:
localStorage.setItem('user_data', JSON.stringify({
  id: 5,
  name: 'Chanda Bwalya',
  email: 'chanda@sayansi.edu',
  role: 'student'
}));
```

---

### 5.3 Layout Components

#### `Sidebar.jsx`

Role-aware navigation. Receives `role` prop and renders different links:

| Role | Links Shown |
|------|-------------|
| `admin` | Dashboard · User Management · System Reports · Settings |
| `teacher` | Dashboard · My Classes · Assignments · AI Generator |
| `student` | My Hub · Virtual Lab · My Progress |

Uses `react-router-dom`'s `NavLink` with `isActive` callback for active highlighting.
Logout clears `localStorage` and redirects browser to `login.html`.

```jsx
<Sidebar role="teacher" />
```

#### `TopNav.jsx`

Top navigation bar. Receives `role` prop for context display.

#### `AdminLayout.jsx`

Layout wrapper used by admin pages to apply consistent padding/structure.

---

### 5.4 Page Components

#### 🔴 `DashboardHome.jsx` (Admin) — Mocked

**What it shows:**
- 4 KPI stat cards (Total Users, Active Sessions, etc.)
- `recharts` `LineChart` — weekly users + experiments (hardcoded data)
- System Health panel — PHP API, Database, Python AI status

**To make it live:**
```jsx
// Replace mockChartData with a real fetch:
const [stats, setStats] = useState([]);
useEffect(() => {
  axios.get('http://localhost:8000/api/admin/stats.php').then(r => setStats(r.data));
}, []);
```

---

#### 🔴 `UserManagement.jsx` (Admin) — Mocked

**What it shows:** Searchable user table with Edit/Delete buttons.

**To make it live:**
```jsx
// Replace mockUsers constant with a state + fetch:
const [users, setUsers] = useState([]);
useEffect(() => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:8000/api/users/list.php', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => setUsers(r.data.users));
}, []);
```

---

#### 🔴 `TeacherDashboard.jsx` (Teacher) — Mocked

**What it shows:**
- `recharts` `BarChart` — class subject performance averages
- "AI Insights: Intervention Needed" panel — students struggling (hardcoded)
- Recent student activity feed (hardcoded)

**To make it live:** Connect to the Python analytics endpoint once the DB
connection is configured in `analytics/dashboard.py`.

---

#### ✅ `ContentGenerator.jsx` (Teacher) — **FULLY LIVE**

**What it does:** Calls `POST http://localhost:5000/api/ai/generate-content`
(the Python `ECZContentGenerator` using GPT-3.5-turbo) and displays the result.

**Form fields:**
- Subject Area: Physics / Chemistry / Biology / Integrated Science
- Content Type: Exam Questions · Lab Worksheet · Lab Report · Explanation
- Grade Level: Grade 8 – 12
- Specific Topic / Description (free text)

**Output:** Pre-formatted text with copy-to-clipboard button.

**To reach this page:** Log in as a teacher → click **"AI Generator"** in sidebar.

**API call pattern:**
```jsx
await axios.post('http://localhost:5000/api/ai/generate-content', {
  type: contentType,           // e.g. 'exam_questions'
  topic: `${subject}: ${desc}`,// e.g. 'Physics: Pendulum'
  grade: grade                 // e.g. 'Grade 10'
});
```

---

#### 🟡 `StudentDashboard.jsx` (Student) — Partially Live

**What works:**
- Fetches real experiments from `GET http://localhost:8000/api/simulations/list.php`
  (first 4 results → "Recommended Labs")
- Reads user name from `localStorage`

**What is mocked:**
- Experiment count ("14"), streak, score — hardcoded
- "Ask AI Tutor" button card is **decorative** (no onClick handler)

---

#### ✅ `LabLibrary.jsx` (Student) — **FULLY LIVE**

**What it does:**
- Fetches all experiments from PHP API on mount
- Renders filterable card grid (All / Physics / Chemistry / Biology)
- Play button navigates to `/index_3d.html?type={simulation_type}`

```jsx
// Fetch:
axios.get('http://localhost:8000/api/simulations/list.php')

// Launch simulation:
window.location.href = `/index_3d.html?type=${lab.id}`;
```

---

### 5.5 `AITutorPanel.jsx` — Wired but NOT Mounted

**Status:** Complete. Calls the live Python AI. Uses `framer-motion` slide-in.
**Problem:** Not imported or mounted anywhere in the app.

**Features:**
- Animated slide-in from the right (`AnimatePresence` + `motion.div`)
- Full message history with user/AI bubble styling
- Auto-scrolls to the latest message
- "AI is thinking..." loading indicator
- Sends questions to `POST http://localhost:5000/api/ai/tutor`

**How to activate it** (add to `StudentDashboard.jsx`):

```jsx
import { useState } from 'react';
import AITutorPanel from '../../components/common/AITutorPanel';

export default function StudentDashboard() {
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  return (
    <div className="relative p-8">

      {/* Find the "Ask AI Tutor" button and add onClick: */}
      <button className="btn-premium" onClick={() => setIsTutorOpen(true)}>
        🧪 Ask AI Tutor
      </button>

      {/* Mount the panel: */}
      <AITutorPanel
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        context={{ subject: 'general', level: 'secondary' }}
      />
    </div>
  );
}
```

**Props accepted:**

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Whether the panel is visible |
| `onClose` | `function` | Called when user clicks ✖ |
| `context` | `object` | `{ subject, level }` — sent to the AI |

---

## 6. Zone 2 — 3D Simulation Components (components/)

### 6.1 How They Are Rendered

```
Student clicks "Play" on a lab card in LabLibrary
  ↓
window.location.href = '/index_3d.html?type=pendulum'
  ↓
index_3d.html loads (contains <div id="app">)
  ↓
src/main.jsx reads ?type=pendulum
  ↓
React.lazy() loads Pendulum3D_Stable.jsx
  ↓
<Canvas> (WebGL/Three.js) renders inside div#app
```

### 6.2 Technology Used

| Package | Purpose |
|---------|---------|
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Helper components (OrbitControls, Text, Stars, etc.) |
| `three` | Core 3D math and geometry |

**Common Three Fiber patterns used across components:**

```jsx
import { Canvas, useFrame, useRef } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';

// Standard scene:
<Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  <OrbitControls />
  <Stars />
  <mesh position={[0, 0, 0]}>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial color="#3b82f6" />
  </mesh>
</Canvas>

// Animation loop (runs every frame):
function AnimatedBall() {
  const ref = useRef();
  useFrame((state) => {
    ref.current.position.y = Math.sin(state.clock.elapsedTime) * 2;
  });
  return <mesh ref={ref}><sphereGeometry /><meshStandardMaterial color="orange" /></mesh>;
}
```

### 6.3 Full Simulation Registry

#### Physics (24 components)

| `?type=` key | File | Experiment |
|---|---|---|
| `pendulum` | `Pendulum3D_Stable.jsx` | Simple Pendulum |
| `free_fall` | `FreeFall3D.jsx` | Free Fall under gravity |
| `linear_motion` | `LinearMotion3D.jsx` | Linear motion |
| `hookes_law` | `HookesLaw3D.jsx` | Hooke's Law spring |
| `friction` | `Friction3D.jsx` | Friction forces |
| `circuit` | `Circuit3D.jsx` | Ohm's Law circuit |
| `density` | `Density3D.jsx` | Density of objects |
| `pressure` | `Pressure3D.jsx` | Pressure in fluids |
| `cog` | `CenterOfGravity3D.jsx` | Centre of gravity |
| `apparatus` | `Apparatus3D.jsx` | Lab apparatus ID |
| `force_motion` | `ForceMotion3D.jsx` | Newton's Laws |
| `circular_motion` | `CircularMotion3D.jsx` | Circular motion |
| `moments` | `Moments3D.jsx` | Moments / torque |
| `moments_eq` | `MomentsEquilibrium3D.jsx` | Moments equilibrium |
| `equilibrium` | `Equilibrium3D.jsx` | Static equilibrium |
| `measure_length` | `MeasureLength3D.jsx` | Using a ruler |
| `measure_mass` | `MeasureMass3D.jsx` | Using a beam balance |
| `measure_volume` | `MeasureVolume3D.jsx` | Using a measuring cylinder |
| `measure_time` | `MeasureTime3D.jsx` | Using a stopwatch |
| `measure_weight` | `MeasureWeight3D.jsx` | Using a spring balance |
| `solar_system` | `SolarSystem3D.jsx` | Planets orbiting the Sun |
| `earth_structure` | `EarthStructure3D.jsx` | Layers of Earth |
| `atmosphere` | `Atmosphere3D.jsx` | Layers of atmosphere |
| `lab_safety` | `LabSafety3D.jsx` | Lab safety rules |
| `sci_method` | `ScientificMethod3D.jsx` | Scientific method steps |

#### Chemistry (13 components)

| `?type=` key | File | Experiment |
|---|---|---|
| `litmus` | `AcidsBases3D.jsx` | Acid/base litmus test |
| `combustion` | `AirCombustion3D.jsx` | Air and combustion |
| `water_purify` | `WaterPurification3D.jsx` | Water purification |
| `diffusion` | `Diffusion3D.jsx` | Particle diffusion |
| `evaporation` | `Evaporation3D.jsx` | Evaporation |
| `co2_test` | `CO2Test3D.jsx` | CO₂ limewater test |
| `solvent` | `Solvent3D.jsx` | Solvents and solutes |
| `natural_indicators` | `NaturalIndicators3D.jsx` | Natural acid-base indicators |
| `chem_apparatus` | `ChemApparatus3D.jsx` | Chemistry equipment ID |
| `chem_safety` | `ChemSafety3D.jsx` | Chemical safety |
| `separation` | `Separation3D.jsx` | Separation techniques |
| `states` | `StatesOfMatter3D.jsx` | Solids, liquids, gases |

#### Biology (2 components)

| `?type=` key | File | Experiment |
|---|---|---|
| `cell` | `Cell3D.jsx` | Plant/animal cell structure |
| `dna` | `DNA3D.jsx` | DNA double helix |

### 6.4 `ExperimentShell.jsx` — The Shared Wrapper

Provides a consistent step-by-step experiment interface around any 3D scene.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Experiment name shown in header |
| `steps` | `array` | Array of `{ title, content }` objects |
| `subject` | `string` | `'physics'` `'chemistry'` `'biology'` |
| `children` | `ReactNode` | The `<Canvas>` or simulation content |

**Usage:**

```jsx
import ExperimentShell from './ExperimentShell';

const steps = [
  { title: "Setup", content: "Attach the bob to the string at the pivot." },
  { title: "Measure", content: "Measure the length L from pivot to bob centre." },
  { title: "Release", content: "Displace by 15° and release. Time 10 oscillations." },
];

export default function MyNew3D() {
  return (
    <ExperimentShell title="Simple Pendulum" steps={steps} subject="physics">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight />
        <OrbitControls />
        {/* your 3D scene */}
      </Canvas>
    </ExperimentShell>
  );
}
```

---

## 7. API Integration & Data Flow

### Endpoints Used by React

| Component | Method | Endpoint | Backend | Status |
|---|---|---|---|---|
| `LabLibrary.jsx` | GET | `/api/simulations/list.php` | PHP :8000 | ✅ Live |
| `StudentDashboard.jsx` | GET | `/api/simulations/list.php` | PHP :8000 | ✅ Live |
| `ContentGenerator.jsx` | POST | `/api/ai/generate-content` | Python :5000 | ✅ Live |
| `AITutorPanel.jsx` | POST | `/api/ai/tutor` | Python :5000 | ✅ Ready (not mounted) |
| `DashboardHome.jsx` | — | *(no call)* | — | 🔴 Mocked |
| `UserManagement.jsx` | — | *(no call)* | — | 🔴 Mocked |
| `TeacherDashboard.jsx` | — | *(no call)* | — | 🔴 Mocked |

### Standard API Call Pattern

All API calls use `axios`. Follow this pattern throughout the codebase:

```jsx
import axios from 'axios';
import { useState, useEffect } from 'react';

// --- GET on mount ---
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/endpoint.php');
      if (response.data.success) {
        setData(response.data.items);
      }
    } catch (error) {
      console.error('Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

// --- POST on user action ---
const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await axios.post('http://localhost:5000/api/ai/tutor', {
      question: userInput,
      context: { subject: 'physics', level: 'secondary' }
    });
    setResult(response.data.response);
  } catch (error) {
    setResult('Error: Could not connect to AI backend.');
  } finally {
    setLoading(false);
  }
};
```

### Authenticated Requests

The PHP backend uses JWT tokens. Include the token in the `Authorization` header:

```jsx
const token = localStorage.getItem('token');
await axios.get('http://localhost:8000/api/users/list.php', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### `localStorage` Keys Reference

| Key | Value | Written By |
|-----|-------|------------|
| `token` | JWT string | `auth.js` (vanilla JS, after login) |
| `user_data` | JSON string `{ id, name, email, role }` | `auth.js` |
| `userProgress` | JSON string (XP, badges, level) | `gamification.js` |

---

## 8. Key Libraries Reference

### `react-router-dom` v7

```jsx
import {
  HashRouter, Routes, Route, Navigate,
  NavLink, useNavigate, useParams
} from 'react-router-dom';

// Programmatic navigation:
const navigate = useNavigate();
navigate('/teacher/generator');

// Active link class:
<NavLink to="/student/library"
  className={({ isActive }) => isActive ? 'text-primary-vibrant' : 'text-gray-600'}>
  Virtual Lab
</NavLink>
```

---

### `recharts` v3

```jsx
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Always wrap in ResponsiveContainer for fluid width:
<ResponsiveContainer width="100%" height={250}>
  <LineChart data={chartData}>
    <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} />
    <XAxis dataKey="date" axisLine={false} tickLine={false} />
    <YAxis axisLine={false} tickLine={false} />
    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
    <CartesianGrid strokeDasharray="5 5" stroke="#f1f5f9" />
  </LineChart>
</ResponsiveContainer>

// Bar chart variant:
<BarChart data={data}>
  <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
</BarChart>
```

---

### `framer-motion` v10

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Conditional slide-in panel (used in AITutorPanel):
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      Panel content
    </motion.div>
  )}
</AnimatePresence>

// Simple fade-in on mount:
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
  Content
</motion.div>

// Spinner (via Tailwind + Lucide):
<Loader2 className="w-5 h-5 animate-spin" />
```

---

### `lucide-react`

The icon library used everywhere in the dashboard.

```jsx
import { BrainCircuit, FlaskConical, Users, PlayCircle, Loader2,
         LayoutDashboard, GraduationCap, LogOut, BrainCircuit } from 'lucide-react';

// Usage:
<BrainCircuit className="w-6 h-6 text-primary-vibrant" />
<Loader2 className="w-5 h-5 animate-spin text-primary-vibrant" />
```

Browse all icons at: [lucide.dev/icons](https://lucide.dev/icons/)

---

### `@react-three/fiber` + `@react-three/drei`

```jsx
import { Canvas, useFrame, useRef } from '@react-three/fiber';
import { OrbitControls, Text, Stars, Environment } from '@react-three/drei';

// Basic scene shell:
<Canvas
  camera={{ position: [0, 2, 5], fov: 60 }}
  style={{ width: '100%', height: '100vh', background: '#0f172a' }}
>
  <ambientLight intensity={0.4} />
  <pointLight position={[10, 10, 10]} intensity={1} />
  <OrbitControls enablePan={false} minDistance={2} maxDistance={20} />
  <Stars radius={100} depth={50} count={5000} />
  {/* Your 3D objects here */}
</Canvas>

// Animated object in useFrame:
function BouncingBall() {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    meshRef.current.position.y = Math.sin(clock.elapsedTime * 2) * 1.5;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
    </mesh>
  );
}
```

---

### `clsx` + `tailwind-merge`

Used in `Sidebar.jsx` to safely merge conditional Tailwind classes:

```jsx
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Safely merge classes (resolves Tailwind conflicts):
const cls = twMerge(clsx(
  'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
  isActive
    ? 'bg-primary-vibrant/10 text-primary-vibrant border-l-4 border-primary-vibrant'
    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
));
```

---

## 9. How to Add New Features

### 9.1 Add a New Dashboard Page

**Step 1: Create the page file**

```jsx
// frontend/src/pages/student/StudentProgress.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentProgress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user_data') || '{}');
    axios.get(`http://localhost:8000/api/progress/get.php?user_id=${user.id}`)
      .then(r => setProgress(r.data.progress || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading progress...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
      {/* Render progress data */}
    </div>
  );
}
```

**Step 2: Register the route in `App.jsx`**

```jsx
import StudentProgress from './pages/student/StudentProgress';

// Inside the /student/* Routes block:
<Route path="progress" element={<StudentProgress />} />
```

**Step 3: Confirm sidebar link in `Sidebar.jsx`**

The `studentLinks` array already includes `/student/progress`:
```js
{ path: '/student/progress', icon: GraduationCap, label: 'My Progress' },
```
If the route exists, the link will work automatically.

---

### 9.2 Add a New 3D Simulation Component

**Step 1: Create the component**

```jsx
// frontend/components/Thermometer3D.jsx
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import ExperimentShell from './ExperimentShell';

const steps = [
  { title: "Setup", content: "Place the thermometer in the liquid." },
  { title: "Observe", content: "Watch the liquid column rise with heat." },
  { title: "Record", content: "Read the temperature at eye level." },
];

function ThermometerModel({ temp }) {
  const fillHeight = (temp / 100) * 2.5;
  return (
    <group>
      {/* Glass bulb */}
      <mesh position={[0, -1.5, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {/* Glass tube */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 3, 16]} />
        <meshStandardMaterial color="lightblue" transparent opacity={0.5} />
      </mesh>
      {/* Liquid column */}
      <mesh position={[0, -1.5 + fillHeight / 2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, fillHeight, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <Text position={[0.4, 0.5, 0]} color="white" fontSize={0.2}>
        {temp}°C
      </Text>
    </group>
  );
}

export default function Thermometer3D() {
  const [temp, setTemp] = useState(25);

  return (
    <ExperimentShell title="Thermometer" steps={steps} subject="physics">
      <div style={{ padding: '1rem', color: 'white', fontFamily: 'Inter, sans-serif' }}>
        <label>Temperature: <strong>{temp}°C</strong></label><br />
        <input type="range" min={0} max={100} value={temp}
          onChange={(e) => setTemp(+e.target.value)}
          style={{ width: '100%', marginTop: '8px' }} />
      </div>
      <Canvas
        camera={{ position: [2, 0, 4], fov: 50 }}
        style={{ background: '#0f172a', height: '60vh' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} />
        <OrbitControls />
        <ThermometerModel temp={temp} />
      </Canvas>
    </ExperimentShell>
  );
}
```

**Step 2: Register in `src/main.jsx`**

```jsx
// At the top with other lazy imports:
const Thermometer3D = lazy(() => import('../components/Thermometer3D.jsx'));

// In the EXPERIMENT_COMPONENTS object:
thermometer: Thermometer3D,
```

**Step 3: Add to the database**

```sql
INSERT INTO experiments (title, subject, description, difficulty_level, simulation_type, grade_or_form)
VALUES (
  'Using a Thermometer',
  'physics',
  'Learn to correctly read temperature using a thermometer.',
  'beginner',
  'thermometer',  -- ← must match the key in EXPERIMENT_COMPONENTS
  'Form 1'
);
```

**Step 4: Test** → `http://localhost:3000/?type=thermometer`

---

### 9.3 Wire the AI Tutor to a Student Page

```jsx
// StudentDashboard.jsx — add these changes:
import { useState } from 'react';
import AITutorPanel from '../../components/common/AITutorPanel';

export default function StudentDashboard() {
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  return (
    <div className="relative p-8 max-w-7xl mx-auto space-y-8">

      {/* Update the existing "Ask AI Tutor" button: */}
      <button
        className="w-full py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-50"
        onClick={() => setIsTutorOpen(true)}
      >
        Ask AI Tutor
      </button>

      {/* Add at the bottom of the return: */}
      <AITutorPanel
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        context={{ subject: 'general', level: 'secondary' }}
      />
    </div>
  );
}
```

---

### 9.4 Use Environment Variables (Best Practice)

Instead of hardcoded URLs, use Vite environment variables:

```bash
# Create: frontend/.env.local  (never commit this file)
VITE_PHP_API_URL=http://localhost:8000
VITE_PYTHON_API_URL=http://localhost:5000
```

```jsx
// In any component:
const PHP_URL = import.meta.env.VITE_PHP_API_URL;
const PYTHON_URL = import.meta.env.VITE_PYTHON_API_URL;

axios.get(`${PHP_URL}/api/simulations/list.php`);
axios.post(`${PYTHON_URL}/api/ai/tutor`, payload);
```

---

## 10. Known Gaps & TODOs

### 🔴 High Priority

| Gap | File | Fix Required |
|-----|------|-------------|
| AI Tutor button does nothing | `StudentDashboard.jsx` | Add `useState(isTutorOpen)` + mount `<AITutorPanel>` |
| User table shows fake data | `UserManagement.jsx` | Fetch from `GET /api/users/list.php` |
| Admin chart uses fake numbers | `DashboardHome.jsx` | Build stats endpoint + fetch |
| Teacher AI insights are hardcoded | `TeacherDashboard.jsx` | Connect Python analytics once DB is wired |

### 🟡 Medium Priority

| Gap | File | Fix Required |
|-----|------|-------------|
| "Assign to Class" button is decorative | `ContentGenerator.jsx` | Wire to PHP assignment endpoint |
| Student stats (14 experiments, streak) hardcoded | `StudentDashboard.jsx` | Fetch from `GET /api/progress/get.php` |
| "My Progress" page doesn't exist | `Sidebar.jsx` link is dead | Create `StudentProgress.jsx` |
| "System Reports" page doesn't exist | `Sidebar.jsx` link is dead | Create `SystemReports.jsx` |
| Security logs not fetched from DB | `SecurityLogs.jsx` | Fetch from `GET /api/security-logs.php` |
| Lab cards have no thumbnails | `LabLibrary.jsx` | Generate per-subject thumbnail images |

### 🟢 Low Priority / Enhancements

| Enhancement | Notes |
|---|---|
| Loading skeletons | Add `animate-pulse` skeleton divs while data loads |
| React Error Boundary | Wrap pages to catch rendering errors gracefully |
| AI Tutor conversation memory | Pass `messages` history array to each API call |
| `localStorage` → Vite env vars | Move hardcoded URLs to `.env.local` |
| Dark mode | Tailwind `dark:` variant support |
| PWA integration | Service worker caching for React dashboard |

---

## 11. Developer Checklist

### ✅ When Adding a New Dashboard Page

- [ ] File created in `src/pages/{role}/PageName.jsx`
- [ ] Route registered in `App.jsx`
- [ ] Sidebar link exists (or added to `Sidebar.jsx`)
- [ ] API calls use `axios`, not `fetch`
- [ ] Has loading state while data fetches
- [ ] Has error handling in `try/catch`
- [ ] Uses design system tokens (`primary-vibrant`, `card-premium`, etc.)
- [ ] Single `<h1>` element on the page

### ✅ When Adding a New 3D Simulation

- [ ] File created in `frontend/components/ComponentName3D.jsx`
- [ ] Entry added to `EXPERIMENT_COMPONENTS` in `src/main.jsx`
- [ ] DB row inserted into `experiments` table with matching `simulation_type`
- [ ] Tested at `http://localhost:3000/?type=YOUR_KEY`
- [ ] Uses `<ExperimentShell>` for step-by-step UX
- [ ] Handles edge cases (division by zero, zero length, etc.)

### ✅ Before Committing Code

- [ ] No raw hex colors in JSX (use Tailwind tokens)
- [ ] No hardcoded API URLs (use env vars or constants)
- [ ] No `console.log` debug statements left in
- [ ] Component names are `PascalCase`
- [ ] All `import` statements are used
- [ ] `package.json` not modified unless adding a real dependency

---

## 12. Environment URLs

| Service | URL | Used By |
|---------|-----|---------|
| Frontend (Vite) | `http://localhost:3000` | Browser — all users |
| PHP Backend | `http://localhost:8000` | Auth · Experiments · Progress API |
| Python AI Backend | `http://localhost:5000` | AI Tutor · Content Generator · Physics Engine |
| MySQL Database | `localhost:3306` | PHP backend only (not called from React) |

### Recommended: Move to Environment Variables

```bash
# frontend/.env.local
VITE_PHP_API_URL=http://localhost:8000
VITE_PYTHON_API_URL=http://localhost:5000
```

```jsx
// Read in any component:
const response = await axios.post(
  `${import.meta.env.VITE_PYTHON_API_URL}/api/ai/tutor`,
  { question, context }
);
```

---

*⚛️ Sayansi Yathu — React Developer Guide*
*Built with ❤️ for Zambian students | Contact: mpundumaloba23@gmail.com*
