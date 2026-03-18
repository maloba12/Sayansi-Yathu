import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

const LAYERS = {
  crust: { name: 'Crust', depth: '0 - 35km', temp: '0 - 500°C', state: 'Solid', color: '#78350f' },
  mantle: { name: 'Mantle', depth: '35 - 2900km', temp: '500 - 4000°C', state: 'Plastic/Semi-solid', color: '#ea580c' },
  outerCore: { name: 'Outer Core', depth: '2900 - 5150km', temp: '4000 - 5000°C', state: 'Liquid', color: '#f59e0b' },
  innerCore: { name: 'Inner Core', depth: '5150 - 6400km', temp: '5000 - 6400°C', state: 'Solid (due to pressure)', color: '#fef3c7' }
};

function EarthLayer({ radius, color, isSelected, onClick }) {
   return (
      <Sphere 
        args={[radius, 32, 32]} 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
         <meshStandardMaterial 
           color={color} 
           transparent={!isSelected} 
           opacity={isSelected ? 1 : 0.4}
           emissive={color}
           emissiveIntensity={isSelected ? 0.5 : 0}
         />
      </Sphere>
   );
}

export default function EarthStructure3D() {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [depth, setDepth] = useState(0);

  const getLayerAtDepth = (d) => {
    if (d < 35) return LAYERS.crust;
    if (d < 2900) return LAYERS.mantle;
    if (d < 5150) return LAYERS.outerCore;
    return LAYERS.innerCore;
  };

  const currentInfo = getLayerAtDepth(depth);

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
         <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Depth Probe: <strong>{depth} km</strong>
         </label>
         <input 
            type="range"
            min="0"
            max="6400"
            step="10"
            value={depth}
            onChange={(e) => setDepth(parseInt(e.target.value))}
            style={{ width: '100%' }}
         />
      </div>

      <div style={{ padding: '15px', background: currentInfo.color + '22', borderRadius: '10px', borderLeft: `5px solid ${currentInfo.color}` }}>
         <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Exploring: {currentInfo.name}</h4>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
            <div><strong>Depth:</strong> {currentInfo.depth}</div>
            <div><strong>Temp:</strong> {currentInfo.temp}</div>
            <div><strong>State:</strong> {currentInfo.state}</div>
         </div>
      </div>

      <div style={{ marginTop: '10px' }}>
         <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
            * Note how temperature and pressure increase significantly as the probe goes deeper towards the core.
         </p>
      </div>
    </div>
  );

  const theory = {
    formula: "Earth's Composition",
    values: [
      { label: "Radius", value: "~ 6,400 km" },
      { label: "Surface Pressure", value: "1 atm" },
      { label: "Core Pressure", value: "~ 3.6 million atm" }
    ]
  };

  return (
    <ExperimentShell title="Structure of the Earth" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Center>
           {/* Sectional Cutout visualization idea */}
           <group rotation={[Math.PI / 4, Math.PI / 4, 0]}>
              {/* Inner Core */}
              <EarthLayer radius={1} color={LAYERS.innerCore.color} isSelected={currentInfo.name === 'Inner Core'} onClick={() => setDepth(6000)} />
              {/* Outer Core */}
              <EarthLayer radius={2} color={LAYERS.outerCore.color} isSelected={currentInfo.name === 'Outer Core'} onClick={() => setDepth(4000)} />
              {/* Mantle */}
              <EarthLayer radius={3.5} color={LAYERS.mantle.color} isSelected={currentInfo.name === 'Mantle'} onClick={() => setDepth(1000)} />
              {/* Crust */}
              <EarthLayer radius={3.7} color={LAYERS.crust.color} isSelected={currentInfo.name === 'Crust'} onClick={() => setDepth(10)} />
           </group>

           {/* Depth Probe Indicator */}
           <group position={[0, -4.5, 0]}>
              <Box args={[10, 0.2, 0.2]}>
                 <meshStandardMaterial color="#e2e8f0" />
              </Box>
              <Box position={[(depth / 6400) * 10 - 5, 0, 0]} args={[0.2, 0.4, 0.4]}>
                 <meshStandardMaterial color="#ef4444" />
              </Box>
           </group>
        </Center>

        <OrbitControls makeDefault enablePan={false} />
      </Canvas>
    </ExperimentShell>
  );
}
