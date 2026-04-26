import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Float, Stage, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function Invertebrate({ targetX }) {
  const ref = useRef();
  const [pos, setPos] = useState([Math.random() * 4 - 2, 0.1, Math.random() * 2 - 1]);

  useFrame((state) => {
    // Slowly move towards targetX
    if (ref.current.position.x < targetX) {
      ref.current.position.x += 0.01;
    } else if (ref.current.position.x > targetX) {
      ref.current.position.x -= 0.01;
    }
    // Add some random wobble
    ref.current.position.z += (Math.random() - 0.5) * 0.02;
    ref.current.position.z = Math.max(-1, Math.min(1, ref.current.position.z));
  });

  return (
    <mesh ref={ref} position={pos}>
      <Sphere args={[0.1, 16, 16]} scale={[1.5, 0.8, 1]}>
        <meshStandardMaterial color="#475569" />
      </Sphere>
    </mesh>
  );
}

export default function TaxicResponses3D() {
  const [stimulus, setStimulus] = useState('none');

  const getTargetX = () => {
    if (stimulus === 'light') return -3.5; // Move away from light (left is dark)
    if (stimulus === 'dark') return 3.5;   // Move towards dark
    return 0;
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#020617' }}>
      <Canvas camera={{ position: [0, 6, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          
          {/* Choice Chamber */}
          <Box args={[10, 0.2, 4]} position={[0, -0.1, 0]}>
            <meshStandardMaterial color="#1e293b" />
          </Box>
          
          {/* Light Side */}
          <Box args={[5, 0.1, 4]} position={[2.5, 0, 0]}>
            <meshStandardMaterial color={stimulus === 'light' ? '#fde047' : '#334155'} />
            {stimulus === 'light' && <pointLight position={[0, 2, 0]} intensity={1} color="#fde047" />}
          </Box>

          {/* Dark Side */}
          <Box args={[5, 0.1, 4]} position={[-2.5, 0, 0]}>
            <meshStandardMaterial color="#0f172a" />
          </Box>

          {/* Organisms */}
          {Array.from({ length: 15 }).map((_, i) => (
            <Invertebrate key={i} targetX={getTargetX()} />
          ))}

          <Text position={[2.5, 0.5, 2.2]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.3} color="white">BRIGHT</Text>
          <Text position={[-2.5, 0.5, 2.2]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.3} color="white">DARK</Text>
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>

      <div style={{ position: 'absolute', left: 40, top: 40, width: 300 }}>
        <h1 style={{ color: 'white', margin: '0 0 10px' }}>Taxic Responses</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Exploring Phototaxis in Invertebrates (e.g., Woodlice).</p>

        <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: 20, borderRadius: 15, border: '1px solid rgba(255,255,255,0.1)', marginTop: 20 }}>
            <h4 style={{ color: '#fbbf24', marginBottom: 10 }}>Simulation Control</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button 
                  onClick={() => setStimulus('light')}
                  style={{ padding: '12px', background: stimulus === 'light' ? '#fde047' : '#334155', color: stimulus === 'light' ? '#000' : '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Turn On Light
                </button>
                <button 
                  onClick={() => setStimulus('none')}
                  style={{ padding: '12px', background: stimulus === 'none' ? '#3b82f6' : '#334155', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer' }}
                >
                  Neutral (Darkness)
                </button>
            </div>
        </div>

        {stimulus === 'light' && (
            <div style={{ marginTop: 20, padding: 15, background: 'rgba(253, 224, 71, 0.1)', borderRadius: 10, color: '#fde047', border: '1px solid #fde047', fontSize: '0.85rem' }}>
                <strong>Negative Phototaxis:</strong> The organisms are moving away from the light source and towards the dark area to avoid dehydration and predators.
            </div>
        )}
      </div>
    </div>
  );
}
