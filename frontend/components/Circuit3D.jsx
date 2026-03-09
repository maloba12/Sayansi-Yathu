import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function ElectronFlow({ voltage, resistance, isOn }) {
  const electrons = useRef([]);
  const groupRef = useRef();

  // Generate electron positions along the wire path
  useMemo(() => {
    electrons.current = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
      electrons.current.push({
        progress: i / count,
        speed: 0,
      });
    }
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !isOn) return;

    const current = voltage / resistance;
    const flowSpeed = Math.min(current * 0.15, 0.5);

    electrons.current.forEach((e) => {
      e.progress += flowSpeed * delta;
      if (e.progress > 1) e.progress -= 1;
    });
  });

  // Wire path: rectangular circuit
  const pathPoints = (progress) => {
    // 0-0.25: top wire (left to right)
    // 0.25-0.5: right wire (top to bottom)
    // 0.5-0.75: bottom wire (right to left)
    // 0.75-1.0: left wire (bottom to top)
    const w = 3, h = 2;
    if (progress < 0.25) {
      const t = progress / 0.25;
      return [(-w / 2) + t * w, h / 2, 0];
    } else if (progress < 0.5) {
      const t = (progress - 0.25) / 0.25;
      return [w / 2, h / 2 - t * h, 0];
    } else if (progress < 0.75) {
      const t = (progress - 0.5) / 0.25;
      return [w / 2 - t * w, -h / 2, 0];
    } else {
      const t = (progress - 0.75) / 0.25;
      return [-w / 2, -h / 2 + t * h, 0];
    }
  };

  return (
    <group ref={groupRef}>
      {isOn && electrons.current.map((e, i) => {
        const [x, y, z] = pathPoints(e.progress);
        return (
          <Sphere key={i} args={[0.04]} position={[x, y, z]}>
            <meshBasicMaterial color="#ffd700" />
          </Sphere>
        );
      })}
    </group>
  );
}

