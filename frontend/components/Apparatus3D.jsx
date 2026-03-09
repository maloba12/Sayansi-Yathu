import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Float, Stage } from '@react-three/drei';
import * as THREE from 'three';

const APPARATUS_DATA = {
  beaker: {
    name: 'Beaker',
    use: 'Holding, mixing, and heating liquids. Not for precise measurement.',
    safety: 'Handle carefully when hot. Do not use if cracked.',
    render: () => (
      <group>
        <Cylinder args={[0.5, 0.5, 1.2, 32]} openEnded>
          <meshStandardMaterial color="#fff" transparent opacity={0.3} side={THREE.DoubleSide} />
        </Cylinder>
        <Cylinder args={[0.5, 0.5, 0.02, 32]} position={[0, -0.6, 0]}>
          <meshStandardMaterial color="#fff" transparent opacity={0.5} />
        </Cylinder>
      </group>
    )
  },
  test_tube: {
    name: 'Test Tube',
    use: 'Small-scale reactions and heating small amounts of substances.',
    safety: 'Always point the mouth away from yourself and others when heating.',
    render: () => (
      <group>
        <Cylinder args={[0.15, 0.15, 1, 32]} openEnded>
          <meshStandardMaterial color="#fff" transparent opacity={0.3} side={THREE.DoubleSide} />
        </Cylinder>
        <Sphere args={[0.15, 32, 32]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="#fff" transparent opacity={0.3} />
        </Sphere>
      </group>
    )
  },
  measuring_cylinder: {
    name: 'Measuring Cylinder',
    use: 'Measuring precise volumes of liquids.',
    safety: 'Read the volume at the bottom of the meniscus at eye level.',
    render: () => (
      <group>
        <Cylinder args={[0.2, 0.2, 1.8, 32]} openEnded>
          <meshStandardMaterial color="#fff" transparent opacity={0.3} side={THREE.DoubleSide} />
        </Cylinder>
        <Box args={[0.6, 0.05, 0.6]} position={[0, -0.9, 0]}>
          <meshStandardMaterial color="#cbd5e0" />
        </Box>
        {/* Scale marks */}
        {Array.from({ length: 15 }).map((_, i) => (
           <Box key={i} args={[0.1, 0.01, 0.01]} position={[0.21, -0.7 + i * 0.1, 0]}>
              <meshStandardMaterial color="#4a5568" />
           </Box>
        ))}
      </group>
    )
  },
  bunsen_burner: {
    name: 'Bunsen Burner',
    use: 'Providing a controlled open flame for heating, sterilization, and combustion.',
    safety: 'Never leave a lit burner unattended. Turn to safety flame (yellow) when not in use.',
    render: () => (
      <group>
        <Cylinder args={[0.08, 0.08, 1, 32]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#718096" />
        </Cylinder>
        <Cylinder args={[0.3, 0.35, 0.1, 32]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#4a5568" />
        </Cylinder>
        <Cylinder args={[0.12, 0.12, 0.15, 32]} position={[0, 0.2, 0]}>
           <meshStandardMaterial color="#a0aec0" />
        </Cylinder>
        {/* Flame (simulated) */}
        <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
           <Sphere args={[0.1, 8, 8]} position={[0, 1.1, 0]}>
              <meshBasicMaterial color="#3182ce" transparent opacity={0.6} />
           </Sphere>
        </Float>
      </group>
    )
  },
  tripod_stand: {
    name: 'Tripod Stand',
    use: 'Supporting apparatus above a Bunsen burner during heating.',
    safety: 'Ensure all three legs are on a flat, stable surface.',
    render: () => (
      <group>
        <Cylinder args={[0.6, 0.6, 0.05, 3, 1, true]} position={[0, 1, 0]} rotation={[0, Math.PI / 6, 0]}>
           <meshStandardMaterial color="#2d3748" side={THREE.DoubleSide} />
        </Cylinder>
        {[0, 120, 240].map(angle => (
           <Cylinder key={angle} args={[0.03, 0.03, 1]} position={[Math.cos(angle * Math.PI / 180) * 0.55, 0.5, Math.sin(angle * Math.PI / 180) * 0.55]}>
              <meshStandardMaterial color="#2d3748" />
           </Cylinder>
        ))}
      </group>
    )
  }
};

export default function Apparatus3D() {
  const [selected, setSelected] = useState('beaker');
  const data = APPARATUS_DATA[selected];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#1a202c', color: '#fff' }}>
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} contactShadow={false}>
             <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {data.render()}
             </Float>
          </Stage>
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={0.5} enablePan={false} />
      </Canvas>

      {/* Info Panel */}
      <div style={{ position: 'absolute', left: 40, top: '50%', transform: 'translateY(-50%)', width: 350, zIndex: 10 }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 10px', color: '#63b3ed' }}>{data.name}</h1>
        <div style={{ background: 'rgba(45, 55, 72, 0.8)', padding: 25, borderRadius: 15, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h4 style={{ color: '#90cdf4', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }}>Primary Use</h4>
          <p style={{ lineHeight: 1.6, margin: '0 0 20px', fontSize: '1.1rem' }}>{data.use}</p>
          
          <h4 style={{ color: '#feb2b2', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }}>⚠ Safety Precaution</h4>
          <p style={{ lineHeight: 1.6, margin: 0, fontSize: '1rem', fontStyle: 'italic' }}>{data.safety}</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 20 }}>
          {Object.keys(APPARATUS_DATA).map(key => (
            <button key={key} onClick={() => setSelected(key)} 
              style={{ padding: '12px 8px', background: selected === key ? '#3182ce' : '#2d3748', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize' }}>
              {key.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 40, right: 40, textAlign: 'right' }}>
         <p style={{ color: '#718096', fontSize: '0.9rem' }}>Sayansi Yathu Virtual Lab — Apparatus Identifier</p>
         <p style={{ color: '#4a5568', fontSize: '0.8rem' }}>CDC Zambia Form 1 Chemistry Curriculum</p>
      </div>
    </div>
  );
}
