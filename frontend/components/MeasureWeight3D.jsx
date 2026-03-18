import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

const PLANETS = {
  earth: { name: 'Earth', g: 9.8, color: '#3b82f6' },
  moon: { name: 'Moon', g: 1.6, color: '#94a3b8' },
  jupiter: { name: 'Jupiter', g: 24.8, color: '#f59e0b' },
  mars: { name: 'Mars', g: 3.7, color: '#ef4444' },
  space: { name: 'Deep Space', g: 0.1, color: '#1e293b' }
};

function Spring({ extension, length = 2, coils = 15 }) {
  const points = [];
  const radius = 0.2;
  const totalHeight = length + extension;
  
  for (let i = 0; i <= coils * 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const y = -(i / (coils * 10)) * totalHeight;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
  }

  return (
    <group>
      <line>
        <bufferGeometry attach="geometry" setFromPoints={points} />
        <lineBasicMaterial attach="material" color="#64748b" linewidth={2} />
      </line>
      {/* Hook at the bottom */}
      <Cylinder args={[0.02, 0.02, 0.4]} position={[0, -totalHeight - 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#475569" />
      </Cylinder>
    </group>
  );
}

export default function MeasureWeight3D() {
  const [selectedPlanet, setSelectedPlanet] = useState('earth');
  const [mass, setMass] = useState(0.5); // kg
  const [extension, setExtension] = useState(0);
  
  const planet = PLANETS[selectedPlanet];
  const weight = mass * planet.g; // N
  const springConstant = 5; // N/m (fictional k for visual scaling)

  useEffect(() => {
    // x = F/k
    setExtension(weight / springConstant);
  }, [weight]);

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Location:</label>
        <select 
          value={selectedPlanet} 
          onChange={(e) => setSelectedPlanet(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        >
          {Object.entries(PLANETS).map(([key, p]) => (
            <option key={key} value={key}>{p.name} (g={p.g} m/s²)</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Adjust Mass: <strong>{(mass * 1000).toFixed(0)} g</strong>
        </label>
        <input 
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={mass}
          onChange={(e) => setMass(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '10px', borderLeft: '5px solid #3b82f6' }}>
         <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Calculated Force (Weight):</div>
         <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>
            {weight.toFixed(2)} N
         </div>
      </div>

      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
         * Notice how mass remains constant while weight changes across planets.
      </div>
    </div>
  );

  const theory = {
    formula: "W = m × g",
    values: [
      { label: "Mass (m)", value: `${(mass * 1000).toFixed(0)} g` },
      { label: "Gravity (g)", value: `${planet.g} m/s²` },
      { label: "Weight (W)", value: `${weight.toFixed(2)} Newtons` }
    ]
  };

  return (
    <ExperimentShell title="Measurement of Weight" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [5, 2, 8], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <color attach="background" args={[planet.color + '22']} />
        
        <Center top>
           {/* Stand */}
           <Box args={[0.5, 0.2, 0.5]} position={[0, -0.1, 0]}>
             <meshStandardMaterial color="#334155" />
           </Box>
           <Cylinder args={[0.05, 0.05, 8]} position={[0, 4, 0]}>
             <meshStandardMaterial color="#475569" />
           </Cylinder>
           <Box args={[1.5, 0.1, 0.1]} position={[0.7, 7.9, 0]}>
              <meshStandardMaterial color="#475569" />
           </Box>

           {/* Spring Balance */}
           <group position={[1.2, 7.9, 0]}>
              {/* Outer Casing */}
              <Box args={[0.6, 3, 0.05]} position={[0, -1.5, -0.2]}>
                 <meshStandardMaterial color="white" />
              </Box>
              {/* Scale Marks */}
              {[...Array(11)].map((_, i) => (
                 <group key={i} position={[0, -i * 0.25, -0.15]}>
                    <Box args={[0.4, 0.01, 0.01]}>
                       <meshStandardMaterial color="black" />
                    </Box>
                    <Text position={[0.4, 0, 0]} fontSize={0.1} color="black">{i}N</Text>
                 </group>
              ))}

              <Spring extension={extension} />

              {/* Hung Mass */}
              <group position={[0, -2 - extension - 0.4, 0]}>
                 <Cylinder args={[0.4, 0.4, 0.8, 16]}>
                    <meshStandardMaterial color="#4b5563" />
                 </Cylinder>
                 <Text position={[0, 0, 0.45]} fontSize={0.15} color="white">
                    {(mass * 1000).toFixed(0)}g
                 </Text>
              </group>
           </group>
        </Center>

        <OrbitControls />
      </Canvas>
    </ExperimentShell>
  );
}