function Battery({ position }) {
  return (
    <group position={position}>
      {/* Battery body */}
      <Box args={[0.6, 0.8, 0.4]}>
        <meshStandardMaterial color="#2d3748" metalness={0.5} roughness={0.3} />
      </Box>
      {/* Positive terminal */}
      <Cylinder args={[0.06, 0.06, 0.15]} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#e53e3e" />
      </Cylinder>
      {/* Negative terminal */}
      <Cylinder args={[0.06, 0.06, 0.1]} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#3182ce" />
      </Cylinder>
      {/* Label strip */}
      <Box args={[0.5, 0.15, 0.41]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#e53e3e" />
      </Box>
    </group>
  );
}

function Resistor({ position, resistance }) {
  // Color intensity based on resistance
  const hue = Math.max(0, 1 - resistance / 100);
  return (
    <group position={position}>
      <Box args={[0.8, 0.3, 0.3]}>
        <meshStandardMaterial color={`hsl(${hue * 120}, 70%, 50%)`} metalness={0.2} roughness={0.6} />
      </Box>
      {/* Color bands */}
      {[-.25, -.1, .05, .2].map((x, i) => (
        <Box key={i} args={[0.04, 0.32, 0.32]} position={[x, 0, 0]}>
          <meshStandardMaterial color={['#e53e3e', '#dd6b20', '#d69e2e', '#805ad5'][i]} />
        </Box>
      ))}
    </group>
  );
}

function Ammeter({ position, current }) {
  return (
    <group position={position}>
      <Cylinder args={[0.4, 0.4, 0.15, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#1a202c" metalness={0.3} roughness={0.4} />
      </Cylinder>
      {/* Face */}
      <Cylinder args={[0.35, 0.35, 0.01, 32]} position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#f7fafc" />
      </Cylinder>
      {/* Needle */}
      {current > 0 && (
        <Box args={[0.02, 0.25, 0.02]}
          position={[Math.sin(Math.min(current * 0.3, 1.2)) * 0.12, Math.cos(Math.min(current * 0.3, 1.2)) * 0.12, 0.1]}
          rotation={[0, 0, -Math.min(current * 0.3, 1.2)]}>
          <meshStandardMaterial color="#e53e3e" />
        </Box>
      )}
    </group>
  );
}

function CircuitWires({ width, height }) {
  const w = width / 2;
  const h = height / 2;

  return (
    <group>
      {/* Top wire */}
      <Cylinder args={[0.025, 0.025, width]} position={[0, h, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#805ad5" />
      </Cylinder>
      {/* Bottom wire */}
      <Cylinder args={[0.025, 0.025, width]} position={[0, -h, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#805ad5" />
      </Cylinder>
      {/* Left wire */}
      <Cylinder args={[0.025, 0.025, height]} position={[-w, 0, 0]}>
        <meshStandardMaterial color="#805ad5" />
      </Cylinder>
      {/* Right wire */}
      <Cylinder args={[0.025, 0.025, height]} position={[w, 0, 0]}>
        <meshStandardMaterial color="#805ad5" />
      </Cylinder>
    </group>
  );
}

function Scene({ voltage, resistance, isOn }) {
  const current = voltage / resistance;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 8, 5]} intensity={1} castShadow />
      <pointLight position={[-3, 6, -3]} intensity={0.3} />
      <OrbitControls enablePan enableZoom enableRotate minDistance={3} maxDistance={15} />

      {/* Circuit wires */}
      <CircuitWires width={3} height={2} />

      {/* Battery (left side) */}
      <Battery position={[-1.5, 0, 0]} />

      {/* Resistor (top) */}
      <Resistor position={[0, 1, 0]} resistance={resistance} />

      {/* Ammeter (right side) */}
      <Ammeter position={[1.5, 0, 0]} current={isOn ? current : 0} />

      {/* Electron flow */}
      <ElectronFlow voltage={voltage} resistance={resistance} isOn={isOn} />

      {/* Background board */}
      <Box args={[5, 3.5, 0.1]} position={[0, 0, -0.3]}>
        <meshStandardMaterial color="#f7fafc" />
      </Box>
    </>
  );
}

const panelStyle = {
  position: 'absolute', left: 20, top: 20,
  background: 'rgba(255,255,255,0.95)', padding: '20px',
  borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  width: '300px', backdropFilter: 'blur(10px)', maxHeight: '90vh', overflowY: 'auto',
};

export default function Circuit3D() {
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(20);
  const [isOn, setIsOn] = useState(false);

  const current = voltage / resistance;
  const power = voltage * current;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #1a202c, #2d3748)' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} shadows>
        <Scene voltage={voltage} resistance={resistance} isOn={isOn} />
      </Canvas>

      <div style={panelStyle}>
        <h3 style={{ margin: '0 0 16px', color: '#333' }}>⚡ Circuit Controls</h3>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
            Voltage: {voltage.toFixed(1)} V
          </label>
          <input type="range" min="0" max="12" step="0.5" value={voltage}
            onChange={(e) => setVoltage(parseFloat(e.target.value))}
            style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
            Resistance: {resistance} Ω
          </label>
          <input type="range" min="1" max="100" step="1" value={resistance}
            onChange={(e) => setResistance(parseFloat(e.target.value))}
            style={{ width: '100%' }} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button onClick={() => setIsOn(!isOn)}
            style={{
              flex: 1, padding: '12px',
              background: isOn ? '#e53e3e' : '#38a169',
              color: '#fff', border: 'none', borderRadius: '6px',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
            }}>
            {isOn ? '🔴 Switch OFF' : '🟢 Switch ON'}
          </button>
        </div>

        {/* Live readings */}
        <div style={{ background: isOn ? '#f0fff4' : '#f7fafc', border: `1px solid ${isOn ? '#68d391' : '#e2e8f0'}`, borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#2d3748' }}>📊 Ammeter Reading</h4>
          <p style={{ margin: '3px 0', fontSize: '14px' }}>
            Current (I): <strong style={{ color: isOn ? '#276749' : '#a0aec0' }}>{isOn ? current.toFixed(3) : '0.000'} A</strong>
          </p>
          <p style={{ margin: '3px 0', fontSize: '14px' }}>
            Power (P): <strong>{isOn ? power.toFixed(2) : '0.00'} W</strong>
          </p>
        </div>

        <div style={{ background: 'rgba(240,248,255,0.8)', padding: '15px', borderRadius: '8px', border: '1px solid #B0D4E3' }}>
          <h4 style={{ margin: '0 0 10px', color: '#2C5282' }}>📐 Ohm's Law</h4>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>V = IR</strong></p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>I = V/R</strong> = {voltage}/{resistance} = {current.toFixed(3)} A</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>P = IV</strong> = {current.toFixed(3)} × {voltage} = {power.toFixed(2)} W</p>
          <p style={{ margin: '4px 0', fontSize: '11px', color: '#666' }}>
            V = {voltage}V, R = {resistance}Ω
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', right: 20, top: 20, background: 'rgba(255,255,255,0.9)', padding: '15px', borderRadius: '8px', maxWidth: '220px' }}>
        <h4 style={{ margin: '0 0 10px' }}>🎮 Controls</h4>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>🖱️ <strong>Mouse:</strong> Rotate view</p>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>🔄 <strong>Scroll:</strong> Zoom</p>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>✋ <strong>Drag:</strong> Pan</p>
        <h4 style={{ margin: '12px 0 8px' }}>💡 Legend</h4>
        <p style={{ margin: '3px 0', fontSize: '13px' }}>🟡 Gold dots = Electrons</p>
        <p style={{ margin: '3px 0', fontSize: '13px' }}>🟣 Purple = Wires</p>
      </div>
    </div>
  );
}
