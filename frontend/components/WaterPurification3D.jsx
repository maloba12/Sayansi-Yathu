import React, { useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const STAGES = {
  raw: { label: 'Raw Water', color: '#744210', opacity: 0.8, turbidity: 0.8 },
  sedimented: { label: 'Sedimentation', color: '#975a16', opacity: 0.6, turbidity: 0.4 },
  filtered: { label: 'Filtration', color: '#3182ce', opacity: 0.4, turbidity: 0.1 },
  chlorinated: { label: 'Chlorination', color: '#bee3f8', opacity: 0.3, turbidity: 0 },
};

function WaterTank({ position, stageKey, progress }) {
  const config = STAGES[stageKey];
  
  return (
    <group position={position}>
      {/* Tank Glass */}
      <Box args={[1.5, 2, 1.5]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#fff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Box>
      {/* Water */}
      <Box args={[1.4, 1.8, 1.4]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color={config.color} transparent opacity={config.opacity} />
      </Box>
      {/* Dirt Particles (Sedimentation visual) */}
      {stageKey === 'raw' && Array.from({ length: 20 }).map((_, i) => (
        <Sphere key={i} args={[0.02, 8, 8]} position={[(Math.random() - 0.5) * 1.2, 0.1 + Math.random() * 1.6, (Math.random() - 0.5) * 1.2]}>
          <meshStandardMaterial color="#4a3721" />
        </Sphere>
      ))}
      {stageKey === 'sedimented' && (
        <group>
          {/* Settle at bottom */}
          {Array.from({ length: 20 }).map((_, i) => (
            <Sphere key={i} args={[0.02, 8, 8]} position={[(Math.random() - 0.5) * 1.2, 0.05, (Math.random() - 0.5) * 1.2]}>
              <meshStandardMaterial color="#4a3721" />
            </Sphere>
          ))}
        </group>
      )}
    </group>
  );
}

function FilterLayers({ position }) {
  return (
    <group position={position}>
      {/* Gravel */}
      <Box args={[1.2, 0.3, 1.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#718096" />
      </Box>
      {/* Sand */}
      <Box args={[1.2, 0.3, 1.2]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#ecc94b" />
      </Box>
      {/* Charcoal (Optional but common in lessons) */}
      <Box args={[1.2, 0.1, 1.2]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#2d3748" />
      </Box>
      <Text position={[1, 0, 0]} fontSize={0.15} color="#4a5568">Gravel</Text>
      <Text position={[1, 0.3, 0]} fontSize={0.15} color="#4a5568">Sand</Text>
    </group>
  );
}

export default function WaterPurification3D() {
  const [stage, setStage] = useState('raw');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const nextStage = () => {
    if (stage === 'raw') setStage('sedimented');
    else if (stage === 'sedimented') setStage('filtered');
    else if (stage === 'filtered') setStage('chlorinated');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #ebf8ff, #fff)' }}>
      <Canvas camera={{ position: [4, 4, 6], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 10, 5]} intensity={1} />
        <OrbitControls />

        <WaterTank position={[0, 0, 0]} stageKey={stage} />
        
        {stage === 'sedimented' && (
           <Float speed={2} floatIntensity={0.5}>
              <Text position={[0, 2.5, 0]} fontSize={0.2} color="#2d3748">Step: Sedimentation Complete</Text>
           </Float>
        )}
        
        {stage === 'filtered' && (
          <group position={[-3, 0, 0]}>
            <FilterLayers position={[0, 1, 0]} />
            <Text position={[0, 3, 0]} fontSize={0.3} color="#2d3748">Filtration Bed</Text>
          </group>
        )}

        {/* Lab bench */}
        <Box args={[10, 0.1, 6]} position={[0, -0.05, 0]}>
          <meshStandardMaterial color="#e2e8f0" />
        </Box>
      </Canvas>

      <div style={{ position: 'absolute', left: 20, top: 20, width: 340, background: 'rgba(255,255,255,0.95)', padding: 25, borderRadius: 15, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 10px', color: '#2c5282' }}>Water Purification</h2>
        <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: 20 }}>Simulating the large-scale treatment of water to make it safe for drinking.</p>

        <div style={{ padding: 15, background: '#f7fafc', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 5px', color: '#3182ce' }}>Current Stage: {STAGES[stage].label}</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096' }}>
            {stage === 'raw' && "Turbid water containing dirt and microorganisms."}
            {stage === 'sedimented' && "Heavy particles have settled at the bottom."}
            {stage === 'filtered' && "Water passed through sand and gravel to remove fine particles."}
            {stage === 'chlorinated' && "Chlorine added to kill harmful pathogens. Safe to drink!"}
          </p>
        </div>

        <button onClick={nextStage} disabled={stage === 'chlorinated'}
          style={{ width: '100%', padding: 15, background: stage === 'chlorinated' ? '#cbd5e0' : '#3182ce', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          {stage === 'chlorinated' ? 'PURIFICATION COMPLETE' : 'PROCEED TO NEXT STEP'}
        </button>

        <button onClick={() => setStage('raw')} style={{ width: '100%', padding: 10, background: 'none', border: '1px solid #cbd5e0', borderRadius: 8, marginTop: 10, cursor: 'pointer', color: '#718096' }}>
          RESTART
        </button>
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(255,255,255,0.9)', padding: 15, borderRadius: 10, maxWidth: 350, fontSize: '0.85rem' }}>
        <strong>CDC Zambia Fact:</strong> Water purification in cities like Lusaka or Kitwe involves these stages at large treatment plants (e.g., LWSC) to ensure public health.
      </div>
    </div>
  );
}
