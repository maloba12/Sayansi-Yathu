import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Float, Stage, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function Plant({ tropism }) {
  const stemRef = useRef();
  
  useFrame((state) => {
    if (tropism === 'phototropism') {
       // Bend towards light (Sun is at [5, 5, 0])
       stemRef.current.rotation.z = THREE.MathUtils.lerp(stemRef.current.rotation.z, -Math.PI / 4, 0.02);
    } else if (tropism === 'geotropism') {
       // Bend towards gravity (Down)
       stemRef.current.rotation.z = THREE.MathUtils.lerp(stemRef.current.rotation.z, Math.PI / 2, 0.02);
    } else {
       stemRef.current.rotation.z = THREE.MathUtils.lerp(stemRef.current.rotation.z, 0, 0.02);
    }
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Pot */}
      <Box args={[1.5, 1, 1.5]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#b45309" />
      </Box>
      
      {/* Stem */}
      <group ref={stemRef} position={[0, 1, 0]}>
        <Cylinder args={[0.08, 0.1, 4]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#166534" />
        </Cylinder>
        {/* Leaves */}
        <Box args={[0.8, 0.02, 0.4]} position={[0.4, 3, 0]} rotation={[0, 0, 0.5]}>
           <meshStandardMaterial color="#22c55e" />
        </Box>
        <Box args={[0.8, 0.02, 0.4]} position={[-0.4, 2, 0]} rotation={[0, 0, -0.5]}>
           <meshStandardMaterial color="#22c55e" />
        </Box>
      </group>
    </group>
  );
}

export default function Tropisms3D() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#020617' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
        <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <Stage environment="forest" intensity={0.5}>
                <Plant tropism={selected} />
            </Stage>
            
            {/* The Sun for Phototropism */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sphere args={[0.5, 32, 32]} position={[5, 4, 0]}>
                    <meshBasicMaterial color="#fbbf24" />
                </Sphere>
            </Float>
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>

      <div style={{ position: 'absolute', left: 40, top: 40, width: 300 }}>
          <h1 style={{ color: 'white', margin: '0 0 10px' }}>Plant Tropisms</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Observe how plants respond to external stimuli.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 25 }}>
              <button 
                onClick={() => setSelected('phototropism')}
                style={{ 
                    padding: '15px', 
                    background: selected === 'phototropism' ? '#fbbf24' : '#1e293b', 
                    color: selected === 'phototropism' ? '#000' : '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textAlign: 'left'
                }}
              >
                  ☀️ Phototropism: Response to Light
              </button>
              <button 
                onClick={() => setSelected('geotropism')}
                style={{ 
                    padding: '15px', 
                    background: selected === 'geotropism' ? '#8b5cf6' : '#1e293b', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textAlign: 'left'
                }}
              >
                  🌍 Geotropism: Response to Gravity
              </button>
              <button onClick={() => setSelected(null)} style={{ padding: '10px', background: 'transparent', border: '1px solid #475569', color: '#94a3b8', borderRadius: 8, cursor: 'pointer' }}>Reset Plant</button>
          </div>

          {selected && (
              <div style={{ marginTop: 20, padding: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 12, color: '#cbd5e0', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  <strong>{selected === 'phototropism' ? 'Phototropism' : 'Geotropism'}:</strong>
                  {selected === 'phototropism' 
                    ? ' Auxins accumulate on the shaded side of the stem, causing those cells to elongate and bend the plant towards the light source.'
                    : ' Shoots show negative geotropism (grow away from gravity), while roots show positive geotropism (grow towards gravity).'}
              </div>
          )}
      </div>
    </div>
  );
}
