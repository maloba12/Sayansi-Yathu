import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

const LAYERS = [
  { name: 'Troposphere', hMin: 0, hMax: 12, temp: '15 to -50°C', text: 'Where we live & weather occurs.', color: '#3b82f6' },
  { name: 'Stratosphere', hMin: 12, hMax: 50, temp: '-50 to 0°C', text: 'Ozone layer protects from UV.', color: '#60a5fa' },
  { name: 'Mesosphere', hMin: 50, hMax: 85, temp: '0 to -90°C', text: 'Meteors burn up here.', color: '#1e40af' },
  { name: 'Thermosphere', hMin: 85, hMax: 600, temp: '-90 to 1500°C', text: 'Satellites & Aurora.', color: '#1e3a8a' },
  { name: 'Exosphere', hMin: 600, hMax: 1000, temp: 'Variable', text: 'Edge of space.', color: '#0f172a' }
];

function Balloon({ altitude, isAscending }) {
  const groupRef = useRef();

  return (
    <group position={[0, (altitude / 10) - 5, 0]}>
       <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Sphere args={[0.5, 32, 32]}>
             <meshStandardMaterial color="#ef4444" />
          </Sphere>
          <Cylinder args={[0.1, 0.1, 0.2]} position={[0, -0.6, 0]}>
             <meshStandardMaterial color="#475569" />
          </Cylinder>
       </Float>
       {/* Height Tag */}
       <Html position={[0, 0, 0]}>
          <div style={{ color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 5px', borderRadius: '4px', fontSize: '0.6rem', whiteSpace: 'nowrap' }}>
             {altitude.toFixed(0)} km
          </div>
       </Html>
    </group>
  );
}

function AtmosphereLogic({ isLaunched, altitude, setAltitude }) {
  useFrame((state, delta) => {
    if (isLaunched && altitude < 100) {
       setAltitude(prev => Math.min(prev + delta * 5, 100)); // Cap for visual tube
    }
  });
  return null;
}

export default function Atmosphere3D() {
  const [altitude, setAltitude] = useState(0); // km
  const [isLaunched, setIsLaunched] = useState(false);

  const currentLayer = LAYERS.find(l => altitude >= l.hMin && altitude < l.hMax) || LAYERS[4];

  // Simulated metrics
  const pressure = 1013 * Math.exp(-altitude / 7); // hPa
  const temp = altitude < 12 ? 15 - 6.5 * altitude : -50; // Simplified Troposphere temp

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <button 
        onClick={() => setIsLaunched(!isLaunched)}
        style={{
            padding: '12px',
            background: isLaunched ? '#ef4444' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
        }}
      >
        {isLaunched ? '⏹️ Stop Ascent' : '🚀 Launch Balloon'}
      </button>

      <button
        onClick={() => { setIsLaunched(false); setAltitude(0); }}
        style={{ padding: '8px', border: '1px solid #94a3b8', background: 'white', borderRadius: '6px' }}
      >
        🔄 Reset to Ground
      </button>

      <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
         <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Altitude</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{altitude.toFixed(1)} km</div>
         </div>
         <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Pressure</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{pressure.toFixed(1)} hPa</div>
         </div>
         <div style={{ gridColumn: 'span 2' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Current Layer ({currentLayer.name})</div>
            <div style={{ fontSize: '0.85rem' }}>{currentLayer.text}</div>
         </div>
      </div>
    </div>
  );

  const theory = {
    formula: "P = P₀e^(-h/7)",
    values: [
      { label: "Altitude", value: `${altitude.toFixed(1)} km` },
      { label: "Est. Temp", value: `${temp.toFixed(1)} °C` },
      { label: "Oxygen Level", value: altitude > 5 ? "Critical Low" : "Normal" }
    ]
  };

  return (
    <ExperimentShell title="Structure of the Atmosphere" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [5, 0, 10], fov: 45 }}>
        <AtmosphereLogic isLaunched={isLaunched} altitude={altitude} setAltitude={setAltitude} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <color attach="background" args={['#0ea5e9']} />

        <Center>
           {/* Atmosphere Column */}
           {LAYERS.map((layer, idx) => (
              <Box 
                key={layer.name} 
                args={[4, layer.hMax - layer.hMin, 4]} 
                position={[0, (layer.hMin + (layer.hMax - layer.hMin) / 2) / 10 - 5, -2]}
              >
                 <meshStandardMaterial 
                   color={layer.color} 
                   transparent 
                   opacity={0.3 + (idx * 0.1)} 
                 />
              </Box>
           ))}

           <Balloon altitude={altitude} isAscending={isLaunched} />

           {/* Ground */}
           <Box args={[10, 0.1, 10]} position={[0, -5.05, 0]}>
              <meshStandardMaterial color="#22c55e" />
           </Box>
        </Center>

        <OrbitControls makeDefault enablePan={false} />
      </Canvas>
    </ExperimentShell>
  );
}
