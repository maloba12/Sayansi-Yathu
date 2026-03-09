import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const SURFACES = {
  ice:      { label: 'Ice',      mu: 0.03, color: '#bee3f8' },
  wood:     { label: 'Wood',     mu: 0.30, color: '#c4a35a' },
  rubber:   { label: 'Rubber',   mu: 0.70, color: '#2d3748' },
  concrete: { label: 'Concrete', mu: 0.60, color: '#a0aec0' },
};

function Block({ mass, appliedForce, surface, isRunning, onUpdate }) {
  const blockRef = useRef();
  const stateRef = useRef({ x: 0, v: 0, t: 0 });

  const mu = SURFACES[surface].mu;
  const g = 9.81;
  const normal = mass * g;
  const frictionForce = mu * normal;

  useFrame((_, delta) => {
    if (!blockRef.current) return;

    if (!isRunning) {
      stateRef.current = { x: 0, v: 0, t: 0 };
      blockRef.current.position.x = 0;
      onUpdate({ displacement: 0, velocity: 0, time: 0, netForce: 0, friction: frictionForce, moving: false });
      return;
    }

    const dt = Math.min(delta, 0.05);
    const s = stateRef.current;

    // Calculate net force
    let fFriction = frictionForce;
    let netForce;

    if (Math.abs(s.v) < 0.001 && Math.abs(appliedForce) <= fFriction) {
      // Static friction: block doesn't move
      netForce = 0;
      s.v = 0;
    } else {
      // Kinetic friction opposes motion
      const frictionDir = s.v > 0 ? -1 : s.v < 0 ? 1 : (appliedForce > 0 ? -1 : 1);
      netForce = appliedForce + frictionDir * fFriction;
    }

    const acceleration = netForce / mass;

    s.v += acceleration * dt;
    s.x += s.v * dt;
    s.t += dt;

    // Clamp position
    if (s.x > 8) { s.x = 8; s.v = 0; }
    if (s.x < -2) { s.x = -2; s.v = 0; }

    blockRef.current.position.x = s.x;

    onUpdate({
      displacement: s.x,
      velocity: s.v,
      time: s.t,
      netForce,
      friction: fFriction,
      moving: Math.abs(s.v) > 0.01,
    });
  });

  const blockSize = 0.3 + mass * 0.05;

  return (
    <Box ref={blockRef} args={[blockSize * 2, blockSize, blockSize * 1.5]} position={[0, blockSize / 2 + 0.02, 0]}>
      <meshStandardMaterial color="#e53e3e" metalness={0.3} roughness={0.5} />
    </Box>
  );
}

function ForceArrow({ position, force, color, yOffset }) {
  if (Math.abs(force) < 0.1) return null;
  const len = Math.min(Math.abs(force) * 0.06, 2.5);
  const dir = force > 0 ? 1 : -1;
  return (
    <group position={[position[0], position[1] + (yOffset || 0), position[2]]}>
      <Cylinder args={[0.025, 0.025, len]} position={[dir * len / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      <Cylinder args={[0, 0.06, 0.15]} position={[dir * (len + 0.08), 0, 0]} rotation={[0, 0, dir > 0 ? -Math.PI / 2 : Math.PI / 2]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
    </group>
  );
}

function Scene({ mass, appliedForce, surface, isRunning, onUpdate, liveData }) {
  const surfaceColor = SURFACES[surface].color;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 8, -3]} intensity={0.3} />
      <OrbitControls enablePan enableZoom enableRotate minDistance={3} maxDistance={20} />

      {/* Surface */}
      <Box args={[14, 0.15, 4]} position={[3, -0.075, 0]}>
        <meshStandardMaterial color={surfaceColor} metalness={0.1} roughness={0.8} />
      </Box>

      {/* Block */}
      <Block mass={mass} appliedForce={appliedForce} surface={surface}
        isRunning={isRunning} onUpdate={onUpdate} />

      {/* Force arrows (only when running) */}
      {isRunning && liveData && (
        <>
          {/* Applied force (blue) */}
          <ForceArrow position={[liveData.displacement, 0.4, 0.8]} force={appliedForce} color="#3182ce" yOffset={0} />
          {/* Friction force (orange, opposite direction) */}
          {liveData.moving && (
            <ForceArrow position={[liveData.displacement, 0.4, -0.8]}
              force={liveData.velocity > 0 ? -liveData.friction : liveData.friction}
              color="#dd6b20" yOffset={0} />
          )}
        </>
      )}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, -0.16, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>
    </>
  );
}

const panelStyle = {
  position: 'absolute', left: 20, top: 20,
  background: 'rgba(255,255,255,0.95)', padding: '20px',
  borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  width: '310px', backdropFilter: 'blur(10px)', maxHeight: '90vh', overflowY: 'auto',
};

