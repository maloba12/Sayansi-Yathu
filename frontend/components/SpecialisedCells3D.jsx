import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Float, Stage, Box, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

const CELLS = {
  rbc: {
    name: 'Red Blood Cell',
    adaptation: 'Biconcave shape increases surface area for oxygen absorption. No nucleus allows more space for hemoglobin.',
    render: () => (
      <group>
        <Torus args={[1, 0.4, 16, 100]}>
          <meshStandardMaterial color="#b91c1c" />
        </Torus>
        <Sphere args={[0.9, 32, 16]} scale={[1, 0.2, 1]}>
           <meshStandardMaterial color="#991b1b" />
        </Sphere>
      </group>
    )
  },
  root_hair: {
    name: 'Root Hair Cell',
    adaptation: 'Long projection (hair) increases surface area for water and mineral absorption from soil.',
    render: () => (
      <group>
        <Box args={[1, 2, 1]}>
          <meshStandardMaterial color="#84cc16" />
        </Box>
        <Cylinder args={[0.2, 0.2, 3]} position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#a3e635" />
        </Cylinder>
      </group>
    )
  },
  ciliated: {
    name: 'Ciliated Cell',
    adaptation: 'Tiny hair-like structures (cilia) move in waves to sweep mucus and trapped dust out of airways.',
    render: () => (
      <group>
        <Box args={[1.5, 2, 1]}>
          <meshStandardMaterial color="#fb7185" />
        </Box>
        {Array.from({ length: 40 }).map((_, i) => (
           <Cylinder key={i} args={[0.02, 0.02, 0.4]} position={[(i % 10) * 0.15 - 0.7, 1.2, Math.floor(i/10) * 0.2 - 0.3]}>
              <meshStandardMaterial color="#f43f5e" />
           </Cylinder>
        ))}
      </group>
    )
  },
  sperm: {
    name: 'Sperm Cell',
    adaptation: 'Tail (flagellum) for swimming to the egg. Mid-section contains many mitochondria for energy.',
    render: () => (
      <group>
        {/* Head */}
        <Sphere args={[0.5, 32, 32]} scale={[1.2, 1, 1]}>
            <meshStandardMaterial color="#e2e8f0" />
        </Sphere>
        {/* Midpiece */}
        <Cylinder args={[0.15, 0.15, 0.6]} position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI/2]}>
            <meshStandardMaterial color="#94a3b8" />
        </Cylinder>
        {/* Tail */}
        <Cylinder args={[0.05, 0.01, 3]} position={[-2.6, 0, 0]} rotation={[0, 0, Math.PI/2]}>
            <meshStandardMaterial color="#64748b" />
        </Cylinder>
      </group>
    )
  }
};

export default function SpecialisedCells3D() {
  const [selected, setSelected] = useState('rbc');
  const data = CELLS[selected];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0f172a' }}>
      <Canvas camera={{ position: [5, 3, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              {data.render()}
            </Float>
          </Stage>
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>

      <div style={{ position: 'absolute', left: 40, top: 40, width: 350 }}>
          <h1 style={{ color: 'white', margin: '0 0 5px' }}>Specialised Cells</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 25 }}>How form follows function in biology.</p>
          
          <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: 25, borderRadius: 15, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ color: '#63b3ed', fontSize: '1.5rem', marginBottom: 10 }}>{data.name}</h2>
              <p style={{ color: '#e2e8f0', lineHeight: 1.6, fontSize: '1rem' }}>{data.adaptation}</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
              {Object.keys(CELLS).map(key => (
                  <button 
                    key={key} 
                    onClick={() => setSelected(key)}
                    style={{ 
                        padding: '12px', 
                        background: selected === key ? '#3b82f6' : '#1e293b', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 8, 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: '0.2s'
                    }}
                  >
                      {CELLS[key].name}
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
}
