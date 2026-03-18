import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Text, Html, Center, Line } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

function MeterRule({ weights, pivotX = 0 }) {
  const groupRef = useRef();
  
  // Calculate net moment
  const leftMoment = weights.filter(w => w.pos < pivotX).reduce((acc, w) => acc + w.mass * (pivotX - w.pos), 0);
  const rightMoment = weights.filter(w => w.pos > pivotX).reduce((acc, w) => acc + w.mass * (w.pos - pivotX), 0);
  
  const diff = rightMoment - leftMoment;
  const tilt = THREE.MathUtils.clamp(diff * 0.01, -0.3, 0.3);

  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -tilt, delta * 2);
    }
  });

  return (
    <group ref={groupRef} position={[0, 3, 0]}>
       {/* The Rule */}
       <Box args={[10.2, 0.1, 0.4]}>
          <meshStandardMaterial color="#fef08a" />
       </Box>
       {/* Scale Markings */}
       {[...Array(11)].map((_, i) => (
          <group key={i} position={[i - 5, 0.05, 0]}>
             <Box args={[0.02, 0.1, 0.4]}>
                <meshStandardMaterial color="black" />
             </Box>
             <Text position={[0, 0.2, 0]} fontSize={0.15} color="black">{i * 10}</Text>
          </group>
       ))}

       {/* Placed Weights */}
       {weights.map((w, idx) => (
          <group key={idx} position={[w.pos, 0.2, 0]}>
             <Cylinder args={[0.2, 0.2, 0.3, 16]}>
                <meshStandardMaterial color="#ef4444" />
             </Cylinder>
             <Text position={[0, 0, 0.25]} fontSize={0.1} color="white">{w.mass}g</Text>
          </group>
       ))}
    </group>
  );
}

export default function MomentsEquilibrium3D() {
  const [weights, setWeights] = useState([
     { pos: -4, mass: 100 }, // Initial weight on left
  ]);
  const [currentMass, setCurrentMass] = useState(50);
  const [currentPos, setCurrentPos] = useState(2);

  const leftWeights = weights.filter(w => w.pos < 0);
  const rightWeights = weights.filter(w => w.pos > 0);

  const calculateMoment = (wArray) => wArray.reduce((acc, w) => acc + w.mass * Math.abs(w.pos), 0);
  const mLeft = calculateMoment(leftWeights);
  const mRight = calculateMoment(rightWeights);

  const addWeight = () => {
     if (weights.length >= 6) return; // Limit weights
     setWeights([...weights, { pos: currentPos, mass: currentMass }]);
  };

  const clearWeights = () => setWeights([]);

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
         <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Place New Weight:</label>
         <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem' }}>Mass: {currentMass}g</span>
            <input type="range" min="10" max="200" step="10" value={currentMass} onChange={(e) => setCurrentMass(parseInt(e.target.value))} style={{ width: '100%' }} />
         </div>
         <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem' }}>Position (cm): {currentPos * 10 + 50}</span>
            <input type="range" min="-5" max="5" step="0.5" value={currentPos} onChange={(e) => setCurrentPos(parseFloat(e.target.value))} style={{ width: '100%' }} />
         </div>
         <button onClick={addWeight} style={{ width: '100%', padding: '8px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            ➕ Add Weight
         </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
         <div style={{ padding: '10px', background: '#f0f9ff', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem' }}>ACW Moment</div>
            <div style={{ fontWeight: 'bold', color: '#0369a1' }}>{mLeft.toFixed(0)}</div>
         </div>
         <div style={{ padding: '10px', background: '#fff7ed', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem' }}>CW Moment</div>
            <div style={{ fontWeight: 'bold', color: '#c2410c' }}>{mRight.toFixed(0)}</div>
         </div>
      </div>

      <div style={{ textAlign: 'center', padding: '10px', background: Math.abs(mLeft - mRight) < 5 ? '#dcfce7' : '#fee2e2', borderRadius: '6px', fontWeight: 'bold' }}>
         {Math.abs(mLeft - mRight) < 5 ? '⚖️ IN EQUILIBRIUM' : '⚠️ UNBALANCED'}
      </div>

      <button onClick={clearWeights} style={{ padding: '8px', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
         🗑️ Clear All
      </button>
    </div>
  );

  const theory = {
    formula: "Σ ACW Moments = Σ CW Moments",
    values: [
      { label: "Anti-Clockwise", value: `${mLeft.toFixed(0)} g·cm` },
      { label: "Clockwise", value: `${mRight.toFixed(0)} g·cm` },
      { label: "Net Moment", value: `${(mRight - mLeft).toFixed(0)} g·cm` }
    ]
  };

  return (
    <ExperimentShell title="Principle of Moments" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 4, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Center top>
           {/* Fulcrum */}
           <Cone args={[0.5, 1, 4]} rotation={[0, Math.PI/4, 0]} position={[0, 2, 0]}>
              <meshStandardMaterial color="#475569" />
           </Cone>
           {/* Stand */}
           <Box args={[1, 2, 1]} position={[0, 1, 0]}>
              <meshStandardMaterial color="#334155" />
           </Box>

           <MeterRule weights={weights} pivotX={0} />
        </Center>

        <OrbitControls enablePan={true} />
      </Canvas>
    </ExperimentShell>
  );
}
