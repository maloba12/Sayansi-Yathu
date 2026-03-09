import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

const SOLUTIONS = {
  acid: { label: 'Lemon Juice (Acid)', ph: 2.2, color: '#f6e05e', litmusRed: 'red', litmusBlue: 'red', cabbage: '#e53e3e' },
  neutral: { label: 'Distilled Water', ph: 7.0, color: '#ebf8ff', litmusRed: 'red', litmusBlue: 'blue', cabbage: '#9f7aea' },
  base: { label: 'Soap Solution (Base)', ph: 10.5, color: '#e2e8f0', litmusRed: 'blue', litmusBlue: 'blue', cabbage: '#38a169' },
};

function TestTube({ position, color, label }) {
  return (
    <group position={position}>
      {/* Glas Tube */}
      <Cylinder args={[0.15, 0.15, 1, 32]} openEnded>
        <meshStandardMaterial color="#fff" transparent opacity={0.2} side={THREE.DoubleSide} />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.01, 32]} position={[0, -0.5, 0]}>
         <meshStandardMaterial color="#fff" transparent opacity={0.2} />
      </Cylinder>
      {/* Liquid */}
      <Cylinder args={[0.14, 0.14, 0.6, 32]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color={color} transparent opacity={0.6} />
      </Cylinder>
      <Text position={[0, -0.7, 0]} fontSize={0.12} color="#2d3748" anchorX="center" maxWidth={0.5} textAlign="center">
        {label}
      </Text>
    </group>
  );
}

function LitmusPaper({ position, initialColor, finalColor, isDipped }) {
  const color = isDipped ? finalColor : initialColor;
  return (
    <group position={position}>
      <Box args={[0.05, 0.8, 0.01]} position={[0, isDipped ? -0.2 : 0, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
    </group>
  );
}

export default function AcidsBases3D() {
  const [selectedSol, setSelectedSol] = useState('acid');
  const [testMode, setTestMode] = useState('none'); // 'litmusRed', 'litmusBlue', 'cabbage'
  const solution = SOLUTIONS[selectedSol];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #f7fafc, #edf2f7)' }}>
      <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 10, 5]} intensity={1} />
        <OrbitControls enablePan={false} />

        {/* Rack */}
        <Box args={[3, 0.1, 1]} position={[0, -0.05, 0]}>
           <meshStandardMaterial color="#718096" />
        </Box>
        <Box args={[3, 0.1, 1]} position={[0, 0.5, 0]}>
           <meshStandardMaterial color="#718096" transparent opacity={0.5} />
        </Box>

        {Object.entries(SOLUTIONS).map(([key, sol], i) => (
           <TestTube 
             key={key} 
             position={[(i - 1) * 0.8, 0.5, 0]} 
             color={testMode === 'cabbage' && selectedSol === key ? sol.cabbage : sol.color} 
             label={sol.label} 
           />
        ))}

        {/* Interaction items */}
        {testMode === 'litmusRed' && (
           <LitmusPaper position={[(Object.keys(SOLUTIONS).indexOf(selectedSol) - 1) * 0.8, 1.2, 0.2]} initialColor="#fc8181" finalColor={solution.litmusRed === 'blue' ? '#63b3ed' : '#fc8181'} isDipped={true} />
        )}
        {testMode === 'litmusBlue' && (
           <LitmusPaper position={[(Object.keys(SOLUTIONS).indexOf(selectedSol) - 1) * 0.8, 1.2, 0.2]} initialColor="#63b3ed" finalColor={solution.litmusBlue === 'red' ? '#fc8181' : '#63b3ed'} isDipped={true} />
        )}
      </Canvas>

      <div style={{ position: 'absolute', left: 20, top: 20, width: 320, background: 'rgba(255,255,255,0.95)', padding: 20, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 16px' }}>🧪 Acids & Bases Lab</h3>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 'bold' }}>Select Substance:</label>
          <select value={selectedSol} onChange={(e) => {setSelectedSol(e.target.value); setTestMode('none');}} style={{ width: '100%', padding: 10, marginTop: 5 }}>
             {Object.entries(SOLUTIONS).map(([key, sol]) => <option key={key} value={key}>{sol.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
           <button onClick={() => setTestMode('litmusRed')} style={{ padding: 12, background: '#fc8181', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
             Test with Red Litmus
           </button>
           <button onClick={() => setTestMode('litmusBlue')} style={{ padding: 12, background: '#63b3ed', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
             Test with Blue Litmus
           </button>
           <button onClick={() => setTestMode('cabbage')} style={{ padding: 12, background: '#9f7aea', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
             Add Cabbage Indicator
           </button>
        </div>

        {testMode !== 'none' && (
          <div style={{ marginTop: 20, padding: 15, background: '#fff', border: '2px solid #3182ce', borderRadius: 8 }}>
             <h4 style={{ margin: '0 0 8px' }}>Observation:</h4>
             {testMode === 'litmusRed' && <p>The red litmus paper turned <strong style={{ color: solution.litmusRed === 'blue' ? '#3182ce' : '#e53e3e' }}>{solution.litmusRed}</strong>.</p>}
             {testMode === 'litmusBlue' && <p>The blue litmus paper turned <strong style={{ color: solution.litmusBlue === 'red' ? '#e53e3e' : '#3182ce' }}>{solution.litmusBlue}</strong>.</p>}
             {testMode === 'cabbage' && <p>The solution turned <strong style={{ color: solution.cabbage }}>this color</strong>. Natural indicators change color based on pH.</p>}
             <p style={{ marginTop: 10, fontSize: '0.9rem' }}>Estimated pH: <strong>{solution.ph}</strong></p>
          </div>
        )}
        
        <button onClick={() => setTestMode('none')} style={{ width: '100%', padding: 10, background: '#edf2f7', border: 'none', borderRadius: 6, marginTop: 10, cursor: 'pointer' }}>Reset Test</button>
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(255,255,255,0.9)', padding: 15, borderRadius: 8, maxWidth: 350 }}>
        <h4 style={{ margin: '0 0 8px' }}>📖 Theory: Indicators</h4>
        <p style={{ fontSize: '0.9rem', margin: 0 }}>
          Indicators are substances that change color when they come into contact with an acid or a base. 
          <strong> Red litmus</strong> turns blue in bases. <strong>Blue litmus</strong> turns red in acids.
          Neutral substances do not change the color of litmus paper.
        </p>
      </div>
    </div>
  );
}
