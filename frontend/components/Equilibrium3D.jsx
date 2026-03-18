import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Html, Center, Cone } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

function EquilibriumObject({ type, position, nudgeForce, onTopple }) {
  const meshRef = useRef();
  const [rotation, setRotation] = useState(0);
  const [isToppled, setIsToppled] = useState(false);

  // Simple physics: If nudge > threshold, topple
  useEffect(() => {
    if (nudgeForce > 0) {
      let threshold = 3; // Stable
      if (type === 'apex') threshold = 0.5; // Unstable
      if (type === 'side') threshold = 10;   // Neutral (hard to topple, just rolls)

      if (nudgeForce > threshold) {
        setIsToppled(true);
        onTopple(type);
      }
    }
  }, [nudgeForce, type]);

  useFrame((state, delta) => {
    if (isToppled && meshRef.current) {
      const targetRot = Math.PI / 2;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRot, delta * 3);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, delta * 3);
    }
  });

  return (
    <group position={position} ref={meshRef}>
      {type === 'base' && (
        <Cone args={[0.8, 1.5, 32]} position={[0, 0.75, 0]}>
          <meshStandardMaterial color="#22c55e" transparent opacity={0.7} />
          <Sphere args={[0.05]} position={[0, -0.4, 0]}>
            <meshStandardMaterial color="red" />
          </Sphere>
        </Cone>
      )}
      {type === 'apex' && (
        <Cone args={[0.8, 1.5, 32]} position={[0, 0.75, 0]} rotation={[Math.PI, 0, 0]}>
          <meshStandardMaterial color="#f59e0b" transparent opacity={0.7} />
          <Sphere args={[0.05]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="red" />
          </Sphere>
        </Cone>
      )}
      {type === 'side' && (
        <Cone args={[0.8, 1.5, 32]} position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.7} />
          <Sphere args={[0.05]} position={[0, 0, 0]}>
            <meshStandardMaterial color="red" />
          </Sphere>
        </Cone>
      )}
      <Text position={[0, 1.8, 0]} fontSize={0.2} color="black">
        {type.toUpperCase()}
      </Text>
    </group>
  );
}

export default function Equilibrium3D() {
  const [nudge, setNudge] = useState(0);
  const [toppledStates, setToppledStates] = useState({ base: false, apex: false, side: false });
  const [appliedForce, setAppliedForce] = useState(0);

  const handleTopple = (type) => {
    setToppledStates(prev => ({ ...prev, [type]: true }));
  };

  const applyForce = () => {
    setAppliedForce(nudge);
    // Reset applied force after a short delay to allow re-nudging
    setTimeout(() => setAppliedForce(0), 100);
  };

  const reset = () => {
    setToppledStates({ base: false, apex: false, side: false });
    setAppliedForce(0);
    setNudge(0);
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
           Nudge Force: <strong>{nudge.toFixed(1)} N</strong>
        </label>
        <input 
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={nudge}
          onChange={(e) => setNudge(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <button 
        onClick={applyForce}
        style={{ padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        👆 Nudge Objects
      </button>

      <div style={{ marginTop: '10px' }}>
         <h4 style={{ marginBottom: '8px' }}>Status:</h4>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ padding: '8px', borderRadius: '4px', background: toppledStates.base ? '#fee2e2' : '#dcfce7', fontSize: '0.85rem' }}>
               Stable (Base): {toppledStates.base ? '❌ Toppled' : '✅ Balanced'}
            </div>
            <div style={{ padding: '8px', borderRadius: '4px', background: toppledStates.apex ? '#fee2e2' : '#fef9c3', fontSize: '0.85rem' }}>
               Unstable (Apex): {toppledStates.apex ? '❌ Toppled' : '⚠️ Precarious'}
            </div>
            <div style={{ padding: '8px', borderRadius: '4px', background: toppledStates.side ? '#fee2e2' : '#dcfce7', fontSize: '0.85rem' }}>
               Neutral (Side): {toppledStates.side ? '❌ Moved' : '✅ Steady'}
            </div>
         </div>
      </div>

      <button 
        onClick={reset}
        style={{ padding: '10px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        🔄 Reset Objects
      </button>
    </div>
  );

  const theory = {
    formula: "Stability Logic",
    values: [
      { label: "CoM Indicator", value: "Red Sphere" },
      { label: "Stable", value: "CoM is low" },
      { label: "Unstable", value: "CoM is high" }
    ]
  };

  return (
    <ExperimentShell title="States of Equilibrium" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        
        <Center top>
           {/* Table */}
           <Box args={[6, 0.1, 3]} position={[0, -0.05, 0]} receiveShadow>
             <meshStandardMaterial color="#94a3b8" />
           </Box>

           <EquilibriumObject type="base" position={[-2, 0, 0]} nudgeForce={appliedForce} onTopple={handleTopple} />
           <EquilibriumObject type="apex" position={[0, 0, 0]} nudgeForce={appliedForce} onTopple={handleTopple} />
           <EquilibriumObject type="side" position={[2, 0, 0]} nudgeForce={appliedForce} onTopple={handleTopple} />
        </Center>

        <OrbitControls enablePan={false} />
      </Canvas>
    </ExperimentShell>
  );
}
