import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

function SteamParticles({ intensity }) {
  const points = useRef();
  const count = 100;
  
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = Math.random() * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current || intensity === 0) return;
    const array = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
       array[i * 3 + 1] += delta * intensity; // Rise up
       if (array[i * 3 + 1] > 2) {
          array[i * 3 + 1] = 0;
          array[i * 3] = (Math.random() - 0.5) * 0.8;
          array[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
       }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="white" transparent opacity={0.4} />
    </points>
  );
}

export default function Evaporation3D() {
  const [heat, setHeat] = useState(0);
  const [waterLevel, setWaterLevel] = useState(1); // 1 to 0
  const [isBurning, setIsBurning] = useState(false);

  useFrame((state, delta) => {
    if (isBurning && heat > 0) {
      setWaterLevel(prev => Math.max(0, prev - (delta * heat * 0.01)));
    }
  });

  const reset = () => {
     setWaterLevel(1);
     setIsBurning(false);
     setHeat(0);
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <button 
        onClick={() => setIsBurning(!isBurning)}
        style={{
          padding: '12px',
          background: isBurning ? '#ef4444' : '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        {isBurning ? '⏹️ Extinguish Burner' : '🔥 Light Bunsen Burner'}
      </button>

      {isBurning && (
        <div style={{ padding: '12px', background: '#fff7ed', borderRadius: '8px', border: '1px solid #ffedd5' }}>
           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Heat Intensity:</label>
           <input 
             type="range"
             min="0"
             max="10"
             step="1"
             value={heat}
             onChange={(e) => setHeat(parseInt(e.target.value))}
             style={{ width: '100%' }}
           />
        </div>
      )}

      <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
         <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Solution Volume:</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{(waterLevel * 50).toFixed(1)} mL</div>
         </div>
         <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${waterLevel * 100}%`, height: '100%', background: '#3b82f6', transition: 'width 0.1s' }} />
         </div>
      </div>

      {waterLevel === 0 && (
         <div style={{ padding: '10px', background: '#dcfce7', color: '#166534', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }}>
            💎 Salt Crystals Formed!
         </div>
      )}

      <button onClick={reset} style={{ padding: '8px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '6px' }}>
         🔄 Reset Experiment
      </button>
    </div>
  );

  const theory = {
    formula: "Liquid + Heat → Gas + Solid Residual",
    values: [
      { label: "Solvent", value: "Water (H₂O)" },
      { label: "Solute", value: "Common Salt (NaCl)" },
      { label: "Technique", value: "Evaporation to Dryness" }
    ]
  };

  return (
    <ExperimentShell title="Separation by Evaporation" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        
        <Center top>
           {/* Tripod Stand */}
           <group position={[0, -0.5, 0]}>
              <Cylinder args={[0.8, 0.8, 0.05]} position={[0, 1.2, 0]}>
                 <meshStandardMaterial color="#475569" />
              </Cylinder>
              <Cylinder args={[0.05, 0.05, 1.2]} position={[0.5, 0.6, 0.5]}>
                 <meshStandardMaterial color="#475569" />
              </Cylinder>
              <Cylinder args={[0.05, 0.05, 1.2]} position={[-0.5, 0.6, 0.5]}>
                 <meshStandardMaterial color="#475569" />
              </Cylinder>
              <Cylinder args={[0.05, 0.05, 1.2]} position={[0, 0.6, -0.7]}>
                 <meshStandardMaterial color="#475569" />
              </Cylinder>
           </group>

           {/* Bunsen Burner */}
           <group position={[0, -0.5, 0]}>
              <Cylinder args={[0.4, 0.4, 0.1]} position={[0, 0.05, 0]}>
                 <meshStandardMaterial color="#1e293b" />
              </Cylinder>
              <Cylinder args={[0.08, 0.08, 0.6]} position={[0, 0.4, 0]}>
                 <meshStandardMaterial color="#94a3b8" />
              </Cylinder>
              {isBurning && (
                <Float speed={10} rotationIntensity={0} floatIntensity={0.5}>
                   <Cylinder args={[0, 0.15, 0.4]} position={[0, 0.8, 0]}>
                      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} transparent opacity={0.6} />
                   </Cylinder>
                </Float>
              )}
           </group>

           {/* Evaporating Dish */}
           <group position={[0, 0.8, 0]}>
              <Sphere args={[0.7, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} rotation={[Math.PI, 0, 0]}>
                 <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
              </Sphere>
              
              {/* Solution / Water */}
              {waterLevel > 0.01 && (
                <Cylinder 
                  args={[0.65, 0.5, 0.3 * waterLevel]} 
                  position={[0, -0.15 + (0.15 * waterLevel), 0]}
                >
                   <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
                </Cylinder>
              )}

              {/* Salt Crystals (appear as water level drops) */}
              <group position={[0, -0.15, 0]}>
                 {[...Array(12)].map((_, i) => (
                    <Box 
                      key={i} 
                      args={[0.1, 0.1, 0.1]} 
                      position={[(Math.random() - 0.5) * 0.8, 0, (Math.random() - 0.5) * 0.8]}
                      scale={1 - waterLevel}
                      visible={waterLevel < 0.8}
                    >
                       <meshStandardMaterial color="white" roughness={0} metalness={0.2} />
                    </Box>
                 ))}
              </group>

              {/* Steam Particles */}
              <group position={[0, 0.2, 0]}>
                 <SteamParticles intensity={heat / 2} />
              </group>
           </group>
        </Center>

        <OrbitControls makeDefault />
      </Canvas>
    </ExperimentShell>
  );
}
