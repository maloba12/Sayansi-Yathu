import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function Cart({ initialVelocity, acceleration, isRunning, onUpdate }) {
  const cartRef = useRef();
  const stateRef = useRef({ x: 0, v: initialVelocity, t: 0 });

  useFrame((_, delta) => {
    if (!cartRef.current) return;

    if (!isRunning) {
      stateRef.current = { x: 0, v: initialVelocity, t: 0 };
      cartRef.current.position.x = 0;
      onUpdate({ displacement: 0, velocity: initialVelocity, time: 0 });
      return;
    }

    const dt = Math.min(delta, 0.05);
    const s = stateRef.current;

    // Kinematics: v = v0 + at, x = x0 + v*dt
    s.v = initialVelocity + acceleration * s.t;
    s.x = initialVelocity * s.t + 0.5 * acceleration * s.t * s.t;
    s.t += dt;

    // Clamp to track bounds
    if (s.x > 9 || s.x < -1) {
      // Stop at track ends
      s.x = Math.max(-1, Math.min(9, s.x));
    } else {
      cartRef.current.position.x = s.x;
    }

    onUpdate({ displacement: s.x, velocity: s.v, time: s.t });
  });

  return (
    <group ref={cartRef} position={[0, 0.35, 0]}>
      {/* Cart body */}
      <Box args={[0.8, 0.3, 0.5]}>
        <meshStandardMaterial color="#3182ce" metalness={0.4} roughness={0.3} />
      </Box>
      {/* Wheels */}
      <Cylinder args={[0.1, 0.1, 0.08, 16]} position={[-0.25, -0.2, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#333" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.08, 16]} position={[0.25, -0.2, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#333" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.08, 16]} position={[-0.25, -0.2, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#333" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.08, 16]} position={[0.25, -0.2, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#333" />
      </Cylinder>
    </group>
  );
}

function Track() {
  const markers = [];
  for (let x = 0; x <= 10; x += 1) {
    markers.push(
      <group key={x} position={[x, 0.01, 0.6]}>
        <Box args={[0.02, 0.02, 0.2]}>
          <meshStandardMaterial color="#555" />
        </Box>
      </group>
    );
  }
  return (
    <group>
      {/* Rail */}
      <Box args={[12, 0.08, 0.6]} position={[5, 0.04, 0]}>
        <meshStandardMaterial color="#a0aec0" metalness={0.6} roughness={0.2} />
      </Box>
      {/* Distance markers */}
      {markers}
    </group>
  );
}

function VelocityArrow({ velocity, position }) {
  if (Math.abs(velocity) < 0.01) return null;
  const length = Math.min(Math.abs(velocity) * 0.3, 2);
  const dir = velocity > 0 ? 1 : -1;
  return (
    <group position={position}>
      <Cylinder args={[0.03, 0.03, length]} position={[dir * length / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#e53e3e" />
      </Cylinder>
      {/* Arrow head */}
      <Cylinder args={[0, 0.08, 0.2]} position={[dir * (length + 0.1), 0, 0]} rotation={[0, 0, dir > 0 ? -Math.PI / 2 : Math.PI / 2]}>
        <meshStandardMaterial color="#e53e3e" />
      </Cylinder>
    </group>
  );
}

function Scene({ initialVelocity, acceleration, isRunning, onUpdate, liveData }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-3, 8, -3]} intensity={0.3} />

      <OrbitControls enablePan enableZoom enableRotate minDistance={3} maxDistance={25} />

      <Track />
      <Cart initialVelocity={initialVelocity} acceleration={acceleration} isRunning={isRunning} onUpdate={onUpdate} />

      {/* Velocity arrow */}
      {isRunning && liveData && (
        <VelocityArrow velocity={liveData.velocity} position={[liveData.displacement, 1, 0]} />
      )}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, -0.05, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </>
  );
}

const panelStyle = {
  position: 'absolute', left: 20, top: 20,
  background: 'rgba(255,255,255,0.95)', padding: '20px',
  borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  width: '300px', backdropFilter: 'blur(10px)', maxHeight: '90vh', overflowY: 'auto',
};
const sliderRow = { marginBottom: '16px' };
const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' };

export default function LinearMotion3D() {
  const [initialVelocity, setInitialVelocity] = useState(2);
  const [acceleration, setAcceleration] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [liveData, setLiveData] = useState({ displacement: 0, velocity: 2, time: 0 });

  const handleUpdate = (data) => setLiveData(data);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #edf2f7, #e2e8f0)' }}>
      <Canvas camera={{ position: [5, 5, 10], fov: 50 }} shadows>
        <Scene initialVelocity={initialVelocity} acceleration={acceleration}
          isRunning={isRunning} onUpdate={handleUpdate} liveData={liveData} />
      </Canvas>

      <div style={panelStyle}>
        <h3 style={{ margin: '0 0 16px', color: '#333' }}>🚗 Linear Motion Controls</h3>

        <div style={sliderRow}>
          <label style={labelStyle}>Initial Velocity: {initialVelocity.toFixed(1)} m/s</label>
          <input type="range" min="0" max="10" step="0.5" value={initialVelocity}
            onChange={(e) => setInitialVelocity(parseFloat(e.target.value))}
            style={{ width: '100%' }} disabled={isRunning} />
        </div>

        <div style={sliderRow}>
          <label style={labelStyle}>Acceleration: {acceleration.toFixed(1)} m/s²</label>
          <input type="range" min="-5" max="5" step="0.5" value={acceleration}
            onChange={(e) => setAcceleration(parseFloat(e.target.value))}
            style={{ width: '100%' }} disabled={isRunning} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button onClick={() => setIsRunning(!isRunning)}
            style={{ flex: 1, padding: '10px', background: isRunning ? '#e53e3e' : '#38a169', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button onClick={() => { setIsRunning(false); setLiveData({ displacement: 0, velocity: initialVelocity, time: 0 }); }}
            style={{ padding: '10px', background: '#dd6b20', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            🔄 Reset
          </button>
        </div>

        {/* Live readings */}
        <div style={{ background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#2d3748' }}>📊 Live Data</h4>
          <p style={{ margin: '3px 0', fontSize: '13px' }}>📏 Displacement: <strong>{liveData.displacement.toFixed(2)} m</strong></p>
          <p style={{ margin: '3px 0', fontSize: '13px' }}>💨 Velocity: <strong>{liveData.velocity.toFixed(2)} m/s</strong></p>
          <p style={{ margin: '3px 0', fontSize: '13px' }}>⏱️ Time: <strong>{liveData.time.toFixed(2)} s</strong></p>
        </div>

        <div style={{ background: 'rgba(240,248,255,0.8)', padding: '15px', borderRadius: '8px', border: '1px solid #B0D4E3' }}>
          <h4 style={{ margin: '0 0 10px', color: '#2C5282' }}>📐 Physics Theory</h4>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>s</strong> = v₀t + ½at²</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>v</strong> = v₀ + at</p>
          <p style={{ margin: '4px 0', fontSize: '11px', color: '#666' }}>
            v₀ = {initialVelocity.toFixed(1)} m/s, a = {acceleration.toFixed(1)} m/s²
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', right: 20, top: 20, background: 'rgba(255,255,255,0.9)', padding: '15px', borderRadius: '8px', maxWidth: '220px' }}>
        <h4 style={{ margin: '0 0 10px' }}>🎮 Controls</h4>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>🖱️ <strong>Mouse:</strong> Rotate view</p>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>🔄 <strong>Scroll:</strong> Zoom</p>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>✋ <strong>Drag:</strong> Pan</p>
      </div>
    </div>
  );
}
