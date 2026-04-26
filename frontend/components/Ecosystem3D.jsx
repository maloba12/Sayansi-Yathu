import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Stage, Box, Cylinder, Float, Gltf } from '@react-three/drei';
import * as THREE from 'three';

const FACTORS = [
  { id: 'plant', type: 'biotic', name: 'Producer (Plant)', pos: [1, 1, 1], color: '#22c55e', desc: 'Living things like plants that produce energy from sunlight.' },
  { id: 'water', type: 'abiotic', name: 'Water', pos: [-2, 0, -1], color: '#3b82f6', desc: 'Non-living part of the ecosystem essential for life.' },
  { id: 'rock', type: 'abiotic', name: 'Soil/Rocks', pos: [2, 0, -2], color: '#64748b', desc: 'Abiotic factor providing minerals and habitat.' },
  { id: 'animal', type: 'biotic', name: 'Consumer (Animal)', pos: [-1, 1, 2], color: '#ea580c', desc: 'Organisms that eat other living things for energy.' },
];

function Scene() {
  return (
    <group>
        {/* Grass Plane */}
        <Box args={[10, 0.2, 10]} position={[0, -0.1, 0]}>
            <meshStandardMaterial color="#14532d" />
        </Box>
        {/* Pond */}
        <Cylinder args={[2, 2, 0.1]} position={[-2, 0, -1]}>
            <meshStandardMaterial color="#1d4ed8" />
        </Cylinder>
    </group>
  );
}

export default function Ecosystem3D() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#020617' }}>
      <Canvas camera={{ position: [5, 5, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="forest" intensity={0.5}>
            <Scene />
            {FACTORS.map(f => (
               <group key={f.id} position={f.pos} onClick={() => setSelected(f)}>
                  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                      <Sphere args={[0.3, 32, 32]}>
                          <meshStandardMaterial color={f.color} emissive={f.color} emissiveIntensity={selected?.id === f.id ? 1 : 0} />
                      </Sphere>
                  </Float>
               </group>
            ))}
          </Stage>
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>

      <div style={{ position: 'absolute', left: 40, top: 40, width: 320 }}>
          <h1 style={{ color: 'white', margin: '0 0 10px' }}>Local Ecosystem</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Identify Biotic (Living) and Abiotic (Non-living) components.</p>
          
          <div style={{ marginTop: 25, display: 'flex', flexDirection: 'column', gap: 15 }}>
              {selected ? (
                  <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: 25, borderRadius: 15, borderLeft: `5px solid ${selected.color}`, backdropFilter: 'blur(10px)' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: selected.type === 'biotic' ? '#4ade80' : '#60a5fa', fontWeight: 'bold' }}>{selected.type} Factor</span>
                      <h3 style={{ color: 'white', margin: '5px 0' }}>{selected.name}</h3>
                      <p style={{ color: '#cbd5e0', fontSize: '0.9rem', lineHeight: 1.5 }}>{selected.desc}</p>
                  </div>
              ) : (
                  <div style={{ background: 'rgba(30, 41, 59, 0.3)', padding: 20, borderRadius: 15, border: '1px dashed #475569', textAlign: 'center' }}>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Click the floating spheres to identify factors.</p>
                  </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: 'rgba(20, 83, 45, 0.2)', padding: 10, borderRadius: 8, color: '#4ade80', fontSize: '0.8rem', textAlign: 'center' }}>
                      <strong>Biotic:</strong> Plants, Animals, Fungi
                  </div>
                  <div style={{ background: 'rgba(30, 64, 175, 0.2)', padding: 10, borderRadius: 8, color: '#60a5fa', fontSize: '0.8rem', textAlign: 'center' }}>
                      <strong>Abiotic:</strong> Water, Air, Soil
                  </div>
              </div>
          </div>
      </div>

      <div style={{ position: 'absolute', bottom: 40, right: 40, color: '#475569', textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.8rem' }}>Interact with the environment to explore biological features.</p>
      </div>
    </div>
  );
}
