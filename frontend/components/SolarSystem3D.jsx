import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Text, Line, Trail, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

function MoonOrbit({ earthPos, orbitSpeed, isRunning, showShadows }) {
  const moonRef = useRef();
  const [angle, setAngle] = useState(0);

  useFrame((state, delta) => {
    if (isRunning) {
      setAngle(prev => prev + delta * orbitSpeed);
    }
  });

  const moonX = earthPos[0] + Math.cos(angle) * 2;
  const moonZ = earthPos[2] + Math.sin(angle) * 2;
  const moonPos = [moonX, earthPos[1], moonZ];

  return (
    <group>
      {/* Moon Orbit Path */}
      <Line
        points={[...Array(65)].map((_, i) => [
          earthPos[0] + Math.cos((i / 64) * Math.PI * 2) * 2,
          earthPos[1],
          earthPos[2] + Math.sin((i / 64) * Math.PI * 2) * 2
        ])}
        color="#475569"
        lineWidth={0.5}
        transparent
        opacity={0.3}
      />

      <Sphere ref={moonRef} position={moonPos} args={[0.2, 32, 32]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Sphere>

      {/* Shadow Cones (Umbra/Penumbra) */}
      {showShadows && (
         <group position={moonPos} rotation={[0, -angle, 0]}>
            {/* Umbra */}
            <mesh rotation={[0, 0, Math.PI/2]} position={[1.5, 0, 0]}>
               <coneGeometry args={[0.2, 3, 32]} />
               <meshBasicMaterial color="black" transparent opacity={0.4} />
            </mesh>
            {/* Penumbra */}
            <mesh rotation={[0, 0, Math.PI/2]} position={[1.5, 0, 0]}>
               <coneGeometry args={[0.5, 3, 32]} />
               <meshBasicMaterial color="#475569" transparent opacity={0.2} />
            </mesh>
         </group>
      )}
    </group>
  );
}

export default function SolarSystem3D() {
  const [isRunning, setIsRunning] = useState(false);
  const [showShadows, setShowShadows] = useState(true);
  const [timeScale, setTimeScale] = useState(0.5);
  
  const sunPos = [0, 0, 0];
  const earthPos = [8, 0, 0]; // Static Earth for simplified Form 1 lunar orbit focus

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <button
        onClick={() => setIsRunning(!isRunning)}
        style={{
            padding: '12px',
            background: isRunning ? '#ef4444' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
        }}
      >
        {isRunning ? '⏹️ Stop Orbits' : '▶️ Start Orbits'}
      </button>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
           Orbit Speed:
        </label>
        <input 
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={timeScale}
          onChange={(e) => setTimeScale(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <button
        onClick={() => setShowShadows(!showShadows)}
        style={{
            padding: '10px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
        }}
      >
        {showShadows ? 'Hide Shadow Cones' : 'Show Umbra/Penumbra'}
      </button>

      <div style={{ padding: '12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#94a3b8', fontSize: '0.85rem' }}>
         <strong style={{ color: 'white' }}>Current Phase Logic:</strong><br/>
         - Align Sun-Moon-Earth: <span style={{ color: '#fbbf24' }}>Solar Eclipse</span><br/>
         - Align Sun-Earth-Moon: <span style={{ color: '#3b82f6' }}>Lunar Eclipse</span>
      </div>
    </div>
  );

  const theory = {
    formula: "Light → Shadow Alignment",
    values: [
      { label: "Sun", value: "Light Source" },
      { label: "Earth", value: "Primary Body" },
      { label: "Moon", value: "Satellite" }
    ]
  };

  return (
    <ExperimentShell title="Solar System & Eclipses" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 15, 15], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.1} />
        
        {/* Sun as light source */}
        <group position={sunPos}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere args={[1.5, 32, 32]}>
                <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} />
            </Sphere>
          </Float>
          <pointLight intensity={3} distance={50} decay={1} />
        </group>

        {/* Earth */}
        <group position={earthPos}>
           <Sphere args={[1, 32, 32]}>
              <meshStandardMaterial color="#3b82f6" roughness={0.7} />
           </Sphere>
           <Text position={[0, 1.5, 0]} fontSize={0.3} color="white">Earth</Text>
           
           <MoonOrbit 
             earthPos={[0, 0, 0]} 
             orbitSpeed={timeScale} 
             isRunning={isRunning} 
             showShadows={showShadows} 
           />
        </group>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls makeDefault />
      </Canvas>
    </ExperimentShell>
  );
}
