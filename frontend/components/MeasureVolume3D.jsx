import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

const OBJECTS = {
  block: { name: 'Regular Block', type: 'regular', initialVolume: 24, color: '#f59e0b' },
  stone: { name: 'Irregular Stone', type: 'irregular', volume: 15, color: '#64748b' }
};

function GraduatedCylinder({ waterHeight, maxVolume = 100 }) {
  const marks = [];
  for (let i = 0; i <= maxVolume; i += 10) {
    marks.push(
      <group key={i} position={[0, (i / maxVolume) * 6 - 3, 0.6]}>
        <Box args={[0.2, 0.02, 0.01]}>
          <meshStandardMaterial color="black" />
        </Box>
        <Text position={[0.4, 0, 0]} fontSize={0.15} color="black">
          {i}
        </Text>
      </group>
    );
  }

  return (
    <group position={[0, 3, 0]}>
      {/* Glass Body */}
      <Cylinder args={[0.6, 0.6, 6, 32]} transparent opacity={0.3}>
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.4} metalness={0.1} roughness={0} />
      </Cylinder>
      
      {/* Water */}
      <mesh position={[0, (waterHeight / maxVolume) * 3 - 3, 0]}>
        <cylinderGeometry args={[0.58, 0.58, (waterHeight / maxVolume) * 6]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
      </mesh>

      {/* Graduation Marks */}
      {marks}
    </group>
  );
}

export default function MeasureVolume3D() {
  const [selectedObject, setSelectedObject] = useState('block');
  const [isSubmerged, setIsSubmerged] = useState(false);
  const [blockDims, setBlockDims] = useState({ l: 2, w: 3, h: 4 }); // cm
  const [waterBase, setWaterBase] = useState(40); // mL

  const blockVol = blockDims.l * blockDims.w * blockDims.h;
  const stoneVol = OBJECTS.stone.volume;
  const currentObjectVol = selectedObject === 'block' ? blockVol : stoneVol;
  
  const totalVolume = waterBase + (isSubmerged ? currentObjectVol : 0);

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Choose Object:</label>
        <div style={{ display: 'flex', gap: '10px' }}>
            {Object.entries(OBJECTS).map(([key, info]) => (
                <button
                    key={key}
                    onClick={() => { setSelectedObject(key); setIsSubmerged(false); }}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: selectedObject === key ? '#3b82f6' : '#f1f5f9',
                        color: selectedObject === key ? 'white' : '#1e293b',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    {info.name}
                </button>
            ))}
        </div>
      </div>

      {selectedObject === 'block' && (
        <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Adjust Block (cm):</label>
            <div style={{ marginTop: '10px' }}>
                L: {blockDims.l} <input type="range" min="1" max="4" value={blockDims.l} onChange={(e) => setBlockDims({...blockDims, l: parseInt(e.target.value)})} style={{ width: '100%' }} />
                W: {blockDims.w} <input type="range" min="1" max="4" value={blockDims.w} onChange={(e) => setBlockDims({...blockDims, w: parseInt(e.target.value)})} style={{ width: '100%' }} />
                H: {blockDims.h} <input type="range" min="1" max="5" value={blockDims.h} onChange={(e) => setBlockDims({...blockDims, h: parseInt(e.target.value)})} style={{ width: '100%' }} />
            </div>
            <p style={{ marginTop: '5px', fontSize: '0.8rem', color: '#64748b' }}>Calc: {blockDims.l} × {blockDims.w} × {blockDims.h} = <strong>{blockVol} cm³</strong></p>
        </div>
      )}

      <button
        onClick={() => setIsSubmerged(!isSubmerged)}
        style={{
            padding: '12px',
            background: isSubmerged ? '#ef4444' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
        }}
      >
        {isSubmerged ? '⬆️ Remove from Water' : '⬇️ Submerge Object'}
      </button>

      <div style={{ padding: '10px', background: '#f0f9ff', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid #bae6fd' }}>
         <strong>Reading:</strong> {totalVolume.toFixed(1)} mL (cm³)<br/>
         <small>1 mL = 1 cm³</small>
      </div>
    </div>
  );

  const theory = {
    formula: "V_object = V_final - V_initial",
    values: [
      { label: "Initial Water", value: `${waterBase} mL` },
      { label: "Total Reading", value: `${totalVolume.toFixed(1)} mL` },
      { label: "Displaced Vol", value: `${(totalVolume - waterBase).toFixed(1)} cm³` }
    ]
  };

  return (
    <ExperimentShell title="Measurement of Volume" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [5, 4, 8], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        
        <Center top>
          {/* Floor / Sink area */}
          <Box args={[8, 0.2, 5]} position={[0, -0.1, 0]}>
            <meshStandardMaterial color="#94a3b8" />
          </Box>

          <GraduatedCylinder waterHeight={totalVolume} />

          {/* Object Animation */}
          <group position={[isSubmerged ? 0 : 3, isSubmerged ? (totalVolume/100 * 6 - 3) : 1, 0]}>
             <Float speed={isSubmerged ? 0 : 2} rotationIntensity={0.2} floatIntensity={0.2}>
                {selectedObject === 'block' ? (
                   <Box args={[blockDims.l/10, blockDims.h/10, blockDims.w/10]}>
                     <meshStandardMaterial color={OBJECTS.block.color} />
                   </Box>
                ) : (
                   <Sphere args={[0.3, 16, 16]}>
                     <meshStandardMaterial color={OBJECTS.stone.color} roughness={1} />
                   </Sphere>
                )}
             </Float>
             {/* Thread */}
             <Cylinder args={[0.005, 0.005, 10]} position={[0, 5, 0]}>
                <meshStandardMaterial color="white" />
             </Cylinder>
          </group>
        </Center>

        <OrbitControls />
      </Canvas>
    </ExperimentShell>
  );
}
