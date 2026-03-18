import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

const HAZARDS = [
  { id: 'toxic', name: 'Toxic', icon: '💀', color: '#1e293b', info: 'Can cause death if swallowed or inhaled.', example: 'Mercury' },
  { id: 'flammable', name: 'Flammable', icon: '🔥', color: '#ef4444', info: 'Catches fire easily. Keep away from heat.', example: 'Ethanol' },
  { id: 'corrosive', name: 'Corrosive', icon: '🧪', color: '#6366f1', info: 'Attacks and destroys living tissues.', example: 'Sulfuric Acid' },
  { id: 'oxidizing', name: 'Oxidizing', icon: '⭕', color: '#f59e0b', info: 'Provides oxygen for fires to burn.', example: 'Potassium Manganate' }
];

function HazardSign({ hazard, isSelected, onClick }) {
  const rotation = isSelected ? [0, Math.PI * 2, 0] : [0, 0, 0];
  
  return (
    <group position={hazard.pos} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <Float speed={isSelected ? 4 : 1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Box args={[0.8, 0.8, 0.1]}>
          <meshStandardMaterial color={hazard.color} metalness={0.5} roughness={0.2} />
        </Box>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {hazard.icon}
        </Text>
      </Float>
      <Text position={[0, -0.6, 0]} fontSize={0.15} color="#475569">
        {hazard.name}
      </Text>
    </group>
  );
}

export default function ChemSafety3D() {
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [ppeEquipped, setPpeEquipped] = useState({ glasses: false, gloves: false, coat: false });
  const [showInfo, setShowInfo] = useState(false);

  const togglePpe = (item) => {
    setPpeEquipped(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const hazardList = HAZARDS.map((h, i) => ({
    ...h,
    pos: [i * 1.5 - 2.25, 1.5, 0]
  }));

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Wear PPE:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['glasses', 'gloves', 'coat'].map(item => (
            <button
              key={item}
              onClick={() => togglePpe(item)}
              style={{
                flex: 1,
                padding: '10px',
                background: ppeEquipped[item] ? '#22c55e' : '#f1f5f9',
                color: ppeEquipped[item] ? 'white' : '#1e293b',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textTransform: 'capitalize'
              }}
            >
              {ppeEquipped[item] ? '✔️' : '➕'} {item}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>Hazard Awareness:</h4>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>Click signs in the scene for details.</p>
        
        {selectedHazard && (
          <div style={{ padding: '10px', background: selectedHazard.color + '22', borderRadius: '6px', borderLeft: `4px solid ${selectedHazard.color}`, animation: 'slideIn 0.3s ease' }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#1e293b' }}>{selectedHazard.name}</div>
            <p style={{ fontSize: '0.8rem', margin: '5px 0' }}>{selectedHazard.info}</p>
            <div style={{ fontSize: '0.75rem', color: '#475569' }}><strong>Example:</strong> {selectedHazard.example}</div>
          </div>
        )}
      </div>

      <div style={{ padding: '10px', background: '#fefce8', borderRadius: '6px', border: '1px solid #fef08a', fontSize: '0.85rem' }}>
         <strong>Rules:</strong><br/>
         1. No Eating/Drinking in the lab.<br/>
         2. Always follow instructions.<br/>
         3. Label all containers.
      </div>
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );

  const theory = {
    formula: "Safety Compliance",
    values: [
      { label: "PPE Status", value: Object.values(ppeEquipped).filter(v => v).length + "/3" },
      { label: "Hazards Verified", value: selectedHazard ? "Active" : "Select Sign" },
      { label: "Protocol", value: "Safety First!" }
    ]
  };

  return (
    <ExperimentShell title="Chemistry Laboratory Safety" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 1, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        
        <Center top>
           {/* Shelves for hazards */}
           <Box args={[6, 0.1, 1]} position={[0, 1, -0.5]}>
              <meshStandardMaterial color="#475569" />
           </Box>

           {hazardList.map(h => (
             <HazardSign
               key={h.id}
               hazard={h}
               isSelected={selectedHazard?.id === h.id}
               onClick={() => setSelectedHazard(h)}
             />
           ))}

           {/* Workbench with PPE */}
           <Box args={[6, 0.1, 2]} position={[0, 0, 1]}>
              <meshStandardMaterial color="#cbd5e1" />
           </Box>

           {/* Representing the student with PPE */}
           <group position={[0, 1, 3]}>
              {/* Lab Coat */}
              {ppeEquipped.coat && (
                <Cylinder args={[0.8, 1, 2, 32]} position={[0, -0.2, 0]}>
                   <meshStandardMaterial color="white" />
                </Cylinder>
              )}
              {/* Head */}
              <Sphere args={[0.4, 32, 32]} position={[0, 1, 0]}>
                 <meshStandardMaterial color="#ffedd5" />
              </Sphere>
              {/* Safety Glasses */}
              {ppeEquipped.glasses && (
                <Box args={[0.6, 0.15, 0.2]} position={[0, 1, 0.35]}>
                   <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
                </Box>
              )}
              {/* Gloves */}
              {ppeEquipped.gloves && (
                 <group>
                    <Box args={[0.2, 0.5, 0.2]} position={[-1, -0.2, 0]}>
                        <meshStandardMaterial color="#93c5fd" />
                    </Box>
                    <Box args={[0.2, 0.5, 0.2]} position={[1, -0.2, 0]}>
                        <meshStandardMaterial color="#93c5fd" />
                    </Box>
                 </group>
              )}
           </group>
        </Center>

        <OrbitControls makeDefault />
      </Canvas>
    </ExperimentShell>
  );
}
