import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

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
      <Box args={[0.6, 0.8, 0.4]}>
        <meshStandardMaterial color="#2d3748" metalness={0.5} roughness={0.3} />
      </Box>
      <Cylinder args={[0.06, 0.06, 0.15]} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#e53e3e" />
      </Cylinder>
      <Cylinder args={[0.06, 0.06, 0.1]} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#3182ce" />
      </Cylinder>
      <Box args={[0.5, 0.15, 0.41]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#e53e3e" />
      </Box>
    </group>
  );
}

function Resistor({ position, resistance }) {
  const hue = Math.max(0, 1 - resistance / 100);
  return (
    <group position={position}>
      <Box args={[0.8, 0.3, 0.3]}>
        <meshStandardMaterial color={`hsl(${hue * 120}, 70%, 50%)`} metalness={0.2} roughness={0.6} />
      </Box>
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
      <Cylinder args={[0.35, 0.35, 0.01, 32]} position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#f7fafc" />
      </Cylinder>
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
      <Cylinder args={[0.025, 0.025, width]} position={[0, h, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#805ad5" />
      </Cylinder>
      <Cylinder args={[0.025, 0.025, width]} position={[0, -h, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#805ad5" />
      </Cylinder>
      <Cylinder args={[0.025, 0.025, height]} position={[-w, 0, 0]}>
        <meshStandardMaterial color="#805ad5" />
      </Cylinder>
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

      <CircuitWires width={3} height={2} />
      <Battery position={[-1.5, 0, 0]} />
      <Resistor position={[0, 1, 0]} resistance={resistance} />
      <Ammeter position={[1.5, 0, 0]} current={isOn ? current : 0} />
      <ElectronFlow voltage={voltage} resistance={resistance} isOn={isOn} />

      <Box args={[5, 3.5, 0.1]} position={[0, 0, -0.3]}>
        <meshStandardMaterial color="#f7fafc" />
      </Box>
    </>
  );
}

export default function Circuit3D() {
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(20);
  const [isOn, setIsOn] = useState(false);

  const current = voltage / resistance;
  const power = voltage * current;

  const controls = (
    <>
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
      <div style={{ background: isOn ? '#f0fff4' : '#f7fafc', border: `1px solid ${isOn ? '#68d391' : '#e2e8f0'}`, borderRadius: '8px', padding: '12px' }}>
        <h4 style={{ margin: '0 0 8px', color: '#2d3748' }}>📊 Ammeter Reading</h4>
        <p style={{ margin: '3px 0', fontSize: '14px' }}>
          Current (I): <strong style={{ color: isOn ? '#276749' : '#a0aec0' }}>{isOn ? current.toFixed(3) : '0.000'} A</strong>
        </p>
        <p style={{ margin: '3px 0', fontSize: '14px' }}>
          Power (P): <strong>{isOn ? power.toFixed(2) : '0.00'} W</strong>
        </p>
      </div>
    </>
  );

  const theory = {
    formula: `V = IR  →  I = V/R = ${voltage}/${resistance} = ${current.toFixed(3)} A`,
    values: [
      { label: 'Power (P = IV)', value: `${current.toFixed(3)} × ${voltage} = ${power.toFixed(2)} W` },
      { label: 'Parameters', value: `V = ${voltage}V, R = ${resistance}Ω` },
    ],
  };

  return (
    <ExperimentShell title="Electric Circuit" controls={controls} theory={theory}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} shadows>
        <Scene voltage={voltage} resistance={resistance} isOn={isOn} />
      </Canvas>
    </ExperimentShell>
  );
}
