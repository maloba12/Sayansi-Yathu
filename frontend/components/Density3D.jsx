import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

const OBJECTS = {
  cube: { label: 'Iron Cube', mass: 7.8, volume: 1, color: '#4a5568', density: 7.8, shape: 'box', args: [1, 1, 1] },
  cylinder: { label: 'Aluminum Cylinder', mass: 2.7, volume: 1, color: '#a0aec0', density: 2.7, shape: 'cylinder', args: [0.5, 0.5, 1.2, 32] },
  rock: { label: 'Unknown Rock', mass: 4.5, volume: 1.5, color: '#718096', density: 3.0, shape: 'sphere', args: [0.6, 32, 32] },
};

function WaterTank({ depth = 2, width = 3, height = 4 }) {
  return (
    <group>
      {/* Tank walls */}
      <Box args={[width + 0.1, height, width + 0.1]} position={[0, height / 2, 0]}>
        <meshStandardMaterial color="#fff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Box>
      {/* Water */}
      <Box args={[width, depth, width]} position={[0, depth / 2, 0]}>
        <meshStandardMaterial color="#3182ce" transparent opacity={0.6} />
      </Box>
      {/* Container base */}
      <Box args={[width + 0.2, 0.1, width + 0.2]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#2d3748" />
      </Box>
    </group>
  );
}

function PhysicalObject({ objectKey, position, isSubmerged, submergedDepth }) {
  const obj = OBJECTS[objectKey];
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      if (isSubmerged) {
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, submergedDepth, 0.1);
      } else {
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1], 0.1);
      }
    }
  });

  if (obj.shape === 'box') {
    return <Box ref={ref} args={obj.args} position={position} castShadow><meshStandardMaterial color={obj.color} metalness={0.6} roughness={0.2} /></Box>;
  } else if (obj.shape === 'cylinder') {
    return <Cylinder ref={ref} args={obj.args} position={position} castShadow><meshStandardMaterial color={obj.color} metalness={0.4} roughness={0.3} /></Cylinder>;
  } else {
    return <Sphere ref={ref} args={obj.args} position={position} castShadow><meshStandardMaterial color={obj.color} roughness={0.8} /></Sphere>;
  }
}

function ElectronicBalance({ weight }) {
  return (
    <group position={[-3, 0, 0]}>
      <Box args={[2, 0.5, 2]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#cbd5e0" />
      </Box>
      <Box args={[1.8, 0.1, 1.8]} position={[0, 0.55, 0]}>
        <meshStandardMaterial color="#a0aec0" metalness={0.8} />
      </Box>
      <Text position={[0, 0.35, 1.01]} fontSize={0.2} color="#2d3748" anchorX="center">
        {weight.toFixed(2)} g
      </Text>
    </group>
  );
}

export default function Density3D() {
  const [selectedObj, setSelectedObj] = useState('cube');
  const [isMeasuringMass, setIsMeasuringMass] = useState(true);
  const [isMeasuringVolume, setIsMeasuringVolume] = useState(false);
  const [viewDensity, setViewDensity] = useState(false);

  const obj = OBJECTS[selectedObj];
  const initialWaterLevel = 2;
  const displacedWaterLevel = initialWaterLevel + (obj.volume * 0.2); // scale for visual effect

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #f7fafc, #edf2f7)' }}>
      <Canvas camera={{ position: [5, 5, 8], fov: 50 }} shadows>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <OrbitControls enablePan={false} />

        {/* Lab Table */}
        <Box args={[12, 0.2, 10]} position={[0, -0.1, 0]} receiveShadow>
          <meshStandardMaterial color="#e2e8f0" />
        </Box>

        {/* Measurement Equipment */}
        <ElectronicBalance weight={isMeasuringMass ? obj.mass : 0} />
        <group position={[2, 0, 0]}>
          <WaterTank depth={isMeasuringVolume ? displacedWaterLevel : initialWaterLevel} />
          {/* Measuring Cylinder markings on the tank (simulated) */}
          {[0.5, 1, 1.5, 2, 2.5, 3, 3.5].map(y => (
             <Box key={y} args={[0.2, 0.02, 0.02]} position={[1.55, y, 1.55]}>
                <meshStandardMaterial color="#4a5568" />
             </Box>
          ))}
        </group>

        {/* The Object */}
        <PhysicalObject 
          objectKey={selectedObj} 
          position={isMeasuringMass ? [-3, 0.8, 0] : (isMeasuringVolume ? [2, 1.5, 0] : [0, 0.5, 2])} 
          isSubmerged={isMeasuringVolume}
          submergedDepth={displacedWaterLevel - 0.5}
        />
      </Canvas>

      {/* UI Panels */}
      <div style={{ position: 'absolute', left: 20, top: 20, width: 300, background: 'rgba(255,255,255,0.95)', padding: 20, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 16px' }}>⚖️ Density Lab</h3>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Select Object:</label>
          <select value={selectedObj} onChange={(e) => setSelectedObj(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4 }}>
            {Object.entries(OBJECTS).map(([key, o]) => <option key={key} value={key}>{o.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => {setIsMeasuringMass(true); setIsMeasuringVolume(false); setViewDensity(false);}} 
            style={{ padding: 10, background: isMeasuringMass ? '#3182ce' : '#edf2f7', color: isMeasuringMass ? '#fff' : '#2d3748', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            1. Measure Mass
          </button>
          <button onClick={() => {setIsMeasuringMass(false); setIsMeasuringVolume(true); setViewDensity(false);}} 
            style={{ padding: 10, background: isMeasuringVolume ? '#3182ce' : '#edf2f7', color: isMeasuringVolume ? '#fff' : '#2d3748', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            2. Measure Volume (Displacement)
          </button>
          <button onClick={() => setViewDensity(true)} 
            style={{ padding: 10, background: viewDensity ? '#38a169' : '#edf2f7', color: viewDensity ? '#fff' : '#2d3748', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            3. Calculate Density
          </button>
        </div>

        {viewDensity && (
          <div style={{ marginTop: 20, padding: 15, background: '#f0fff4', border: '1px solid #68d391', borderRadius: 8 }}>
            <h4 style={{ margin: '0 0 8px', color: '#2f855a' }}>Results:</h4>
            <p>Mass: <strong>{obj.mass} g</strong></p>
            <p>Volume: <strong>{obj.volume} cm³</strong></p>
            <p style={{ borderTop: '1px solid #68d391', paddingTop: 8, marginTop: 8 }}>
              Density = Mass / Volume<br/>
              <strong>= {(obj.mass / obj.volume).toFixed(2)} g/cm³</strong>
            </p>
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(255,255,255,0.9)', padding: 15, borderRadius: 8, maxWidth: 400 }}>
        <h4 style={{ margin: '0 0 8px' }}>📖 Theory: Displacement Method</h4>
        <p style={{ fontSize: '0.9rem', margin: 0 }}>
          For irregular objects, we measure volume by submerging them in water. 
          The volume of the displaced water equals the volume of the object.
          <strong> Density = Mass / Volume.</strong>
        </p>
      </div>
    </div>
  );
}
