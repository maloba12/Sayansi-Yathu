import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Float, Stage, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const CHARACTERISTICS = [
  { id: 'm', label: 'Movement', desc: 'All living things move, even if it is slow.', icon: '🏃' },
  { id: 'r', label: 'Respiration', desc: 'Obtaining energy from food.', icon: '🌬️' },
  { id: 's', label: 'Sensitivity', desc: 'Responding to the environment.', icon: '👀' },
  { id: 'g', label: 'Growth', desc: 'Permanent increase in size.', icon: '📈' },
  { id: 'rep', label: 'Reproduction', desc: 'Making more of the same kind.', icon: '🐣' },
  { id: 'e', label: 'Excretion', desc: 'Getting rid of toxic waste.', icon: '🚽' },
  { id: 'n', label: 'Nutrition', desc: 'Taking in materials for energy.', icon: '🍎' },
];

function Organism({ action }) {
  const mesh = useRef();
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState([0, 0.5, 0]);
  const [color, setColor] = useState('#4ade80');

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (action === 'm') {
        mesh.current.position.x = Math.sin(t * 2) * 2;
    } else if (action === 'r') {
        const s = 1 + Math.sin(t * 4) * 0.1;
        mesh.current.scale.set(s, s, s);
    } else if (action === 's') {
        mesh.current.rotation.y = Math.sin(t * 10) * 0.5;
    } else if (action === 'g') {
        mesh.current.scale.lerp(new THREE.Vector3(2, 2, 2), 0.05);
    } else if (action === 'n') {
        mesh.current.material.color.lerp(new THREE.Color('#3b82f6'), 0.1);
    }
  });

  return (
    <group ref={mesh} position={pos}>
        {/* Body */}
        <Sphere args={[1, 32, 32]}>
            <meshStandardMaterial color={color} />
        </Sphere>
        {/* Eyes */}
        <Sphere args={[0.15, 16, 16]} position={[0.4, 0.4, 0.8]}>
            <meshStandardMaterial color="white" />
        </Sphere>
        <Sphere args={[0.07, 16, 16]} position={[0.4, 0.4, 0.9]}>
            <meshStandardMaterial color="black" />
        </Sphere>
        <Sphere args={[0.15, 16, 16]} position={[-0.4, 0.4, 0.8]}>
            <meshStandardMaterial color="white" />
        </Sphere>
        <Sphere args={[0.07, 16, 16]} position={[-0.4, 0.4, 0.9]}>
            <meshStandardMaterial color="black" />
        </Sphere>
        {/* Mouth */}
        <Box args={[0.4, 0.1, 0.1]} position={[0, -0.2, 0.9]}>
            <meshStandardMaterial color="#991b1b" />
        </Box>
    </group>
  );
}

export default function LivingThings3D() {
  const [selected, setSelected] = useState(null);

  const reset = () => setSelected(null);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#111827' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="forest" intensity={0.6}>
            <Organism action={selected} />
          </Stage>
          {/* Ground */}
          <Box args={[20, 0.1, 20]} position={[0, -0.05, 0]}>
              <meshStandardMaterial color="#064e3b" />
          </Box>
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>

      {/* Interface */}
      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, background: 'rgba(30, 41, 59, 0.8)', padding: 15, borderRadius: 20, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {CHARACTERISTICS.map(c => (
           <button 
             key={c.id} 
             onClick={() => setSelected(c.id)}
             style={{ 
                 display: 'flex', 
                 flexDirection: 'column', 
                 alignItems: 'center', 
                 gap: 5, 
                 padding: '10px 15px', 
                 background: selected === c.id ? '#3b82f6' : 'transparent', 
                 border: 'none', 
                 borderRadius: 12, 
                 color: 'white', 
                 cursor: 'pointer',
                 transition: 'all 0.2s'
             }}
           >
             <span style={{ fontSize: '20px' }}>{c.icon}</span>
             <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>{c.label}</span>
           </button>
        ))}
      </div>

      <div style={{ position: 'absolute', top: 40, left: 40, width: 300 }}>
          <h2 style={{ color: '#4ade80', margin: '0 0 10px' }}>MRS GREN</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>The 7 Characteristics of Living Things.</p>
          
          {selected && (
              <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: 20, borderRadius: 15, border: '1px solid #3b82f6', marginTop: 20 }}>
                  <h3 style={{ color: 'white', margin: '0 0 5px' }}>{CHARACTERISTICS.find(c => c.id === selected).label}</h3>
                  <p style={{ color: '#cbd5e0', fontSize: '0.95rem', margin: 0 }}>{CHARACTERISTICS.find(c => c.id === selected).desc}</p>
              </div>
          )}
      </div>

      <div style={{ position: 'absolute', top: 40, right: 40 }}>
           <button onClick={reset} style={{ padding: '10px 20px', background: '#334155', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Reset Organism</button>
      </div>
    </div>
  );
}
