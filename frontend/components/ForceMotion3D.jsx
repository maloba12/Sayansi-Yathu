import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

function DeformableBox({ position, force, isCompressing }) {
  const meshRef = useRef();
  const [scaleY, setScaleY] = useState(1);

  useFrame((state, delta) => {
    if (isCompressing && meshRef.current) {
        // Compress based on force
        const targetScale = Math.max(0.2, 1 - (force / 100));
        setScaleY(THREE.MathUtils.lerp(scaleY, targetScale, delta * 5));
    } else {
        // Return to normal
        setScaleY(THREE.MathUtils.lerp(scaleY, 1, delta * 5));
    }
  });

  return (
    <Box ref={meshRef} position={position} scale={[1, scaleY, 1]} args={[1, 1, 1]}>
      <meshStandardMaterial color="#fbbf24" />
      <Text position={[0, 0.6, 0]} fontSize={0.15} color="black">FOAM</Text>
    </Box>
  );
}

// Fixing the closing tag issue in the code block above
function DeformableBoxCorrected({ position, force, isCompressing }) {
    const meshRef = useRef();
    const [scaleY, setScaleY] = useState(1);
  
    useFrame((state, delta) => {
      if (isCompressing && meshRef.current) {
          const targetScale = Math.max(0.2, 1 - (force / 100));
          setScaleY(THREE.MathUtils.lerp(scaleY, targetScale, delta * 5));
      } else {
          setScaleY(THREE.MathUtils.lerp(scaleY, 1, delta * 5));
      }
    });
  
    return (
      <Box ref={meshRef} position={position} scale={[1, scaleY, 1]} args={[1.5, 1.5, 1.5]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
    );
}

function MovingBall({ position, velocity, isRunning }) {
    const meshRef = useRef();
    const [pos, setPos] = useState(position);
    const [vel, setVel] = useState(velocity);

    useFrame((state, delta) => {
        if (isRunning && meshRef.current) {
            const nextPos = [pos[0] + vel[0] * delta, pos[1], pos[2] + vel[2] * delta];
            setPos(nextPos);
            // Friction
            setVel([vel[0] * 0.99, 0, vel[2] * 0.99]);
        }
    });

    return (
        <Sphere ref={meshRef} position={pos} args={[0.5, 32, 32]}>
            <meshStandardMaterial color="#ef4444" />
        </Sphere>
    );
}

export default function ForceMotion3D() {
  const [charge, setCharge] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [ballState, setBallState] = useState({ position: [0, 0.5, 0], velocity: [0, 0, 0], isRunning: false });
  const [mode, setMode] = useState('acceleration'); // 'acceleration' or 'deformation'

  useEffect(() => {
    let interval;
    if (isCharging) {
      interval = setInterval(() => {
        setCharge(prev => Math.min(prev + 2, 100));
      }, 50);
    } else if (charge > 0 && mode === 'acceleration') {
       // Release force
       setBallState({ position: [0, 0.5, 0], velocity: [charge / 5, 0, 0], isRunning: true });
       setCharge(0);
    }
    return () => clearInterval(interval);
  }, [isCharging, mode]);

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
         <button onClick={() => setMode('acceleration')} style={{ flex: 1, padding: '10px', background: mode === 'acceleration' ? '#3b82f6' : '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px' }}>🏃 Force & Motion</button>
         <button onClick={() => setMode('deformation')} style={{ flex: 1, padding: '10px', background: mode === 'deformation' ? '#3b82f6' : '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px' }}>📦 Deformation</button>
      </div>

      <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
         <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            {mode === 'acceleration' ? 'Force Applied (N):' : 'Compression Force (N):'}
            <span style={{ float: 'right', color: '#3b82f6' }}>{charge}%</span>
         </label>
         <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${charge}%`, height: '100%', background: 'linear-gradient(to right, #60a5fa, #ef4444)', transition: 'width 0.1s' }} />
         </div>
      </div>

      {mode === 'acceleration' ? (
        <button 
          onMouseDown={() => { setIsCharging(true); setBallState(s => ({...s, isRunning: false})); }}
          onMouseUp={() => setIsCharging(false)}
          style={{ padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isCharging ? 'KICKING...' : 'Hold to Charge & Release to Kick'}
        </button>
      ) : (
        <button 
          onMouseDown={() => { setIsCompressing(true); setCharge(80); }}
          onMouseUp={() => { setIsCompressing(false); setCharge(0); }}
          style={{ padding: '12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isCompressing ? 'COMPRESSING...' : 'Hold to Compress Foam'}
        </button>
      )}

      <button onClick={() => { setBallState({ position: [0, 0.5, 0], velocity: [0, 0, 0], isRunning: false }); setCharge(0); }} style={{ padding: '8px', border: '1px solid #94a3b8', borderRadius: '6px', background: 'white' }}>
         🔄 Reset Scene
      </button>
    </div>
  );

  const theory = {
    formula: mode === 'acceleration' ? "F = m × a" : "Strain ∝ Applied Stress",
    values: [
      { label: "Applied Force", value: `${charge} N` },
      { label: "Observed Effect", value: mode === 'acceleration' ? "Acceleration" : "Change in Shape" },
      { label: "Vector Direction", value: "Positive X-Axis" }
    ]
  };

  return (
    <ExperimentShell title="Effect of Force on Motion and Shape" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [5, 4, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        
        {/* Track / Floor */}
        <Box args={[20, 0.1, 10]} position={[5, -0.05, 0]} receiveShadow>
          <meshStandardMaterial color="#1e293b" />
        </Box>
        {/* Wall */}
        <Box args={[0.2, 5, 10]} position={[15, 2.5, 0]}>
          <meshStandardMaterial color="#475569" />
        </Box>

        {mode === 'acceleration' ? (
            <MovingBall position={ballState.position} velocity={ballState.velocity} isRunning={ballState.isRunning} />
        ) : (
            <DeformableBoxCorrected position={[0, 0.75, 0]} force={charge} isCompressing={isCompressing} />
        )}

        {/* Force Vector Arrow */}
        {charge > 0 && (
           <group position={[mode === 'acceleration' ? ballState.position[0] - 1.5 : -2, 1, 0]}>
              <Cylinder args={[0.05, 0.05, charge/20]} rotation={[0, 0, Math.PI/2]} position={[0, 0, 0]}>
                 <meshStandardMaterial color="#ef4444" />
              </Cylinder>
              <Cone args={[0.15, 0.4]} rotation={[0, 0, -Math.PI/2]} position={[charge/40, 0, 0]}>
                 <meshStandardMaterial color="#ef4444" />
              </Cone>
           </group>
        )}

        <OrbitControls />
      </Canvas>
    </ExperimentShell>
  );
}
