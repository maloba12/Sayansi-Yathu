import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Text, Html, Center, Line } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

function WhirlingBung({ rpm, radius, isCut }) {
  const meshRef = useRef();
  const [angle, setAngle] = useState(0);
  const [position, setPosition] = useState([radius, 0.5, 0]);
  const [velocity, setVelocity] = useState([0, 0, 0]);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    if (isCut && !isFlying) {
      // Calculate tangential velocity at the moment of cutting
      const omega = (rpm * 2 * Math.PI) / 60;
      const v = omega * radius;
      // Tangential direction is perpendicular to radius vector [cos(angle), 0, sin(angle)]
      // Tangent is [-sin(angle), 0, cos(angle)]
      const vx = -v * Math.sin(angle);
      const vz = v * Math.cos(angle);
      setVelocity([vx, 0, vz]);
      setIsFlying(true);
    }
  }, [isCut, rpm, radius, angle, isFlying]);

  useFrame((state, delta) => {
    if (!isCut) {
      // Circular motion
      const omega = (rpm * 2 * Math.PI) / 60;
      const newAngle = angle + omega * delta;
      setAngle(newAngle);
      setPosition([Math.cos(newAngle) * radius, 0.5, Math.sin(newAngle) * radius]);
    } else if (isFlying) {
      // Tangential escape
      setPosition(prev => [prev[0] + velocity[0] * delta, prev[1], prev[2] + velocity[2] * delta]);
    }
  });

  return (
    <group>
      {/* The String */}
      {!isCut && (
        <Line 
          points={[[0, 0.5, 0], position]}
          color="#94a3b8"
          lineWidth={1}
        />
      )}

      {/* The Bung */}
      <Sphere ref={meshRef} position={position} args={[0.2, 16, 16]}>
        <meshStandardMaterial color="#ef4444" />
      </Sphere>

      {/* Velocity Vector (Tangential Arrow) */}
      {!isCut && (
         <group position={position} rotation={[0, -angle, 0]}>
            <Box args={[0.02, 0.02, 1]} position={[0, 0, 0.5]}>
               <meshStandardMaterial color="#22c55e" />
            </Box>
            <Box args={[0.1, 0.1, 0.2]} position={[0, 0, 1]}>
               <meshStandardMaterial color="#22c55e" />
            </Box>
         </group>
      )}

      {/* Centripetal Force Vector (Inward Arrow) */}
      {!isCut && (
         <group position={position} rotation={[0, -angle + Math.PI/2, 0]}>
            <Box args={[0.02, 0.02, 0.8]} position={[0, 0, 0.4]}>
               <meshStandardMaterial color="#3b82f6" />
            </Box>
            <Box args={[0.1, 0.1, 0.15]} position={[0, 0, 0.8]}>
               <meshStandardMaterial color="#3b82f6" />
            </Box>
         </group>
      )}
    </group>
  );
}

export default function CircularMotion3D() {
  const [rpm, setRpm] = useState(60);
  const [radius, setRadius] = useState(3);
  const [isCut, setIsCut] = useState(false);

  const omega = (rpm * 2 * Math.PI) / 60;
  const velocity = omega * radius;
  const mass = 0.1; // kg
  const centripetalForce = mass * Math.pow(velocity, 2) / radius;

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
           Rotation Speed: <strong>{rpm} RPM</strong>
        </label>
        <input 
          type="range"
          min="10"
          max="200"
          value={rpm}
          onChange={(e) => { setRpm(parseInt(e.target.value)); setIsCut(false); }}
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
           Orbit Radius: <strong>{radius.toFixed(1)} m</strong>
        </label>
        <input 
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={radius}
          onChange={(e) => { setRadius(parseFloat(e.target.value)); setIsCut(false); }}
          style={{ width: '100%' }}
        />
      </div>

      <button 
        onClick={() => setIsCut(!isCut)}
        style={{
            padding: '12px',
            background: isCut ? '#94a3b8' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
        }}
      >
        {isCut ? '🔄 Reset String' : '✂️ Cut String'}
      </button>

      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem' }}>
            <span>Orbital Velocity:</span> <strong>{velocity.toFixed(2)} m/s</strong>
         </div>
         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Centripetal Force:</span> <strong>{centripetalForce.toFixed(2)} N</strong>
         </div>
      </div>
    </div>
  );

  const theory = {
    formula: "F_c = mv²/r",
    values: [
      { label: "Angular Vel (ω)", value: `${omega.toFixed(2)} rad/s` },
      { label: "Linear Vel (v)", value: `${velocity.toFixed(2)} m/s` },
      { label: "Tension (T)", value: `${centripetalForce.toFixed(2)} N` }
    ]
  };

  return (
    <ExperimentShell title="Centripetal Force & Circular Motion" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 8, 0], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Floor / Grid */}
        <gridHelper args={[20, 20, '#cbd5e1', '#f1f5f9']} position={[0, 0, 0]} />
        
        {/* Center Point */}
        <Cylinder args={[0.05, 0.05, 1]} position={[0, 0, 0]}>
           <meshStandardMaterial color="#1e293b" />
        </Cylinder>
        <Text position={[0, 0.6, 0]} fontSize={0.2} color="black">Pivot</Text>

        <WhirlingBung rpm={rpm} radius={radius} isCut={isCut} />

        {/* Labels for Vectors */}
        {!isCut && (
           <group position={[0, -0.1, 0]}>
              <Html position={[radius + 1, 0.5, 0]}>
                 <div style={{ color: '#22c55e', fontSize: '0.7rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Tangential Velocity</div>
              </Html>
              <Html position={[radius / 2, 0.5, 0]}>
                 <div style={{ color: '#3b82f6', fontSize: '0.7rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Centripetal Force</div>
              </Html>
           </group>
        )}

        <OrbitControls enableRotate={false} />
      </Canvas>
    </ExperimentShell>
  );
}
