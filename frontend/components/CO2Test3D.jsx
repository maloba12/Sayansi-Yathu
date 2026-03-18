import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

function GasBubbles({ count = 20, active, speed = 1, color = "white" }) {
  const group = useRef();
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.2,
      y: Math.random() * 1.5,
      z: (Math.random() - 0.5) * 0.2,
      s: 0.2 + Math.random() * 0.5
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (!active || !group.current) return;
    group.current.children.forEach((child, i) => {
      child.position.y += delta * speed * particles[i].s;
      if (child.position.y > 1.2) child.position.y = -0.5;
    });
  });

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <Sphere key={i} args={[0.02, 8, 8]} position={[p.x, p.y, p.z]}>
          <meshStandardMaterial color={color} transparent opacity={0.6} />
        </Sphere>
      ))}
    </group>
  );
}

function CO2Logic({ isReacting, progress, setProgress }) {
  useFrame((state, delta) => {
    if (isReacting && progress < 1) {
      setProgress(prev => Math.min(1, prev + delta * 0.1));
    }
  });
  return null;
}

export default function CO2Test3D() {
  const [isReacting, setIsReacting] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1

  const reset = () => {
    setIsReacting(false);
    setProgress(0);
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <button 
        onClick={() => setIsReacting(true)}
        disabled={isReacting}
        style={{
          padding: '12px',
          background: isReacting ? '#94a3b8' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isReacting ? 'default' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        🧪 Add Hydrochloric Acid (HCl)
      </button>

      <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
         <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Reaction Status:</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{progress < 1 ? (isReacting ? 'Reacting...' : 'Ready') : 'Complete'}</span>
         </div>
         <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress * 100}%`, height: '100%', background: '#10b981', transition: 'width 0.1s' }} />
         </div>
         
         {progress > 0.3 && (
            <div style={{ marginTop: '10px', padding: '8px', background: `rgba(255,255,255,${progress})`, border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'center' }}>
               <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Limewater Condition:</div>
               <div style={{ fontWeight: 'bold', color: progress > 0.8 ? '#475569' : '#1e293b' }}>
                  {progress > 0.8 ? '⚪ Milky/Turbid' : progress > 0.4 ? '⛅ Cloudy' : '💧 Clear'}
               </div>
            </div>
         )}
      </div>

      <button onClick={reset} style={{ padding: '8px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '6px' }}>
         🔄 Reset Experiment
      </button>
    </div>
  );

  const theory = {
    formula: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂",
    values: [
      { label: "Gas Produced", value: "Carbon Dioxide" },
      { label: "Test Reagent", value: "Limewater (Ca(OH)₂)" },
      { label: "Observation", value: "Formation of Chalk (CaCO₃)" }
    ]
  };

  return (
    <ExperimentShell title="Test for Carbon Dioxide" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 1.5, 6], fov: 45 }}>
        <CO2Logic isReacting={isReacting} progress={progress} setProgress={setProgress} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        
        <Center top>
           {/* Left Test Tube (Reaction) */}
           <group position={[-1.5, 0, 0]}>
              <Cylinder args={[0.3, 0.3, 2, 32, 1, true]}>
                 <meshStandardMaterial color="#e2e8f0" transparent opacity={0.3} side={THREE.DoubleSide} />
              </Cylinder>
              {/* Solution */}
              <Cylinder args={[0.28, 0.28, 0.8]} position={[0, -0.6, 0]}>
                 <meshStandardMaterial color="#3b82f6" transparent opacity={0.4} />
              </Cylinder>
              {/* Marble Chips */}
              <group position={[0, -0.9, 0]}>
                 {[...Array(5)].map((_, i) => (
                    <Box key={i} args={[0.15, 0.15, 0.15]} position={[(Math.random()-0.5)*0.3, 0, (Math.random()-0.5)*0.3]}>
                       <meshStandardMaterial color="#cbd5e1" />
                    </Box>
                 ))}
              </group>
              <GasBubbles active={isReacting && progress < 1} count={15} />
           </group>

           {/* Right Test Tube (Indication) */}
           <group position={[1.5, 0, 0]}>
              <Cylinder args={[0.3, 0.3, 2, 32, 1, true]}>
                 <meshStandardMaterial color="#e2e8f0" transparent opacity={0.3} side={THREE.DoubleSide} />
              </Cylinder>
              {/* Limewater Solution (Changes color) */}
              <Cylinder args={[0.28, 0.28, 0.8]} position={[0, -0.6, 0]}>
                 <meshStandardMaterial 
                   color={progress > 0.4 ? "#f1f5f9" : "#e0f2fe"} 
                   transparent 
                   opacity={progress > 0.4 ? 0.6 + progress * 0.4 : 0.4} 
                 />
              </Cylinder>
              <GasBubbles active={isReacting && progress > 0.2 && progress < 1} count={10} speed={0.5} />
           </group>

           {/* Delivery Tube */}
           <group>
              <Cylinder args={[0.05, 0.05, 3]} position={[0, 1.1, 0]} rotation={[0, 0, Math.PI/2]}>
                 <meshStandardMaterial color="#94a3b8" />
              </Cylinder>
              <Cylinder args={[0.05, 0.05, 0.5]} position={[-1.5, 0.8, 0]}>
                 <meshStandardMaterial color="#94a3b8" />
              </Cylinder>
              <Cylinder args={[0.05, 0.05, 0.8]} position={[1.5, 0.7, 0]}>
                 <meshStandardMaterial color="#94a3b8" />
              </Cylinder>
           </group>

           {/* Bench */}
           <Box args={[6, 0.1, 2]} position={[0, -1.05, 0]}>
              <meshStandardMaterial color="#334155" />
           </Box>
        </Center>

        <OrbitControls makeDefault />
      </Canvas>
    </ExperimentShell>
  );
}
