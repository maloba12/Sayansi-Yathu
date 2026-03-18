import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Plane, Text, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

function LabEnvironment() {
  return (
    <>
      {/* Floor */}
      <Plane rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} args={[20, 20]} receiveShadow>
        <meshStandardMaterial color="#f1f5f9" />
      </Plane>
      
      {/* Walls */}
      <Plane position={[0, 3, -10]} args={[20, 10]} receiveShadow>
        <meshStandardMaterial color="#e2e8f0" />
      </Plane>
      <Plane position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]} args={[20, 10]} receiveShadow>
        <meshStandardMaterial color="#e2e8f0" />
      </Plane>
      
      {/* Workbench */}
      <Box position={[0, -1, 0]} args={[6, 2, 3]} castShadow receiveShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
      <Box position={[0, 0.1, 0]} args={[6.2, 0.2, 3.2]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e293b" />
      </Box>

      {/* Waste Bins */}
      <group position={[4, -1, 4]}>
        <Cylinder args={[0.5, 0.5, 1.5]} position={[-1.5, 0, 0]}>
          <meshStandardMaterial color="#ef4444" /> {/* Radioactive/Biohazard */}
          <Text position={[0, 1, 0]} fontSize={0.2} color="black">Hazardous</Text>
        </Cylinder>
        <Cylinder args={[0.5, 0.5, 1.5]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#3b82f6" /> {/* Chemical */}
          <Text position={[0, 1, 0]} fontSize={0.2} color="black">Chemical</Text>
        </Cylinder>
        <Cylinder args={[0.5, 0.5, 1.5]} position={[1.5, 0, 0]}>
          <meshStandardMaterial color="#64748b" /> {/* General */}
          <Text position={[0, 1, 0]} fontSize={0.2} color="black">General</Text>
        </Cylinder>
      </group>
    </>
  );
}

function FireSuppression({ active, position }) {
  const pointsRef = useRef();
  
  useFrame((state, delta) => {
    if (active && pointsRef.current) {
      pointsRef.current.rotation.y += delta * 5;
      pointsRef.current.position.y += delta * 2;
      if (pointsRef.current.position.y > 2) pointsRef.current.position.y = 0;
    }
  });

  if (!active) return null;

  return (
    <group position={position}>
      <Points ref={pointsRef}>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
      </Points>
    </group>
  );
}

// Simple Points proxy since basic Three.js Points might be needed
function Points({ children, ...props }) {
  return <group {...props}>{children}</group>;
}

function Fire({ position, intensity }) {
  return (
    <group position={position} scale={[intensity, intensity, intensity]}>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.3, 16, 16]}>
          <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={2} />
        </Sphere>
      </Float>
    </group>
  );
}

export default function LabSafety3D() {
  const [safetyScore, setSafetyScore] = useState(100);
  const [checklist, setChecklist] = useState({
    ppe: false,
    chemicalDisposed: false,
    fireExtinguished: false,
  });
  const [isExtinguishing, setIsExtinguishing] = useState(false);
  const [fireIntensity, setFireIntensity] = useState(1.0);
  const [message, setMessage] = useState("Equip PPE to start the lab safely.");

  const handlePPEEquip = () => {
    setChecklist(prev => ({ ...prev, ppe: true }));
    setMessage("PPE Equipped. A chemical spill has occurred! Click the blue Chemical Bin to clean it up.");
  };

  const handleChemicalClean = () => {
    if (!checklist.ppe) {
      setSafetyScore(prev => Math.max(0, prev - 20));
      setMessage("Warning! You handled chemicals without PPE. -20 Safety Points.");
    } else {
      setChecklist(prev => ({ ...prev, chemicalDisposed: true }));
      setMessage("Spill cleaned! A small fire started on the bench. Click and hold the Extinguish button.");
    }
  };

  const handleExtinguish = () => {
    if (checklist.chemicalDisposed && fireIntensity > 0) {
      setIsExtinguishing(true);
      const interval = setInterval(() => {
        setFireIntensity(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            setIsExtinguishing(false);
            setChecklist(c => ({ ...c, fireExtinguished: true }));
            setMessage("Fire out! Lab is safe. Protocol complete.");
            return 0;
          }
          return prev - 0.05;
        });
      }, 100);
    }
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <button 
        onClick={handlePPEEquip}
        disabled={checklist.ppe}
        style={{ padding: '12px', background: checklist.ppe ? '#22c55e' : '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >
        {checklist.ppe ? '✅ Goggles & Coat On' : '👕 Equip PPE'}
      </button>

      <button 
        onClick={handleChemicalClean}
        disabled={checklist.chemicalDisposed}
        style={{ padding: '12px', background: checklist.chemicalDisposed ? '#22c55e' : '#f59e0b', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >
        🗑️ Dispose Chemical Spill
      </button>

      <button 
        onMouseDown={handleExtinguish}
        onMouseUp={() => setIsExtinguishing(false)}
        onMouseLeave={() => setIsExtinguishing(false)}
        disabled={checklist.fireExtinguished || !checklist.chemicalDisposed}
        style={{ padding: '12px', background: checklist.fireExtinguished ? '#22c55e' : '#ef4444', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >
        🧯 Use Extinguisher
      </button>

      <div style={{ marginTop: '10px', padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.9rem', color: '#475569', borderLeft: '4px solid #3b82f6' }}>
        <strong>Current Status:</strong> {message}
      </div>
    </div>
  );

  const theory = {
    formula: "Safety Protocol Compliance",
    values: [
      { label: "Safety Score", value: `${safetyScore}%` },
      { label: "PPE Status", value: checklist.ppe ? "Equipped" : "Missing" },
      { label: "Fire Intensity", value: `${(fireIntensity * 100).toFixed(0)}%` }
    ]
  };

  return (
    <ExperimentShell title="Lab Safety & Waste Management" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [8, 5, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} castShadow intensity={1} />
        <LabEnvironment />
        
        {/* Chemical Spill on bench */}
        {!checklist.chemicalDisposed && (
          <mesh position={[0, 0.25, 1]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 32]} />
            <meshStandardMaterial color="#22c55e" emissive="#166534" />
          </mesh>
        )}

        {/* Fire on bench */}
        {checklist.chemicalDisposed && !checklist.fireExtinguished && (
          <Fire position={[2, 0.5, 0]} intensity={fireIntensity} />
        )}

        {/* Extinguisher effects */}
        {isExtinguishing && (
          <FireSuppression active={true} position={[2, 0.5, 0]} />
        )}

        <OrbitControls makeDefault />
      </Canvas>
    </ExperimentShell>
  );
}
