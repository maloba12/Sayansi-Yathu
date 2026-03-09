# Sayansi Yathu - React 3D Pendulum Simulation

This is a modern React-based 3D pendulum simulation using Three.js and React Three Fiber.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```
The simulation will be available at http://localhost:3000

### Build for Production
```bash
npm run build
```

## 🧪 Features

### 3D Visualization
- **React Three Fiber**: Modern React renderer for Three.js
- **OrbitControls**: Interactive camera movement
- **Studio Lighting**: Professional lighting setup
- **Responsive Design**: Works on all screen sizes

### Physics Simulation
- **Realistic Physics**: Uses actual pendulum equation α = -(g/L) × sin(θ)
- **Euler Integration**: Accurate motion calculation
- **Damping**: Air resistance simulation
- **Live Calculations**: Period T = 2π√(L/g) computed in real-time

### Interactive Controls
- **String Length**: Adjustable from 1-5 meters
- **Initial Angle**: 0-90 degrees
- **Play/Pause**: Control simulation
- **Reset**: Return to initial state

### Educational Features
- **Theory Panel**: Shows physics formulas
- **Live Period**: Updates as parameters change
- **Frequency Display**: Shows oscillation frequency
- **Visual Learning**: 3D representation helps understanding

## 🎮 Controls

### Camera Controls
- **Mouse Drag**: Rotate view around pendulum
- **Scroll Wheel**: Zoom in/out
- **Right Click + Drag**: Pan camera

### Simulation Controls
- **Length Slider**: Adjust pendulum string length
- **Angle Slider**: Set initial release angle
- **Start/Pause**: Control animation
- **Reset**: Return to defaults

## 📐 Physics Implementation

### Pendulum Equation
The simulation uses the differential equation for simple pendulum motion:

```
α = -(g/L) × sin(θ)

Where:
α = angular acceleration
g = gravitational acceleration (9.81 m/s²)
L = pendulum length
θ = angle from vertical
```

### Numerical Integration
```javascript
// Euler integration with damping
angularVelocity += angularAcceleration * deltaTime;
angularVelocity *= damping; // Air resistance
angle += angularVelocity * deltaTime;
```

### Period Calculation
```javascript
period = 2 * Math.PI * Math.sqrt(length / gravity);
```

## 🎨 Visual Components

### 3D Objects
- **Support Frame**: Wooden structure
- **Pivot Point**: Rotation axis
- **Pendulum Rod**: Cylindrical string
- **Bob**: Spherical mass

### Materials & Lighting
- **Studio Environment**: Professional lighting
- **Shadows**: Realistic depth perception
- **Colors**: Educational contrast (red bob, brown support)

## 🔧 Technical Stack

### Core Libraries
- **React 18**: UI framework
- **Three.js**: 3D graphics engine
- **React Three Fiber**: React renderer
- **React Three Drei**: Helper components
- **Framer Motion**: UI animations

### Development Tools
- **Vite**: Fast development server
- **Modern JavaScript**: ES6+ features
- **Responsive Design**: Mobile-friendly

## 🚀 Next Steps

After testing this pendulum simulation, we can:

1. **Add More Experiments**: Chemistry, Biology, Physics
2. **Enhanced Physics**: More complex interactions
3. **Student Tracking**: Progress monitoring
4. **Multi-language**: Support for Zambian languages
5. **Offline Mode**: PWA capabilities

## 🎯 Integration

This React 3D approach replaces the Python/Ursina system with:
- ✅ **Better Web Integration**: No separate windows
- ✅ **Mobile Support**: Works on all devices  
- ✅ **Easier Deployment**: Single web application
- ✅ **Modern UI**: Smooth animations and interactions
- ✅ **Better Performance**: Optimized rendering

The simulation maintains the same physics accuracy while providing a much better user experience!
