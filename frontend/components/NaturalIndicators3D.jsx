import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

const SAMPLES = [
  { id: 'lemon', name: 'Lemon Juice', initialColor: '#fef08a', type: 'Acid', ph: 2.5, finalColor: '#f43f5e' }, // Pinkish Red
  { id: 'water', name: 'Distilled Water', initialColor: '#e0f2fe', type: 'Neutral', ph: 7.0, finalColor: '#a855f7' }, // Purple
  { id: 'soap', name: 'Soap Solution', initialColor: '#f1f5f9', type: 'Base', ph: 10.5, finalColor: '#10b981' } // Green
];

// Main Component
export default function NaturalIndicators3D() {
  const [selectedSample, setSelectedSample] = useState(null);
  const [isDropping, setIsDropping] = useState(false);
  const [results, setResults] = useState({}); // id -> boolean (tested)

  const dropIndicator = (sample) => {
    setSelectedSample(sample);
    setIsDropping(true);
  };

  const handleDropComplete = () => {
    setIsDropping(false);
    setResults(prev => ({ ...prev, [selectedSample.id]: true }));
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
        Add Red Cabbage juice (purple) to samples to test their pH.
      </p>

      {SAMPLES.map(sample => (
        <div key={sample.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
           <span style={{ fontWeight: 'bold' }}>{sample.name}</span>
           <button 
             onClick={() => dropIndicator(sample)}
             disabled={isDropping || results[sample.id]}
             style={{
                padding: '6px 12px',
                background: results[sample.id] ? '#94a3b8' : '#7e22ce',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: (isDropping || results[sample.id]) ? 'default' : 'pointer',
                fontSize: '0.8rem'
             }}
           >
             {results[sample.id] ? 'Tested' : '💧 Add Indicator'}
           </button>
        </div>
      ))}

      {Object.keys(results).length > 0 && (
         <div style={{ marginTop: '10px', padding: '12px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>Observation Table:</h4>
            {SAMPLES.map(s => results[s.id] && (
               <div key={s.id} style={{ fontSize: '0.8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>{s.name}:</span>
                  <span style={{ fontWeight: 'bold', color: s.finalColor }}>{s.type} (pH ~{s.ph})</span>
               </div>
            ))}
         </div>
      )}

      <button onClick={() => setResults({})} style={{ padding: '8px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '6px', fontSize: '0.8rem' }}>
         🔄 Reset All
      </button>
    </div>
  );

  const theory = {
    formula: "Anthocyanin (Cabbage) Color Scale",
    values: [
      { label: "Acid Color", value: "Red/Pink" },
      { label: "Neutral Color", value: "Purple" },
      { label: "Base Color", value: "Green/Yellow" }
    ]
  };

  return (
    <ExperimentShell title="Natural Indicators (pH Test)" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Center top>
           <group position={[0, 0, 0]}>
              {SAMPLES.map((sample, idx) => (
                <group key={sample.id} position={[(idx - 1) * 2.2, 0, 0]}>
                   {/* Beaker */}
                   <group>
                      <Cylinder args={[0.8, 0.8, 1.5, 32, 1, true]}>
                         <meshStandardMaterial color="#e2e8f0" transparent opacity={0.3} side={THREE.DoubleSide} />
                      </Cylinder>
                      <Cylinder args={[0.8, 0.8, 0.05]} position={[0, -0.75, 0]}>
                         <meshStandardMaterial color="#e2e8f0" transparent opacity={0.5} />
                      </Cylinder>

                      {/* Liquid */}
                      <Cylinder args={[0.78, 0.78, 1]} position={[0, -0.25, 0]}>
                         <meshStandardMaterial 
                           color={results[sample.id] ? sample.finalColor : sample.initialColor} 
                           transparent 
                           opacity={0.6} 
                         />
                      </Cylinder>

                      {/* Name Tag */}
                      <Text position={[0, -1, 0.5]} fontSize={0.2} color="#475569">
                         {sample.name}
                      </Text>
                   </group>

                   {/* Add Indicator Logic (Only for active dropping beaker) */}
                   {isDropping && selectedSample?.id === sample.id && (
                     <group position={[0, 1.5, 0]}>
                        {/* Dropper Bottle */}
                        <Float speed={5} rotationIntensity={0.2} floatIntensity={0.5}>
                           <Cylinder args={[0.2, 0.2, 0.6]} position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                              <meshStandardMaterial color="#a855f7" />
                           </Cylinder>
                        </Float>
                        <IndicatorDroplet onComplete={handleDropComplete} />
                     </group>
                   )}
                </group>
              ))}
           </group>

           {/* Workbench */}
           <Box args={[10, 0.1, 4]} position={[0, -0.85, 0]}>
              <meshStandardMaterial color="#334155" />
           </Box>
        </Center>

        <OrbitControls makeDefault />
      </Canvas>
    </ExperimentShell>
  );
}

// Logic helper for droplet animation inside Canvas
function IndicatorDroplet({ onComplete }) {
  const sphereRef = useRef();
  const startTime = useRef(Date.now());
  const completed = useRef(false);

  useFrame((state, delta) => {
    if (completed.current || !sphereRef.current) return;
    
    // Simple linear animation over 0.5s
    const elapsed = (Date.now() - startTime.current) / 1000;
    const y = 1.5 - elapsed * 3;
    
    if (y < 0.2) {
      completed.current = true;
      onComplete();
    } else {
      sphereRef.current.position.y = y;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[0.06, 16, 16]} position={[0, 1.5, 0]}>
       <meshStandardMaterial color="#a855f7" />
    </Sphere>
  );
}
