import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Html, Center, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

function DiffusionParticles({ count = 500, temp, isDropped }) {
  const points = useRef();
  
  // Use useMemo to stabilize the initial positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Start all particles at a tiny cluster (the crystal)
        pos[i * 3] = (Math.random() - 0.5) * 0.1;
        pos[i * 3 + 1] = 0; 
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (!isDropped || !points.current) return;
    
    const array = points.current.geometry.attributes.position.array;
    const speed = (temp / 20) * 0.05; // Scaling factor for Brownian motion

    for (let i = 0; i < count; i++) {
      // Random walk (Brownian motion)
      array[i * 3] += (Math.random() - 0.5) * speed;
      array[i * 3 + 1] += (Math.random() - 0.5) * speed;
      array[i * 3 + 2] += (Math.random() - 0.5) * speed;

      // Keep within beaker bounds (approx cylinder radius 0.9, height 2)
      const distSq = array[i * 3] ** 2 + array[i * 3 + 2] ** 2;
      if (distSq > 0.8) {
         array[i * 3] *= 0.95;
         array[i * 3 + 2] *= 0.95;
      }
      if (array[i * 3 + 1] > 1) array[i * 3 + 1] = 1;
      if (array[i * 3 + 1] < -1) array[i * 3 + 1] = -1;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        vertexColors={false}
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        color="#a855f7"
        opacity={0.6}
      />
    </Points>
  );
}

function DiffusionLogic({ isDropped, setTime }) {
  useFrame((state, delta) => {
     if (isDropped) {
        setTime(prev => prev + delta);
     }
  });
  return null;
}

export default function Diffusion3D() {
  const [temp, setTemp] = useState(25);
  const [isDropped, setIsDropped] = useState(false);
  const [time, setTime] = useState(0);

  const reset = () => {
     setIsDropped(false);
     setTime(0);
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Water Temperature: <strong>{temp}°C</strong>
        </label>
        <input 
          type="range"
          min="5"
          max="90"
          value={temp}
          onChange={(e) => setTemp(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
         <button 
           onClick={() => setIsDropped(true)}
           disabled={isDropped}
           style={{
             flex: 1,
             padding: '12px',
             background: isDropped ? '#94a3b8' : '#3b82f6',
             color: 'white',
             border: 'none',
             borderRadius: '8px',
             cursor: isDropped ? 'default' : 'pointer',
             fontWeight: 'bold'
           }}
         >
           💧 Drop Crystal
         </button>
         <button 
           onClick={reset}
           style={{
             padding: '12px',
             background: '#f1f5f9',
             color: '#1e293b',
             border: '1px solid #cbd5e1',
             borderRadius: '8px',
             cursor: 'pointer'
           }}
         >
           🔄 Reset
         </button>
      </div>

      <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
         <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Time Elapsed</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{time.toFixed(1)}s</div>
         </div>
         <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Diffusion Rate</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: temp > 60 ? '#ef4444' : '#3b82f6' }}>
               {temp > 60 ? '🔥 Fast' : temp > 30 ? '⚡ Moderate' : '❄️ Slow'}
            </div>
         </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
         Notice how purple particles move faster and spread further at higher temperatures.
      </p>
    </div>
  );

  const theory = {
    formula: "K.E. ∝ Temperature",
    values: [
      { label: "Medium", value: "Distilled Water" },
      { label: "Solute", value: "KMnO₄ Crystal" },
      { label: "Mechanism", value: "Brownian Motion" }
    ]
  };

  return (
    <ExperimentShell title="Diffusion in Liquids" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
        <DiffusionLogic isDropped={isDropped} setTime={setTime} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Center top>
           {/* Beaker */}
           <group>
              <Cylinder args={[1, 1, 2, 32, 1, true]} position={[0, 0, 0]}>
                 <meshStandardMaterial color="#e0f2fe" transparent opacity={0.3} side={THREE.DoubleSide} />
              </Cylinder>
              {/* Bottom */}
              <Cylinder args={[1, 1, 0.05]} position={[0, -1, 0]}>
                 <meshStandardMaterial color="#e0f2fe" transparent opacity={0.5} />
              </Cylinder>
           </group>

           {/* Water Level */}
           <Cylinder args={[0.98, 0.98, 1.8]} position={[0, -0.1, 0]}>
              <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} />
           </Cylinder>

           {/* The Crystal (disappears when dropped) */}
           {!isDropped && (
             <Box args={[0.2, 0.2, 0.2]} position={[0, 1.5, 0]}>
               <meshStandardMaterial color="#7e22ce" />
             </Box>
           )}

           {/* Particles System */}
           <group position={[0, -0.8, 0]}>
              <DiffusionParticles count={800} temp={temp} isDropped={isDropped} />
           </group>
        </Center>

        <OrbitControls makeDefault />
      </Canvas>
    </ExperimentShell>
  );
}
