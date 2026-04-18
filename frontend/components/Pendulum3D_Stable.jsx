import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

// Physics constants
const GRAVITY = 9.81;
const DAMPING = 0.995;

function PendulumSimulation({ length, initialAngle, isRunning }) {
  const groupRef = useRef();
  
  const [angle, setAngle] = useState(initialAngle);
  const [angularVelocity, setAngularVelocity] = useState(0);

  // Sync internal state with external control changes
  useEffect(() => {
    setAngle(initialAngle);
    setAngularVelocity(0);
  }, [initialAngle, length]);

  // Keep visual position updated even when paused
  useEffect(() => {
    if (!isRunning && groupRef.current) {
      groupRef.current.rotation.z = angle;
    }
  }, [angle, isRunning]);

  // Physics calculation
  useFrame((state, delta) => {
    if (!isRunning || !groupRef.current) return;
    
    // Calculate angular acceleration: α = -(g/L) × sin(θ)
    const angularAcceleration = -(GRAVITY / length) * Math.sin(angle);
    
    // Update velocity and position with Euler integration
    const newVelocity = (angularVelocity + angularAcceleration * delta) * DAMPING;
    const newAngle = angle + newVelocity * delta;
    
    setAngularVelocity(newVelocity);
    setAngle(newAngle);
    
    // Update rod and bob positions
    groupRef.current.rotation.z = newAngle;
  });

  return (
    <group ref={groupRef}>
      {/* Support frame */}
      <Box position={[0, 0.5, 0]} args={[4, 0.2, 0.2]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box position={[0, 0.5, 0]} args={[0.2, 1, 0.2]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Pivot point */}
      <Sphere position={[0, 0, 0]} args={[0.1]}>
        <meshStandardMaterial color="#333333" />
      </Sphere>
      
      {/* Pendulum rod */}
      <Cylinder
        args={[0.02, 0.02, length]}
        position={[0, -length/2, 0]}
        rotation={[Math.PI/2, 0, 0]}
      >
        <meshStandardMaterial color="#333333" />
      </Cylinder>
      
      {/* Pendulum bob */}
      <Sphere
        args={[0.2]}
        position={[0, -length, 0]}
      >
        <meshStandardMaterial color="#FF0000" />
      </Sphere>
    </group>
  );
}

export default function Pendulum3D() {
  const [length, setLength] = useState(3.0);
  const [initialAngle, setInitialAngle] = useState(Math.PI / 4);
  const [isRunning, setIsRunning] = useState(false);

  const period = 2 * Math.PI * Math.sqrt(length / GRAVITY);

  const controls = (
    <>
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
        <button
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
        </button>
        
        <button
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
        </button>
      </div>
    </>
  );

  const theory = {
    formula: "T = 2π√(L/g)",
    values: [
      { label: "Current Period", value: `${period.toFixed(2)} seconds` },
      { label: "Frequency", value: `${(1/period).toFixed(2)} Hz` },
      { label: "Input Params", value: `L = ${length.toFixed(1)}m, g = ${GRAVITY} m/s²` }
    ]
  };

  return (
    <ExperimentShell title="Pendulum" subject="physics" controls={controls} theory={theory}>
      <Canvas
        camera={{ position: [0, 2, -8], fov: 60 }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} castShadow />
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
    </ExperimentShell>
  );
}