export default function Friction3D() {
  const [mass, setMass] = useState(3);
  const [appliedForce, setAppliedForce] = useState(15);
  const [surface, setSurface] = useState('wood');
  const [isRunning, setIsRunning] = useState(false);
  const [liveData, setLiveData] = useState({ displacement: 0, velocity: 0, time: 0, netForce: 0, friction: 0, moving: false });

  const mu = SURFACES[surface].mu;
  const normal = mass * 9.81;
  const frictionForce = mu * normal;
  const willMove = appliedForce > frictionForce;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #edf2f7, #e2e8f0)' }}>
      <Canvas camera={{ position: [3, 4, 8], fov: 50 }} shadows>
        <Scene mass={mass} appliedForce={appliedForce} surface={surface}
          isRunning={isRunning} onUpdate={setLiveData} liveData={liveData} />
      </Canvas>

      <div style={panelStyle}>
        <h3 style={{ margin: '0 0 16px', color: '#333' }}>🧱 Friction Controls</h3>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
            Surface Type
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {Object.entries(SURFACES).map(([key, s]) => (
              <button key={key} onClick={() => { setSurface(key); setIsRunning(false); }}
                disabled={isRunning}
                style={{
                  padding: '8px', border: surface === key ? '2px solid #3182ce' : '1px solid #ccc',
                  borderRadius: '6px', background: surface === key ? '#ebf8ff' : '#fff',
                  cursor: 'pointer', fontSize: '12px', fontWeight: surface === key ? 'bold' : 'normal',
                  textAlign: 'center',
                }}>
                {s.label}<br /><span style={{ fontSize: '10px', color: '#666' }}>μ = {s.mu}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
            Mass: {mass.toFixed(1)} kg
          </label>
          <input type="range" min="1" max="10" step="0.5" value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
            style={{ width: '100%' }} disabled={isRunning} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
            Applied Force: {appliedForce.toFixed(1)} N
          </label>
          <input type="range" min="0" max="50" step="0.5" value={appliedForce}
            onChange={(e) => setAppliedForce(parseFloat(e.target.value))}
            style={{ width: '100%' }} disabled={isRunning} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button onClick={() => setIsRunning(!isRunning)}
            style={{ flex: 1, padding: '10px', background: isRunning ? '#e53e3e' : '#38a169', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button onClick={() => { setIsRunning(false); }}
            style={{ padding: '10px', background: '#dd6b20', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            🔄 Reset
          </button>
        </div>

        <div style={{ background: willMove ? '#f0fff4' : '#fff5f5', border: `1px solid ${willMove ? '#68d391' : '#fc8181'}`, borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: willMove ? '#276749' : '#c53030', fontWeight: 'bold' }}>
            {willMove ? '✅ F_applied > f → Block will move!' : '🛑 F_applied ≤ f → Block stays still (static friction)'}
          </p>
        </div>

        <div style={{ background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#2d3748' }}>📊 Live Data</h4>
          <p style={{ margin: '3px 0', fontSize: '13px' }}>Normal force (N): <strong>{normal.toFixed(2)} N</strong></p>
          <p style={{ margin: '3px 0', fontSize: '13px' }}>Friction force (f): <strong>{frictionForce.toFixed(2)} N</strong></p>
          <p style={{ margin: '3px 0', fontSize: '13px' }}>Net force: <strong>{liveData.netForce.toFixed(2)} N</strong></p>
          <p style={{ margin: '3px 0', fontSize: '13px' }}>Velocity: <strong>{liveData.velocity.toFixed(2)} m/s</strong></p>
        </div>

        <div style={{ background: 'rgba(240,248,255,0.8)', padding: '15px', borderRadius: '8px', border: '1px solid #B0D4E3' }}>
          <h4 style={{ margin: '0 0 10px', color: '#2C5282' }}>📐 Physics Theory</h4>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Friction:</strong> f = μN</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Normal:</strong> N = mg = {normal.toFixed(1)} N</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Net Force:</strong> F_net = F - f</p>
          <p style={{ margin: '4px 0', fontSize: '11px', color: '#666' }}>
            μ = {mu} ({SURFACES[surface].label}), m = {mass}kg
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', right: 20, top: 20, background: 'rgba(255,255,255,0.9)', padding: '15px', borderRadius: '8px', maxWidth: '220px' }}>
        <h4 style={{ margin: '0 0 10px' }}>🎮 Controls</h4>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>🖱️ <strong>Mouse:</strong> Rotate view</p>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>🔄 <strong>Scroll:</strong> Zoom</p>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>✋ <strong>Drag:</strong> Pan</p>
        <h4 style={{ margin: '12px 0 8px' }}>🎨 Arrow Legend</h4>
        <p style={{ margin: '3px 0', fontSize: '13px' }}>🔵 Blue = Applied Force</p>
        <p style={{ margin: '3px 0', fontSize: '13px' }}>🟠 Orange = Friction</p>
      </div>
    </div>
  );
}
