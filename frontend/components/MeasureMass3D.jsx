import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

const OBJECTS = [
  { id: 'beaker', name: 'Beaker (Empty)', mass: 150 }, // g
  { id: 'stone', name: 'Granite Stone', mass: 425 },   // g
  { id: 'lead', name: 'Lead Block', mass: 850 },     // g
  { id: 'apple', name: 'Apple', mass: 180 }           // g
];

function TripleBeamBalance({ riders, beamAngle }) {
  const beamRef = useRef();

  useFrame((state, delta) => {
    if (beamRef.current) {
        // Smoothly rotate beam based on imbalance
        beamRef.current.rotation.z = THREE.MathUtils.lerp(beamRef.current.rotation.z, beamAngle, delta * 2);
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Base */}
      <Box args={[6, 0.5, 2]} position={[0, -0.25, 0]}>
        <meshStandardMaterial color="#334155" />
      </Box>
      <Box args={[1, 3, 1]} position={[2.5, 1.25, 0]}>
        <meshStandardMaterial color="#475569" />
      </Box>

      {/* Pivoting Beam */}
      <group ref={beamRef} position={[2.5, 2.5, 0]}>
        <Box args={[6, 0.2, 0.6]} position={[-2.5, 0, 0]}>
          <meshStandardMaterial color="#94a3b8" />
        </Box>
        
        {/* The Pan */}
        <group position={[-5, -1, 0]}>
           <Cylinder args={[1.2, 1.2, 0.1, 32]} position={[0, 0, 0]}>
             <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
           </Cylinder>
           {/* Pan Hanger */}
           <Cylinder args={[0.05, 0.05, 1]} position={[0, 0.5, 0]}>
             <meshStandardMaterial color="#475569" />
           </Cylinder>
        </group>

        {/* Riders (Visual indicators of the 3 beams) */}
        <group position={[-2, 0.2, 0]}>
           {/* 100g beam */}
           <Box args={[4, 0.05, 0.05]} position={[0, 0.1, 0.2]}>
              <meshStandardMaterial color="black" />
           </Box>
           <Box args={[0.2, 0.3, 0.1]} position={[2 - (riders.hundreds / 100 * 0.4), 0.1, 0.2]}>
              <meshStandardMaterial color="#ef4444" />
           </Box>

           {/* 10g beam */}
           <Box args={[4, 0.05, 0.05]} position={[0, 0, 0.2]}>
              <meshStandardMaterial color="black" />
           </Box>
           <Box args={[0.2, 0.3, 0.1]} position={[2 - (riders.tens / 10 * 0.4), 0, 0.2]}>
              <meshStandardMaterial color="#f59e0b" />
           </Box>

           {/* 1g beam */}
           <Box args={[4, 0.05, 0.05]} position={[0, -0.1, 0.2]}>
              <meshStandardMaterial color="black" />
           </Box>
           <Box args={[0.2, 0.3, 0.1]} position={[2 - (riders.ones / 10 * 0.4), -0.1, 0.2]}>
              <meshStandardMaterial color="#3b82f6" />
           </Box>
        </group>
      </group>

      {/* Pointer/Zero Mark */}
      <group position={[-3.5, 2.5, 0]}>
         <Box args={[0.1, 0.5, 0.1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="white" />
         </Box>
         <Text position={[0.3, 0, 0]} fontSize={0.1} color="white">ZERO</Text>
      </group>
    </group>
  );
}

export default function MeasureMass3D() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [riders, setRiders] = useState({ hundreds: 0, tens: 0, ones: 0 });
  const [beamAngle, setBeamAngle] = useState(0);

  const totalRiderMass = riders.hundreds + riders.tens + riders.ones;
  const objectMass = selectedObject ? selectedObject.mass : 0;

  useEffect(() => {
    // Calculate beam tilt: positive means pan is heavier, negative means riders are heavier
    const diff = objectMass - totalRiderMass;
    // Cap rotation to about 15 degrees (0.26 rad)
    const angle = THREE.MathUtils.clamp(diff * 0.002, -0.26, 0.26);
    setBeamAngle(angle);
  }, [objectMass, totalRiderMass]);

  const handleRiderChange = (type, value) => {
    setRiders(prev => ({ ...prev, [type]: parseFloat(value) }));
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Object to Weigh:</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {OBJECTS.map(obj => (
            <button
              key={obj.id}
              onClick={() => setSelectedObject(obj)}
              style={{
                padding: '10px',
                background: selectedObject?.id === obj.id ? '#3b82f6' : '#f1f5f9',
                color: selectedObject?.id === obj.id ? 'white' : '#1e293b',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {obj.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
         <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span>Hundreds Beam:</span> <strong>{riders.hundreds}g</strong>
            </label>
            <input type="range" min="0" max="500" step="100" value={riders.hundreds} onChange={(e) => handleRiderChange('hundreds', e.target.value)} style={{ width: '100%' }} />
         </div>
         <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span>Tens Beam:</span> <strong>{riders.tens}g</strong>
            </label>
            <input type="range" min="0" max="100" step="10" value={riders.tens} onChange={(e) => handleRiderChange('tens', e.target.value)} style={{ width: '100%' }} />
         </div>
         <div>
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span>Ones Beam:</span> <strong>{riders.ones.toFixed(1)}g</strong>
            </label>
            <input type="range" min="0" max="10" step="0.1" value={riders.ones} onChange={(e) => handleRiderChange('ones', e.target.value)} style={{ width: '100%' }} />
         </div>
      </div>

      <div style={{ textAlign: 'center', padding: '10px', background: Math.abs(beamAngle) < 0.01 ? '#dcfce7' : '#fee2e2', borderRadius: '6px' }}>
         <strong>Status:</strong> {Math.abs(beamAngle) < 0.01 ? '💎 Balanced!' : beamAngle > 0 ? '⬇️ Pan is Heavier' : '⬆️ Riders are Heavier'}
      </div>

      <button
        onClick={() => {
            setSelectedObject(null);
            setRiders({ hundreds: 0, tens: 0, ones: 0 });
        }}
        style={{ padding: '10px', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        🔄 Reset Balance
      </button>
    </div>
  );

  const theory = {
    formula: "Mass_Object = Sum(Rider_Values)",
    values: [
      { label: "Selected Object", value: selectedObject ? selectedObject.name : "None" },
      { label: "Total Settings", value: `${totalRiderMass.toFixed(1)} g` },
      { label: "Balance Status", value: Math.abs(beamAngle) < 0.01 ? "Horizontal" : "Tilted" }
    ]
  };

  return (
    <ExperimentShell title="Measurement of Mass" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [5, 4, 8], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        
        <Center top>
          <TripleBeamBalance riders={riders} beamAngle={beamAngle} />
          
          {/* Object on Pan if selected */}
          {selectedObject && (
            <group position={[-2.5, 1.5, 0]}>
               <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                  {selectedObject.id === 'beaker' && (
                    <Cylinder args={[0.5, 0.5, 1]} position={[0, 0, 0]}>
                       <meshStandardMaterial color="#bae6fd" transparent opacity={0.6} />
                    </Cylinder>
                  )}
                  {selectedObject.id === 'stone' && (
                    <Sphere args={[0.4]} position={[0, 0, 0]}>
                       <meshStandardMaterial color="#4b5563" roughness={1} />
                    </Sphere>
                  )}
                  {selectedObject.id === 'lead' && (
                    <Box args={[0.6, 0.6, 0.6]} position={[0, 0, 0]}>
                       <meshStandardMaterial color="#1f2937" metalness={0.9} />
                    </Box>
                  )}
                  {selectedObject.id === 'apple' && (
                    <Sphere args={[0.4]} position={[0, 0, 0]}>
                       <meshStandardMaterial color="#ef4444" />
                    </Sphere>
                  )}
               </Float>
            </group>
          )}
        </Center>

        <OrbitControls />
      </Canvas>
    </ExperimentShell>
  );
}
