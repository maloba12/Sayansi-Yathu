import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

const APPARATUS = [
  { 
    id: 'beaker', name: 'Beaker', position: [-3, 0.5, 0], 
    use: 'Mixing, stirring, and heating liquids.', capacity: '250 mL', safety: 'Do not fill to the brim.' 
  },
  { 
    id: 'conical', name: 'Conical Flask', position: [-1.5, 0.5, 0], 
    use: 'Swirling liquids without risk of spillage.', capacity: '100 mL', safety: 'Use a cork or stopper if needed.' 
  },
  { 
    id: 'testtube', name: 'Test Tube', position: [0, 0.5, 0], 
    use: 'Holding or heating small amounts of substances.', capacity: '10 mL', safety: 'Always point away from yourself when heating.' 
  },
  { 
    id: 'cylinder', name: 'Measuring Cylinder', position: [1.5, 0.8, 0], 
    use: 'Measuring precise volumes of liquids.', capacity: '50 mL', safety: 'Read at the bottom of the meniscus.' 
  },
  { 
    id: 'evaporating', name: 'Evaporating Dish', position: [3, 0.2, 0], 
    use: 'Evaporating excess solvents (liquid) to produce a solid.', capacity: '50 mL', safety: 'Gets very hot when used with a burner.' 
  },
  { 
    id: 'tripod', name: 'Tripod & Gauze', position: [-2, 0, 2], 
    use: 'Standing as a support for containers being heated.', capacity: 'N/A', safety: 'Ensure legs are stable.' 
  },
  { 
    id: 'burner', name: 'Bunsen Burner', position: [0, 0.3, 2], 
    use: 'Providing a controlled open flame for heating.', capacity: 'N/A', safety: 'Light with a striker, never a lighter.' 
  },
  { 
    id: 'filter', name: 'Filter Funnel', position: [2, 0.5, 2], 
    use: 'Guiding liquid or fine-grained substances into containers.', capacity: 'N/A', safety: 'Check for cracks.' 
  }
];

function ModelWrapper({ item, isSelected, onClick }) {
  const color = isSelected ? '#fbbf24' : '#e2e8f0';
  
  return (
    <group position={item.position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <Float speed={isSelected ? 3 : 0} rotationIntensity={0.2} floatIntensity={0.2}>
         {item.id === 'beaker' && (
           <Cylinder args={[0.5, 0.5, 1, 32, 1, true]}>
             <meshStandardMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
           </Cylinder>
         )}
         {item.id === 'conical' && (
           <Cylinder args={[0.2, 0.6, 1, 32, 1, true]}>
             <meshStandardMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
           </Cylinder>
         )}
         {item.id === 'testtube' && (
           <Cylinder args={[0.15, 0.15, 1, 32, 1, true]}>
             <meshStandardMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
           </Cylinder>
         )}
         {item.id === 'cylinder' && (
           <Cylinder args={[0.25, 0.25, 1.8, 32, 1, true]}>
             <meshStandardMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
           </Cylinder>
         )}
         {item.id === 'evaporating' && (
            <Sphere args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]}>
               <meshStandardMaterial color="#cbd5e1" side={THREE.DoubleSide} />
            </Sphere>
         )}
         {item.id === 'tripod' && (
            <group>
               <Cylinder args={[0.6, 0.6, 0.05]} position={[0, 0.8, 0]}>
                  <meshStandardMaterial color="#475569" />
               </Cylinder>
               <Cylinder args={[0.05, 0.05, 0.8]} position={[0.4, 0.4, 0.4]}>
                  <meshStandardMaterial color="#475569" />
               </Cylinder>
               <Cylinder args={[0.05, 0.05, 0.8]} position={[-0.4, 0.4, 0.4]}>
                  <meshStandardMaterial color="#475569" />
               </Cylinder>
               <Cylinder args={[0.05, 0.05, 0.8]} position={[0, 0.4, -0.6]}>
                  <meshStandardMaterial color="#475569" />
               </Cylinder>
            </group>
         )}
         {item.id === 'burner' && (
            <group>
               <Cylinder args={[0.4, 0.4, 0.1]} position={[0, -0.2, 0]}>
                  <meshStandardMaterial color="#1e293b" />
               </Cylinder>
               <Cylinder args={[0.1, 0.1, 0.8]} position={[0, 0.3, 0]}>
                  <meshStandardMaterial color="#94a3b8" />
               </Cylinder>
            </group>
         )}
         {item.id === 'filter' && (
            <group>
               <Cylinder args={[0.5, 0.05, 0.6]} position={[0, 0.3, 0]}>
                  <meshStandardMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
               </Cylinder>
               <Cylinder args={[0.05, 0.05, 0.4]} position={[0, -0.2, 0]}>
                  <meshStandardMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
               </Cylinder>
            </group>
         )}
      </Float>
      <Text position={[0, -0.5, 0.5]} fontSize={0.15} color="#64748b">
        {item.name}
      </Text>
    </group>
  );
}

export default function ChemApparatus3D() {
  const [selectedId, setSelectedId] = useState(APPARATUS[0].id);
  const selectedItem = APPARATUS.find(a => a.id === selectedId);

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Apparatus:</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {APPARATUS.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              style={{
                padding: '8px',
                background: selectedId === item.id ? '#3b82f6' : '#f1f5f9',
                color: selectedId === item.id ? 'white' : '#1e293b',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textAlign: 'left'
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div style={{ padding: '15px', background: '#f0f9ff', borderRadius: '10px', borderLeft: '5px solid #3b82f6', animation: 'fadeIn 0.3s ease-in' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>{selectedItem.name}</h3>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}><strong>Use:</strong> {selectedItem.use}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
            <span>Capacity: {selectedItem.capacity}</span>
          </div>
          <div style={{ marginTop: '10px', padding: '8px', background: '#fee2e2', borderRadius: '4px', fontSize: '0.8rem', color: '#991b1b' }}>
            ⚠️ <strong>Safety:</strong> {selectedItem.safety}
          </div>
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );

  const theory = {
    formula: "Apparatus Identification",
    values: [
      { label: "Items on Bench", value: APPARATUS.length },
      { label: "Selected", value: selectedItem?.name || "None" },
      { label: "Objective", value: "Memorize names & uses" }
    ]
  };

  return (
    <ExperimentShell title="Chemistry Apparatus Identification" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 4, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        
        <Center top>
          {/* Lab Bench */}
          <Box args={[12, 0.2, 8]} position={[0, -0.1, 0]} receiveShadow>
            <meshStandardMaterial color="#334155" />
          </Box>
          <Box args={[12, 0.1, 8]} position={[0, -0.2, 0]}>
             <meshStandardMaterial color="#1e293b" />
          </Box>

          {APPARATUS.map(item => (
            <ModelWrapper
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onClick={() => setSelectedId(item.id)}
            />
          ))}
        </Center>

        <OrbitControls makeDefault />
      </Canvas>
    </ExperimentShell>
  );
}
