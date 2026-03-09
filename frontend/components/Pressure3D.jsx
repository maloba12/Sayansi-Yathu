import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

const BLOCK_MODES = {
  flat: { label: 'Flat (Large Area)', area: 4, scale: [2, 0.5, 2], indent: 0.1 },
  side: { label: 'Side (Medium Area)', area: 1, scale: [0.5, 2, 2], indent: 0.2 },
  upright: { label: 'Upright (Small Area)', area: 0.25, scale: [0.5, 2, 0.5], indent: 0.4 },
};

function SandBed() {
  return (
    <Box args={[6, 0.5, 6]} position={[0, -0.25, 0]}>
      <meshStandardMaterial color="#f6e05e" roughness={1} />
    </Box>
  );
}

function PressureBlock({ mode, mass }) {
  const ref = useRef();
  const config = BLOCK_MODES[mode];
  const pressure = (mass * 9.81) / config.area;
  const indentDepth = (pressure / 100) * config.indent;

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, (config.scale[1] / 2) - indentDepth, 0.1);
    }
  });

  return (
    <Box ref={ref} args={config.scale} castShadow>
      <meshStandardMaterial color="#4a5568" />
    </Box>
  );
}

function WaterTankPressure({ depth }) {
  const density = 1000; // kg/m^3
  const g = 9.81;
  const pressure = depth * density * g;

  return (
    <group position={[4, 0, 0]}>
       {/* Tank */}
       <Box args={[2, 4, 2]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#fff" transparent opacity={0.1} side={THREE.DoubleSide} />
       </Box>
       {/* Water */}
       <Box args={[1.9, 4, 1.9]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#3182ce" transparent opacity={0.4} />
       </Box>
       {/* Probe */}
       <group position={[0, 4 - depth, 0]}>
          <Cylinder args={[0.05, 0.05, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
             <meshStandardMaterial color="#e53e3e" />
          </Cylinder>
          <Text position={[0.5, 0, 0]} fontSize={0.2} color="#2d3748">
             {depth.toFixed(1)} m
          </Text>
       </group>
       <Text position={[0, -0.5, 0]} fontSize={0.25} color="#2d3748" anchorX="center">
          P = {(pressure / 1000).toFixed(1)} kPa
       </Text>
    </group>
  );
}

export default function Pressure3D() {
  const [mode, setMode] = useState('flat');
  const [mass, setMass] = useState(10);
  const [liquidDepth, setLiquidDepth] = useState(1);
  const [tab, setTab] = useState('solids');

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #edf2f7, #e2e8f0)' }}>
      <Canvas camera={{ position: [6, 4, 8], fov: 45 }} shadows>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <OrbitControls />

        {tab === 'solids' ? (
          <group>
            <SandBed />
            <PressureBlock mode={mode} mass={mass} />
          </group>
        ) : (
          <WaterTankPressure depth={liquidDepth} />
        )}
        
        {/* Floor */}
        <Box args={[20, 0.1, 20]} position={[0, -0.55, 0]} receiveShadow>
          <meshStandardMaterial color="#cbd5e0" />
        </Box>
      </Canvas>

      <div style={{ position: 'absolute', left: 20, top: 20, width: 320, background: 'rgba(255,255,255,0.95)', padding: 20, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 16px' }}>🌬️ Pressure Simulation</h3>
        
        <div style={{ display: 'flex', gap: 5, marginBottom: 20 }}>
           <button onClick={() => setTab('solids')} style={{ flex: 1, padding: 8, background: tab === 'solids' ? '#3182ce' : '#fff', color: tab === 'solids' ? '#fff' : '#2d3748', border: '1px solid #3182ce', borderRadius: 4 }}>Solids</button>
           <button onClick={() => setTab('liquids')} style={{ flex: 1, padding: 8, background: tab === 'liquids' ? '#3182ce' : '#fff', color: tab === 'liquids' ? '#fff' : '#2d3748', border: '1px solid #3182ce', borderRadius: 4 }}>Liquids</button>
        </div>

        {tab === 'solids' ? (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 'bold' }}>Block Orientation:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 5 }}>
                {Object.entries(BLOCK_MODES).map(([key, config]) => (
                  <button key={key} onClick={() => setMode(key)} style={{ padding: 8, textAlign: 'left', background: mode === key ? '#ebf8ff' : '#fff', border: mode === key ? '1px solid #3182ce' : '1px solid #e2e8f0', borderRadius: 4 }}>
                    {config.label} (Area: {config.area} m²)
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
               <label style={{ fontWeight: 'bold' }}>Mass: {mass} kg</label>
               <input type="range" min="1" max="50" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ padding: 15, background: '#fffaf0', border: '1px solid #fbd38d', borderRadius: 8 }}>
               <p style={{ margin: 0 }}>Force (F) = { (mass * 9.81).toFixed(1) } N</p>
               <p style={{ margin: 0 }}>Area (A) = { BLOCK_MODES[mode].area } m²</p>
               <p style={{ margin: '8px 0 0', fontWeight: 'bold' }}>Pressure (P) = F/A = { ((mass * 9.81) / BLOCK_MODES[mode].area).toFixed(1) } Pa</p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 16 }}>
               <label style={{ fontWeight: 'bold' }}>Probe Depth: {liquidDepth.toFixed(1)} m</label>
               <input type="range" min="0.1" max="3.9" step="0.1" value={liquidDepth} onChange={(e) => setLiquidDepth(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ padding: 15, background: '#ebf8ff', border: '1px solid #90cdf4', borderRadius: 8 }}>
               <p style={{ margin: 0 }}>Depth (h) = { liquidDepth.toFixed(1) } m</p>
               <p style={{ margin: 0 }}>Density (ρ) = 1000 kg/m³</p>
               <p style={{ margin: '8px 0 0', fontWeight: 'bold' }}>P = hρg = { (liquidDepth * 1000 * 9.81 / 1000).toFixed(1) } kPa</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(255,255,255,0.9)', padding: 15, borderRadius: 8, maxWidth: 350 }}>
        <h4 style={{ margin: '0 0 8px' }}>📖 Theory</h4>
        <p style={{ fontSize: '0.9rem', margin: 0 }}>
          {tab === 'solids' 
            ? "Pressure in solids decreases as the contact area increases. This is why foundations are wide." 
            : "Pressure in liquids increases with depth due to the weight of the water column above."}
        </p>
      </div>
    </div>
  );
}
