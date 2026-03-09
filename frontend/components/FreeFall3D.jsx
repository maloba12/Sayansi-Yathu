import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';

// Gravity presets (m/s²)
const GRAVITY_PRESETS = {
  moon: { label: 'Moon', g: 1.62, color: '#C0C0C0' },
  earth: { label: 'Earth', g: 9.81, color: '#4CAF50' },
  jupiter: { label: 'Jupiter', g: 24.79, color: '#FF9800' },
};

function FallingBall({ height, gravity, isDropped, onLand }) {
  const ballRef = useRef();
  const trailRef = useRef([]);
  const stateRef = useRef({ y: height, velocity: 0, time: 0, landed: false });

  // Reset when not dropped
  useFrame((_, delta) => {
    if (!ballRef.current) return;

    if (!isDropped) {
      stateRef.current = { y: height, velocity: 0, time: 0, landed: false };
      ballRef.current.position.y = height;
      trailRef.current = [];
      return;
    }

    if (stateRef.current.landed) return;

    const dt = Math.min(delta, 0.05);
    const s = stateRef.current;

    // Physics: v = v0 + g*t, y = y0 - ½gt²
    s.velocity += gravity * dt;
    s.y -= s.velocity * dt;
    s.time += dt;

    // Trail positions
    if (trailRef.current.length < 60) {
      trailRef.current.push(s.y);
    }

    if (s.y <= 0.25) {
      s.y = 0.25;
      s.landed = true;
      onLand({ time: s.time, velocity: s.velocity });
    }

    ballRef.current.position.y = s.y;
  });

  return (
    <group>
      {/* Ball */}
      <Sphere ref={ballRef} args={[0.25, 32, 32]} position={[0, height, 0]}>
        <meshStandardMaterial color="#e53e3e" metalness={0.3} roughness={0.4} />
      </Sphere>

      {/* Trail dots */}
      {trailRef.current.map((y, i) => (
        <Sphere key={i} args={[0.05]} position={[0, y, 0]}>
          <meshBasicMaterial color="#e53e3e" transparent opacity={0.3} />
        </Sphere>
      ))}
    </group>
  );
}

function HeightMarkers({ maxHeight }) {
  const markers = [];
  for (let h = 0; h <= maxHeight; h += 2) {
    markers.push(
      <group key={h} position={[-1.5, h, 0]}>
        <Box args={[0.8, 0.02, 0.02]}>
          <meshStandardMaterial color="#666" />
        </Box>
      </group>
    );
  }
  return <group>{markers}</group>;
}

function Scene({ height, gravity, isDropped, onLand }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 15, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 10, -5]} intensity={0.3} />

      <OrbitControls enablePan enableZoom enableRotate minDistance={5} maxDistance={30} />

      {/* Support structure */}
      <Cylinder args={[0.05, 0.05, height + 1]} position={[-2, (height + 1) / 2, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      <Box args={[3, 0.15, 0.15]} position={[-0.5, height + 0.5, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Height markers */}
      <HeightMarkers maxHeight={height} />

      {/* Falling ball */}
      <FallingBall height={height} gravity={gravity} isDropped={isDropped} onLand={onLand} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>
    </>
  );
}

// Shared panel styles
const panelStyle = {
  position: 'absolute',
  left: 20,
  top: 20,
  background: 'rgba(255,255,255,0.95)',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  width: '300px',
  backdropFilter: 'blur(10px)',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const sliderRow = { marginBottom: '16px' };
const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' };
const btnPrimary = (active) => ({
  flex: 1,
  padding: '10px',
  background: active ? '#e53e3e' : '#38a169',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
});
const btnSecondary = {
  padding: '10px',
  background: '#dd6b20',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};
const theoryBox = {
  background: 'rgba(240,248,255,0.8)',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #B0D4E3',
};

export default function FreeFall3D() {
  const [height, setHeight] = useState(10);
  const [planet, setPlanet] = useState('earth');
  const [isDropped, setIsDropped] = useState(false);
  const [result, setResult] = useState(null);

  const g = GRAVITY_PRESETS[planet].g;
  const expectedTime = Math.sqrt((2 * height) / g);
  const expectedVelocity = g * expectedTime;

  const handleLand = (data) => {
    setResult(data);
  };

  const handleDrop = () => {
    setResult(null);
    setIsDropped(true);
  };

  const handleReset = () => {
    setIsDropped(false);
    setResult(null);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #1a202c, #2d3748)' }}>
      <Canvas camera={{ position: [5, 8, 12], fov: 50 }} shadows>
        <Scene height={height} gravity={g} isDropped={isDropped} onLand={handleLand} />
      </Canvas>

      {/* Controls */}
      <div style={panelStyle}>
        <h3 style={{ margin: '0 0 16px', color: '#333' }}>🍎 Free Fall Controls</h3>

        <div style={sliderRow}>
          <label style={labelStyle}>Drop Height: {height.toFixed(1)} m</label>
          <input type="range" min="1" max="20" step="0.5" value={height}
            onChange={(e) => { setHeight(parseFloat(e.target.value)); handleReset(); }}
            style={{ width: '100%' }} disabled={isDropped} />
        </div>

        <div style={sliderRow}>
          <label style={labelStyle}>Planet / Gravity</label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {Object.entries(GRAVITY_PRESETS).map(([key, p]) => (
              <button key={key} onClick={() => { setPlanet(key); handleReset(); }}
                disabled={isDropped}
                style={{
                  flex: 1, padding: '8px 4px', border: planet === key ? '2px solid #3182ce' : '1px solid #ccc',
                  borderRadius: '6px', background: planet === key ? '#ebf8ff' : '#fff',
                  cursor: 'pointer', fontSize: '12px', fontWeight: planet === key ? 'bold' : 'normal',
                }}>
                {p.label}<br /><span style={{ fontSize: '10px', color: '#666' }}>{p.g} m/s²</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button onClick={isDropped ? handleReset : handleDrop} style={btnPrimary(isDropped)}>
            {isDropped ? '🔄 Reset' : '🍎 Drop!'}
          </button>
        </div>

        {result && (
          <div style={{ background: '#f0fff4', border: '1px solid #68d391', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#276749' }}>📊 Impact Results</h4>
            <p style={{ margin: '4px 0', fontSize: '13px' }}>⏱️ Fall time: <strong>{result.time.toFixed(3)} s</strong></p>
            <p style={{ margin: '4px 0', fontSize: '13px' }}>💨 Impact velocity: <strong>{result.velocity.toFixed(2)} m/s</strong></p>
          </div>
        )}

        <div style={theoryBox}>
          <h4 style={{ margin: '0 0 10px', color: '#2C5282' }}>📐 Physics Theory</h4>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Equations:</strong> s = ½gt², v = gt</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Expected fall time:</strong> {expectedTime.toFixed(3)} s</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Expected impact v:</strong> {expectedVelocity.toFixed(2)} m/s</p>
          <p style={{ margin: '4px 0', fontSize: '11px', color: '#666' }}>
            h = {height.toFixed(1)}m, g = {g} m/s² ({GRAVITY_PRESETS[planet].label})
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ position: 'absolute', right: 20, top: 20, background: 'rgba(255,255,255,0.9)', padding: '15px', borderRadius: '8px', maxWidth: '220px' }}>
        <h4 style={{ margin: '0 0 10px' }}>🎮 Controls</h4>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>🖱️ <strong>Mouse:</strong> Rotate view</p>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>🔄 <strong>Scroll:</strong> Zoom</p>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>✋ <strong>Drag:</strong> Pan</p>
      </div>
    </div>
  );
}
