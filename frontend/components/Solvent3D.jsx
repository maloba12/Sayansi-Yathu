import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

const SUBSTANCES = [
  { id: 'salt', name: 'Common Salt', color: '#f8fafc', soluble: true, info: 'Dissolves to form a clear solution.' },
  { id: 'sugar', name: 'Sugar', color: '#ffffff', soluble: true, info: 'Dissolves completely.' },
  { id: 'sand', name: 'Sand', color: '#fde047', soluble: false, info: 'Insoluble; settles at the bottom.' },
  { id: 'oil', name: 'Cooking Oil', color: '#fbbf24', soluble: false, info: 'Insoluble; floats on top of water.' }
];

function SubstanceParticle({ active, soluble, color }) {
  return (
    <group>
       {[...Array(20)].map((_, i) => (
          <Sphere 
            key={i} 
            args={[0.03, 8, 8]} 
            position={[
              (Math.random() - 0.5) * 0.8,
              soluble ? (Math.random() - 0.5) * 0.8 : (color === '#fbbf24' ? 0.35 : -0.45),
              (Math.random() - 0.5) * 0.8
            ]}
          >
             <meshStandardMaterial color={color} transparent opacity={active ? 0.8 : 0} />
          </Sphere>
       ))}
    </group>
  );
}

export default function Solvent3D() {
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [isStirring, setIsStirring] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubstanceSelect = (sub) => {
    setSelectedSubstance(sub);
    setIsStirring(false);
    setShowResult(false);
  };

  const stir = () => {
    setIsStirring(true);
    setTimeout(() => {
      setIsStirring(false);
      setShowResult(true);
    }, 2000);
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Choose Substance:</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {SUBSTANCES.map(sub => (
            <button
              key={sub.id}
              onClick={() => handleSubstanceSelect(sub)}
              style={{
                padding: '10px',
                background: selectedSubstance?.id === sub.id ? '#3b82f6' : '#f1f5f9',
                color: selectedSubstance?.id === sub.id ? 'white' : '#1e293b',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      {selectedSubstance && (
        <button 
          onClick={stir}
          disabled={isStirring || showResult}
          style={{
            padding: '12px',
            background: isStirring ? '#94a3b8' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (isStirring || showResult) ? 'default' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isStirring ? '🌀 Stirring...' : '🥄 Stir Solution'}
        </button>
      )}

      {showResult && selectedSubstance && (
        <div style={{ padding: '15px', background: '#f0fdf4', borderRadius: '10px', borderLeft: '5px solid #10b981', animation: 'fadeIn 0.5s' }}>
           <div style={{ fontWeight: 'bold', color: '#166534', marginBottom: '5px' }}>
              {selectedSubstance.name} is {selectedSubstance.soluble ? 'Soluble' : 'Insoluble'}
           </div>
           <p style={{ fontSize: '0.85rem', margin: 0, color: '#475569' }}>{selectedSubstance.info}</p>
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );

  const theory = {
    formula: "Solute + Solvent = Solution",
    values: [
      { label: "Solvent", value: "Water (H₂O)" },
      { label: "Solute", value: selectedSubstance?.name || "None" },
      { label: "Result", value: showResult ? (selectedSubstance.soluble ? "Miscible" : "Immiscible") : "Pending" }
    ]
  };

  return (
    <ExperimentShell title="Solubility in Water" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 1, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Center top>
           {/* Beaker */}
           <group>
              <Cylinder args={[1, 1, 1.5, 32, 1, true]}>
                 <meshStandardMaterial color="#e0f2fe" transparent opacity={0.3} side={THREE.DoubleSide} />
              </Cylinder>
              <Cylinder args={[1, 1, 0.05]} position={[0, -0.75, 0]}>
                 <meshStandardMaterial color="#e0f2fe" transparent opacity={0.5} />
              </Cylinder>

              {/* Water */}
              <Cylinder args={[0.98, 0.98, 1]} position={[0, -0.25, 0]}>
                 <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} />
              </Cylinder>

              {/* Stirring Rod */}
              <Float speed={isStirring ? 10 : 0} rotationIntensity={0} floatIntensity={0.2}>
                 <Cylinder args={[0.03, 0.03, 2]} position={[0, 0.5, 0]} rotation={[0, 0, 0.1]}>
                    <meshStandardMaterial color="#94a3b8" />
                 </Cylinder>
              </Float>

              {/* Substances */}
              {selectedSubstance && !showResult && (
                 <group position={[0, 0.5, 0]}>
                    <Float speed={2} floatIntensity={0.5}>
                       <Sphere args={[0.1, 16, 16]}>
                          <meshStandardMaterial color={selectedSubstance.color} />
                       </Sphere>
                    </Float>
                 </group>
              )}

              {showResult && selectedSubstance && (
                <SubstanceParticle active={true} soluble={selectedSubstance.soluble} color={selectedSubstance.color} />
              )}
           </group>

           {/* Table */}
           <Box args={[6, 0.1, 4]} position={[0, -0.8, 0]}>
              <meshStandardMaterial color="#334155" />
           </Box>
        </Center>

        <OrbitControls makeDefault />
      </Canvas>
    </ExperimentShell>
  );
}
