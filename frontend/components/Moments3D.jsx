import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

function Spanner({ distance, angle, isApplied }) {
  const groupRef = useRef();
  const [effort, setEffort] = useState(0);

  useFrame((state, delta) => {
    if (isApplied && effort < 1) {
       setEffort(prev => Math.min(prev + delta * 2, 1));
    } else if (!isApplied && effort > 0) {
       setEffort(prev => Math.max(prev - delta * 2, 0));
    }

    if (groupRef.current) {
        // Subtle vibration if effort is high
        if (effort > 0.8) {
            groupRef.current.position.x = (Math.random() - 0.5) * 0.01;
        } else {
            groupRef.current.position.x = 0;
        }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nut / Pivot */}
      <Cylinder args={[0.5, 0.5, 0.4, 6]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </Cylinder>
      
      {/* Spanner Handle */}
      <group rotation={[0, 0, -Math.PI / 2]}>
        <Box args={[0.2, 5, 0.3]} position={[0, 2.5, 0]}>
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </Box>
        {/* Spanner Head */}
        <Box args={[1.2, 1, 0.3]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </Box>
      </group>

      {/* Effort Force Arrow */}
      {isApplied && (
         <group position={[distance, 0, 0]} rotation={[0, 0, angle]}>
            <Box args={[0.05, 1 * effort, 0.05]} position={[0, -0.5 * effort, 0]}>
               <meshStandardMaterial color="#ef4444" />
            </Box>
            <Box args={[0.2, 0.2, 0.1]} position={[0, -1 * effort, 0]}>
               <meshStandardMaterial color="#ef4444" />
            </Box>
         </group>
      )}

      {/* Torque Indicator (Circular Arrow) */}
      {isApplied && (
          <group rotation={[0, 0, -effort * 0.2]}>
              <Cylinder args={[0.8, 0.8, 0.05, 32, 1, true, 0, Math.PI]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0.5]}>
                  <meshStandardMaterial color="#22c55e" transparent opacity={0.5} />
              </Cylinder>
          </group>
      )}
    </group>
  );
}

export default function Moments3D() {
  const [distance, setDistance] = useState(4); // m
  const [angle, setAngle] = useState(0); // 0 corresponds to 90 deg perpendicular
  const [isApplied, setIsApplied] = useState(false);

  const force = 10; // N
  // Moment = F * d * sin(theta)
  // Our 'angle' state is offset where 0 is 90 deg (sin 1)
  const actualTheta = (Math.PI / 2) - angle;
  const moment = force * distance * Math.sin(actualTheta);

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
           Force Position (d): <strong>{distance.toFixed(1)} m</strong>
        </label>
        <input 
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={distance}
          onChange={(e) => setDistance(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
           Pull Angle (θ): <strong>{((actualTheta * 180) / Math.PI).toFixed(0)}°</strong>
        </label>
        <input 
          type="range"
          min={-Math.PI/4}
          max={Math.PI/4}
          step="0.1"
          value={angle}
          onChange={(e) => setAngle(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <button 
        onMouseDown={() => setIsApplied(true)}
        onMouseUp={() => setIsApplied(false)}
        onMouseLeave={() => setIsApplied(false)}
        style={{
            padding: '12px',
            background: isApplied ? '#ef4444' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
        }}
      >
        {isApplied ? 'TURNING...' : 'Hold to Apply Force (10N)'}
      </button>

      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '5px solid #22c55e' }}>
         <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Turning Effect (Moment):</div>
         <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
            {moment.toFixed(2)} N·m
         </div>
      </div>
    </div>
  );

  const theory = {
    formula: "M = F × d × sin(θ)",
    values: [
      { label: "Force (F)", value: "10 N" },
      { label: "Distance (d)", value: `${distance.toFixed(1)} m` },
      { label: "Moment (M)", value: `${moment.toFixed(2)} N·m` }
    ]
  };

  return (
    <ExperimentShell title="Moment of a Force" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [2, 2, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Center top>
           <Spanner distance={distance} angle={angle} isApplied={isApplied} />
           
           {/* Nut on the bolt background */}
           <Box args={[1, 1, 0.2]} position={[0, 0, -0.3]}>
              <meshStandardMaterial color="#1e293b" />
           </Box>
        </Center>

        <OrbitControls enablePan={false} />
      </Canvas>
    </ExperimentShell>
  );
}
