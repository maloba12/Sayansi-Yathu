import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function SpringCoil({ topY, extension, springK }) {
  // Generate coil points
  const coils = 12;
  const radius = 0.2;
  const restLength = 2;
  const totalLength = restLength + extension;
  const points = useMemo(() => {
    const pts = [];
    const segments = coils * 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * coils * Math.PI * 2;
      const y = topY - t * totalLength;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    return pts;
  }, [topY, totalLength]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  // Color based on extension (green = relaxed, red = stretched)
  const stretchRatio = extension / (restLength * 1.5);
  const color = stretchRatio > 0.9 ? '#e53e3e' : stretchRatio > 0.5 ? '#dd6b20' : '#38a169';

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
}

function Weight({ position, mass }) {
  const size = 0.15 + mass * 0.04;
  return (
    <Box args={[size * 2, size, size * 2]} position={position}>
      <meshStandardMaterial color="#2b6cb0" metalness={0.5} roughness={0.3} />
    </Box>
  );
}

function Ruler({ topY, extension }) {
  const marks = [];
  const restLength = 2;
  const totalLength = restLength + extension;
  for (let cm = 0; cm <= Math.ceil(totalLength * 10); cm += 5) {
    const y = topY - cm / 10;
    marks.push(
      <group key={cm} position={[0.8, y, 0]}>
        <Box args={[cm % 10 === 0 ? 0.3 : 0.15, 0.01, 0.01]}>
          <meshStandardMaterial color="#333" />
        </Box>
      </group>
    );
  }
  return (
    <group>
      <Box args={[0.08, Math.max(totalLength + 1, 3), 0.08]} position={[0.8, topY - (totalLength + 1) / 2, 0]}>
        <meshStandardMaterial color="#f6e05e" />
      </Box>
      {marks}
    </group>
  );
}

function Scene({ mass, springK, topY }) {
  const g = 9.81;
  const extension = (mass * g) / springK;
  const bottomY = topY - 2 - extension; // rest length + extension

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-3, 8, -3]} intensity={0.3} />

      <OrbitControls enablePan enableZoom enableRotate minDistance={3} maxDistance={20} />

      {/* Support bar */}
      <Box args={[3, 0.15, 0.5]} position={[0, topY + 0.1, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Support legs */}
      <Cylinder args={[0.06, 0.06, topY + 0.1]} position={[-1.3, (topY + 0.1) / 2, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      <Cylinder args={[0.06, 0.06, topY + 0.1]} position={[1.3, (topY + 0.1) / 2, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>

      {/* Hook */}
      <Sphere args={[0.06]} position={[0, topY, 0]}>
        <meshStandardMaterial color="#333" />
      </Sphere>

      {/* Spring coil */}
      <SpringCoil topY={topY} extension={extension} springK={springK} />

      {/* Weight */}
      <Weight position={[0, bottomY - 0.1, 0]} mass={mass} />

      {/* Ruler */}
      <Ruler topY={topY} extension={extension} />

      {/* Extension line indicator */}
      {extension > 0.01 && (
        <group>
          <Box args={[0.01, extension, 0.01]} position={[-0.5, topY - 2 - extension / 2, 0]}>
            <meshStandardMaterial color="#e53e3e" />
          </Box>
          {/* Arrow heads */}
          <Cylinder args={[0, 0.04, 0.1]} position={[-0.5, topY - 2, 0]}>
            <meshStandardMaterial color="#e53e3e" />
          </Cylinder>
          <Cylinder args={[0.04, 0, 0.1]} position={[-0.5, topY - 2 - extension, 0]}>
            <meshStandardMaterial color="#e53e3e" />
          </Cylinder>
        </group>
      )}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
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

export default function HookesLaw3D() {
  const [mass, setMass] = useState(1);
  const [springK, setSpringK] = useState(50);
  const topY = 5;

  const g = 9.81;
  const force = mass * g;
  const extension = force / springK;
  const elasticLimit = 2 * 1.5; // rest length * 1.5
  const nearLimit = extension > elasticLimit * 0.8;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #f7fafc, #edf2f7)' }}>
      <Canvas camera={{ position: [4, 3, 6], fov: 50 }} shadows>
        <Scene mass={mass} springK={springK} topY={topY} />
      </Canvas>

      <div style={panelStyle}>
        <h3 style={{ margin: '0 0 16px', color: '#333' }}>🔩 Hooke's Law Controls</h3>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
            Mass: {mass.toFixed(1)} kg
          </label>
          <input type="range" min="0.1" max="5" step="0.1" value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
            style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
            Spring Constant (k): {springK} N/m
          </label>
          <input type="range" min="10" max="200" step="5" value={springK}
            onChange={(e) => setSpringK(parseFloat(e.target.value))}
            style={{ width: '100%' }} />
        </div>

        {nearLimit && (
          <div style={{ background: '#fff5f5', border: '1px solid #fc8181', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#c53030' }}>
              ⚠️ Approaching elastic limit! Spring may not obey Hooke's Law beyond this point.
            </p>
          </div>
        )}

        {/* Live readings */}
        <div style={{ background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#2d3748' }}>📊 Measurements</h4>
          <p style={{ margin: '3px 0', fontSize: '13px' }}>⬇️ Force (F): <strong>{force.toFixed(2)} N</strong></p>
          <p style={{ margin: '3px 0', fontSize: '13px' }}>📏 Extension (x): <strong>{extension.toFixed(3)} m</strong></p>
          <p style={{ margin: '3px 0', fontSize: '13px' }}>🔩 Spring constant (k): <strong>{springK} N/m</strong></p>
        </div>

        <div style={{ background: 'rgba(240,248,255,0.8)', padding: '15px', borderRadius: '8px', border: '1px solid #B0D4E3' }}>
          <h4 style={{ margin: '0 0 10px', color: '#2C5282' }}>📐 Physics Theory</h4>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Hooke's Law:</strong> F = kx</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Extension:</strong> x = F/k = mg/k</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Verification:</strong> F/x = {(force / Math.max(extension, 0.001)).toFixed(1)} N/m ≈ k</p>
          <p style={{ margin: '4px 0', fontSize: '11px', color: '#666' }}>
            m = {mass.toFixed(1)}kg, g = 9.81 m/s², k = {springK} N/m
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
