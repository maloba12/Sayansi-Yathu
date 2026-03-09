import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const STATES = {
  solid: { label: 'Ice (Solid)', temp: -10, speed: 0.02, spacing: 0.15, spread: 0.8 },
  liquid: { label: 'Water (Liquid)', temp: 25, speed: 0.1, spacing: 0.2, spread: 1.2 },
  gas: { label: 'Steam (Gas)', temp: 110, speed: 0.5, spacing: 0.8, spread: 3.0 },
};

function Particles({ stateKey }) {
  const count = 500;
  const meshRef = useRef();
  const config = STATES[stateKey];

  // Initialize random positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * config.spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * config.spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * config.spread;
    }
    return pos;
  }, [stateKey]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      const posArr = meshRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        // Particles vibrate or move based on state
        const idx = i * 3;
        if (stateKey === 'solid') {
          // Vibration around fixed point
          posArr[idx] += Math.sin(time * 20 + i) * 0.005;
          posArr[idx + 1] += Math.cos(time * 20 + i) * 0.005;
          posArr[idx + 2] += Math.sin(time * 20 + i) * 0.005;
        } else {
          // Brownian-like motion
          posArr[idx] += (Math.random() - 0.5) * config.speed * 0.2;
          posArr[idx + 1] += (Math.random() - 0.5) * config.speed * 0.2;
          posArr[idx + 2] += (Math.random() - 0.5) * config.speed * 0.2;

          // Boundary checks for liquid/gas
          if (Math.abs(posArr[idx]) > config.spread / 2) posArr[idx] *= -0.9;
          if (Math.abs(posArr[idx + 1]) > config.spread / 2) posArr[idx + 1] *= -0.9;
          if (Math.abs(posArr[idx + 2]) > config.spread / 2) posArr[idx + 2] *= -0.9;
        }
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={meshRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors={false}
        color={stateKey === 'gas' ? '#cbd5e0' : (stateKey === 'liquid' ? '#4299e1' : '#fff')}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

export default function StatesOfMatter3D() {
  const [stateKey, setStateKey] = useState('solid');
  const [temp, setTemp] = useState(STATES.solid.temp);

  const handleTempChange = (newTemp) => {
    setTemp(newTemp);
    if (newTemp < 0) setStateKey('solid');
    else if (newTemp < 100) setStateKey('liquid');
    else setStateKey('gas');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Particles stateKey={stateKey} />
        <OrbitControls enablePan={false} />
      </Canvas>

      <div style={{ position: 'absolute', left: 20, top: 20, width: 300, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: 20, borderRadius: 12, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <h3 style={{ margin: '0 0 16px' }}>🔬 Molecular Dynamics</h3>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 8 }}>Temperature: {temp}°C</label>
          <input 
            type="range" min="-50" max="200" value={temp} 
            onChange={(e) => handleTempChange(parseInt(e.target.value))} 
            style={{ width: '100%' }} 
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#a0aec0', marginTop: 5 }}>
             <span>Freeze</span>
             <span>Boil</span>
          </div>
        </div>

        <div style={{ padding: 15, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
          <h4 style={{ margin: '0 0 10px', color: '#63b3ed' }}>{STATES[stateKey].label}</h4>
          <p style={{ fontSize: '0.9rem', margin: 0, color: '#e2e8f0', lineHeight: 1.5 }}>
            {stateKey === 'solid' && "Particles are closely packed in a fixed pattern. They only vibrate about their fixed positions."}
            {stateKey === 'liquid' && "Particles are close together but move randomly. They can flow and take the shape of the container."}
            {stateKey === 'gas' && "Particles are far apart and move very fast in all directions. They fill any available space."}
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(0,0,0,0.5)', padding: 15, borderRadius: 8, color: '#718096', fontSize: '0.8rem' }}>
         Drag to Rotate • Scroll to Zoom
      </div>
    </div>
  );
}
