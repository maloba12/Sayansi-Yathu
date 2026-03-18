import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

// Physics constants for pendulum
const GRAVITY = 9.81;

function Pendulum({ length, isRunning, onOscillation }) {
  const groupRef = useRef();
  const [angle, setAngle] = useState(0.2); // Initial displacement in radians
  const [angularVel, setAngularVel] = useState(0);
  const lastDirection = useRef(1); // 1 for right, -1 for left

  useFrame((state, delta) => {
    if (!isRunning) return;

    // SHM Approximation for simplicity: d²θ/dt² = -(g/L) * sin(θ)
    const accel = -(GRAVITY / length) * Math.sin(angle);
    const newVel = angularVel + accel * delta;
    const newAngle = angle + newVel * delta;

    setAngularVel(newVel);
    setAngle(newAngle);

    if (groupRef.current) {
      groupRef.current.rotation.z = newAngle;
    }

    // Detect oscillation (passing mean position 0)
    if (Math.sign(newAngle) !== lastDirection.current) {
       lastDirection.current = Math.sign(newAngle);
       // Only count full oscillations (returning to same side) or half oscillations?
       // Usually, we count passes through the center.
    }
  });

  return (
    <group ref={groupRef} position={[0, 4, 0]}>
      <Cylinder args={[0.02, 0.02, length]} position={[0, -length / 2, 0]}>
        <meshStandardMaterial color="#475569" />
      </Cylinder>
      <Sphere args={[0.2]} position={[0, -length, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Sphere>
    </group>
  );
}

export default function MeasureTime3D() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 10); // 10ms increments
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    setLaps(prev => [time, ...prev].slice(0, 5));
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ padding: '20px', background: '#1e293b', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '2.5rem', color: '#60a5fa', marginBottom: '10px' }}>
          {formatTime(time)}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            style={{
              flex: 2,
              padding: '12px',
              background: isRunning ? '#ef4444' : '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isRunning ? '⏹️ Stop' : '▶️ Start'}
          </button>
          <button
            onClick={handleLap}
            disabled={!isRunning}
            style={{
              flex: 1,
              padding: '12px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: isRunning ? 1 : 0.5
            }}
          >
            🏁 Lap
          </button>
        </div>
      </div>

      <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
         <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>Recent Laps:</h4>
         {laps.length === 0 ? (
           <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>No laps recorded</p>
         ) : (
           <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
             {laps.map((lap, i) => (
                <li key={i} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                   <span>Lap {laps.length - i}</span>
                   <strong>{formatTime(lap)}</strong>
                </li>
             ))}
           </ul>
         )}
      </div>

      <button
        onClick={reset}
        style={{ padding: '10px', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        🔄 Reset Timer
      </button>
    </div>
  );

  const theory = {
    formula: "T = Time / Number of Oscillations",
    values: [
      { label: "Current Time", value: formatTime(time) },
      { label: "Status", value: isRunning ? "Counting..." : "Idle" },
      { label: "Objective", value: "Time 20 swings" }
    ]
  };

  return (
    <ExperimentShell title="Measurement of Time" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Center top>
           {/* Support Stand */}
           <Box args={[1, 0.2, 1]} position={[0, -0.1, 0]}>
             <meshStandardMaterial color="#334155" />
           </Box>
           <Cylinder args={[0.05, 0.05, 4.5]} position={[0, 2.15, 0]}>
             <meshStandardMaterial color="#475569" />
           </Cylinder>
           <Box args={[1, 0.1, 0.1]} position={[0.45, 4.4, 0]}>
             <meshStandardMaterial color="#475569" />
           </Box>

           <Pendulum length={4} isRunning={isRunning} />
        </Center>

        <OrbitControls enablePan={true} />
      </Canvas>
    </ExperimentShell>
  );
}
