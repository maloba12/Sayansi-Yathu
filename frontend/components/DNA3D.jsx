import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const BASE_PAIRS = [
  { name: 'Adenine (A)', color: '#f56565', pair: 'Thymine (T)' },
  { name: 'Thymine (T)', color: '#3182ce', pair: 'Adenine (A)' },
  { name: 'Cytosine (C)', color: '#48bb78', pair: 'Guanine (G)' },
  { name: 'Guanine (G)', color: '#ecc94b', pair: 'Cytosine (C)' },
];

function Helix() {
  const groupRef = useRef();
  
  // Create DNA structure data
  const dnaData = useMemo(() => {
    const r = 1;
    const steps = 24;
    const verticalSpacing = 0.3;
    const rotationPerStep = Math.PI / 4;
    
    return Array.from({ length: steps }).map((_, i) => {
      const angle = i * rotationPerStep;
      const y = (i - steps/2) * verticalSpacing;
      
      const pos1 = [Math.cos(angle) * r, y, Math.sin(angle) * r];
      const pos2 = [Math.cos(angle + Math.PI) * r, y, Math.sin(angle + Math.PI) * r];
      
      const baseInfo = BASE_PAIRS[i % 4];
      const pairInfo = BASE_PAIRS.find(b => b.name.startsWith(baseInfo.pair[0]));

      return { pos1, pos2, baseInfo, pairInfo, y, angle };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {dnaData.map((step, i) => (
        <group key={i}>
          {/* Sugar-Phosphate Backbones */}
          <Sphere args={[0.1, 16, 16]} position={step.pos1}>
            <meshStandardMaterial color="#cbd5e0" />
          </Sphere>
          <Sphere args={[0.1, 16, 16]} position={step.pos2}>
            <meshStandardMaterial color="#cbd5e0" />
          </Sphere>
          
          {/* Base Pairs (Connector) */}
          <group>
             {/* Left half base */}
             <mesh position={[(step.pos1[0] + 0) / 2, step.y, (step.pos1[2] + 0) / 2]} rotation={[0, -step.angle, 0]}>
                <Box args={[1, 0.05, 0.05]}>
                   <meshStandardMaterial color={step.baseInfo.color} />
                </Box>
             </mesh>
             {/* Right half base */}
             <mesh position={[(step.pos2[0] + 0) / 2, step.y, (step.pos2[2] + 0) / 2]} rotation={[0, -step.angle, 0]}>
                <Box args={[1, 0.05, 0.05]}>
                   <meshStandardMaterial color={step.pairInfo.color} />
                </Box>
             </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

function Box({ args, ...props }) {
  return (
    <mesh {...props}>
      <boxGeometry args={args} />
      {props.children}
    </mesh>
  );
}

export default function DNA3D() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0f172a' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <ambientLight intensity={0.5} />
        <OrbitControls />
        
        <Helix />
        
        <Float speed={2} floatIntensity={0.5}>
          <Text position={[0, 4.5, 0]} fontSize={0.4} color="#f8fafc">
            DNA DOUBLE HELIX
          </Text>
        </Float>
      </Canvas>

      <div style={{ position: 'absolute', bottom: 30, left: 30, background: 'rgba(30, 41, 59, 0.8)', padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}>
        <h4 style={{ margin: '0 0 10px', color: '#93c5fd' }}>Key: Nitrogenous Bases</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {BASE_PAIRS.map(b => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, background: b.color, borderRadius: 2 }} />
              <span style={{ fontSize: '0.85rem' }}>{b.name}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', marginTop: 15, color: '#94a3b8', fontStyle: 'italic' }}>Note: Adenine always pairs with Thymine (A-T), and Cytosine with Guanine (C-G).</p>
      </div>

      <div style={{ position: 'absolute', top: 30, right: 30, textAlign: 'right', color: '#64748b' }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Sayansi Yathu Biology Lab</p>
        <p style={{ margin: 0, fontSize: '0.75rem' }}>Visualizing the Blueprint of Life</p>
      </div>
    </div>
  );
}
