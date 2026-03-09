import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Box, Sphere, Cylinder } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Physics constants
const GRAVITY = 9.81;
const DAMPING = 0.995; // Air resistance

function PendulumSimulation({ length, initialAngle, isRunning }) {
  const pendulumRef = useRef();
  const bobRef = useRef();
  const rodRef = useRef();
  
  const [angle, setAngle] = useState(initialAngle);
  const [angularVelocity, setAngularVelocity] = useState(0);
  const [period, setPeriod] = useState(0);

  // Physics calculation
  useFrame((state, delta) => {
    if (!isRunning) return;
    
    // Calculate angular acceleration: α = -(g/L) × sin(θ)
    const angularAcceleration = -(GRAVITY / length) * Math.sin(angle);
    
    // Update velocity and position with Euler integration
    const newVelocity = (angularVelocity + angularAcceleration * delta) * DAMPING;
    const newAngle = angle + newVelocity * delta;
    
    setAngularVelocity(newVelocity);
    setAngle(newAngle);
    
    // Update visual positions
    if (rodRef.current && bobRef.current) {
      // Calculate bob position from angle
      const x = length * Math.sin(newAngle);
      const y = -length * Math.cos(newAngle);
      
      // Update rod (cylinder from pivot to bob)
      rodRef.current.position.set(0, 0, 0);
      rodRef.current.rotation.z = newAngle;
      
      // Update bob position
      bobRef.current.position.set(x, y, 0);
    }
  });

  // Calculate period T = 2π√(L/g)
  useEffect(() => {
    const calculatedPeriod = 2 * Math.PI * Math.sqrt(length / GRAVITY);
    setPeriod(calculatedPeriod);
  }, [length]);

  return (
    <group ref={pendulumRef}>
      {/* Support frame */}
      <Box position={[0, 0.5, 0]} args={[4, 0.2, 0.2]} material-color="#8B4513" />
      <Box position={[0, 0.5, 0]} args={[0.2, 1, 0.2]} material-color="#8B4513" />
      
      {/* Pivot point */}
      <Sphere position={[0, 0, 0]} args={[0.1]} material-color="#333333" />
      
      {/* Pendulum rod */}
      <Cylinder
        ref={rodRef}
        args={[0.02, 0.02, length]}
        position={[0, -length/2, 0]}
        rotation={[0, 0, 0]}
        material-color="#333333"
      />
      
      {/* Pendulum bob */}
      <Sphere
        ref={bobRef}
        args={[0.2]}
        position={[0, -length, 0]}
        material-color="#FF0000"
      />
    </group>
  );
}

export default function PendulumExperiment() {
  const [length, setLength] = useState(3.0); // meters
  const [initialAngle, setInitialAngle] = useState(Math.PI / 4); // 45 degrees
  const [isRunning, setIsRunning] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const period = 2 * Math.PI * Math.sqrt(length / GRAVITY);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2, -8], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)' }}
      >
        {/* Lighting */}
        <Environment preset="studio" />
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
        />
        
        {/* Pendulum simulation */}
        <PendulumSimulation
          length={length}
          initialAngle={initialAngle}
          isRunning={isRunning}
        />
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#90EE90" />
        </mesh>
      </Canvas>

      {/* Controls Panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              left: 20,
              top: 20,
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              width: '300px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>🧪 Pendulum Controls</h3>
            
            {/* Length Control */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                String Length: {length.toFixed(1)}m
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Initial Angle Control */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Initial Angle: {(initialAngle * 180 / Math.PI).toFixed(0)}°
              </label>
              <input
                type="range"
                min="0"
                max={Math.PI / 2}
                step="0.05"
                value={initialAngle}
                onChange={(e) => setInitialAngle(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Control Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRunning(!isRunning)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: isRunning ? '#FF4444' : '#44FF44',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {isRunning ? '⏸️ Pause' : '▶️ Start'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsRunning(false);
                  setInitialAngle(Math.PI / 4);
                }}
                style={{
                  padding: '10px',
                  background: '#FFA500',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🔄 Reset
              </motion.button>
            </div>

            {/* Theory Panel */}
            <div style={{
              background: 'rgba(240, 248, 255, 0.8)',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #B0D4E3'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2C5282' }}>📐 Physics Theory</h4>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Period Formula:</strong> T = 2π√(L/g)
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Current Period:</strong> {period.toFixed(2)} seconds
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Frequency:</strong> {(1/period).toFixed(2)} Hz
              </p>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                Where: L = {length.toFixed(1)}m, g = {GRAVITY} m/s²
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Controls Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setShowControls(!showControls)}
        style={{
          position: 'absolute',
          left: 20,
          top: showControls ? 340 : 20,
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          fontSize: '20px'
        }}
      >
        {showControls ? '◀' : '▶'}
      </motion.button>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        right: 20,
        top: 20,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '15px',
        borderRadius: '8px',
        maxWidth: '250px'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>🎮 Controls</h4>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          🖱️ <strong>Mouse:</strong> Rotate view
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          🔄 <strong>Scroll:</strong> Zoom in/out
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          ✋ <strong>Drag:</strong> Pan camera
        </p>
      </div>
    </div>
  );
}
