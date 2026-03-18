import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Text, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

// Constants for precision tools
const TOOLS = {
  ruler: { name: 'Meter Rule', leastCount: '1 mm', precision: 0.1 },
  vernier: { name: 'Vernier Calipers', leastCount: '0.1 mm', precision: 0.01 },
  micrometer: { name: 'Micrometer Screw Gauge', leastCount: '0.01 mm', precision: 0.001 }
};

const OBJECTS = {
  block: { name: 'Steel Block', trueSize: 4.2 }, // cm
  marble: { name: 'Marble', trueSize: 1.55 }, // cm
  wire: { name: 'Thin Wire', trueSize: 0.125 } // cm
};

function RulerScale({ length = 10 }) {
  const marks = [];
  for (let i = 0; i <= length * 10; i++) {
    const isMajor = i % 10 === 0;
    const isMid = i % 5 === 0 && !isMajor;
    marks.push(
      <group key={i} position={[i * 0.1 - (length * 0.5), 0, 0]}>
        <Box args={[0.01, isMajor ? 0.3 : (isMid ? 0.2 : 0.1), 0.02]}>
          <meshStandardMaterial color="black" />
        </Box>
        {isMajor && (
          <Text position={[0, 0.4, 0]} fontSize={0.15} color="black">
            {i / 10}
          </Text>
        )}
      </group>
    );
  }
  return <group>{marks}</group>;
}

function VernierTool({ jawPosition, onAdjust }) {
  return (
    <group position={[-2, 0, 0]}>
      {/* Fixed part */}
      <Box args={[0.2, 2, 0.2]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
      <Box args={[5, 0.4, 0.2]} position={[2.4, 0.3, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
      <RulerScale length={5} />

      {/* Sliding jaw */}
      <group position={[jawPosition, 0, 0]}>
        <Box args={[0.2, 1.5, 0.25]} position={[0, -0.25, 0]}>
          <meshStandardMaterial color="#cbd5e1" />
        </Box>
        <Box args={[0.8, 0.5, 0.25]} position={[0, 0.3, 0]}>
          <meshStandardMaterial color="#cbd5e1" />
        </Box>
        {/* Vernier scale markings */}
        <group position={[0, 0.4, 0.13]}>
           {[...Array(11)].map((_, i) => (
             <Box key={i} args={[0.01, 0.1, 0.01]} position={[i * 0.09, 0, 0]}>
               <meshStandardMaterial color="red" />
             </Box>
           ))}
        </group>
      </group>
    </group>
  );
}

export default function MeasureLength3D() {
  const [selectedTool, setSelectedTool] = useState('ruler');
  const [selectedObject, setSelectedObject] = useState('block');
  const [adjustment, setAdjustment] = useState(0);
  const [showReading, setShowReading] = useState(false);

  const toolInfo = TOOLS[selectedTool];
  const objectInfo = OBJECTS[selectedObject];

  useEffect(() => {
    setAdjustment(0);
    setShowReading(false);
  }, [selectedTool, selectedObject]);

  const handleAdjustmentChange = (e) => {
    const val = parseFloat(e.target.value);
    setAdjustment(val);
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Instrument:</label>
        <select 
          value={selectedTool} 
          onChange={(e) => setSelectedTool(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        >
          {Object.entries(TOOLS).map(([key, info]) => (
            <option key={key} value={key}>{info.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Object:</label>
        <select 
          value={selectedObject} 
          onChange={(e) => setSelectedObject(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        >
          {Object.entries(OBJECTS).map(([key, info]) => (
            <option key={key} value={key}>{info.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Adjust {toolInfo.name}:
        </label>
        <input 
          type="range"
          min="0"
          max="5"
          step={toolInfo.precision === 0.001 ? "0.001" : "0.01"}
          value={adjustment}
          onChange={handleAdjustmentChange}
          style={{ width: '100%' }}
        />
      </div>

      <button 
        onClick={() => setShowReading(!showReading)}
        style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        {showReading ? 'Hide Reading' : 'Take Reading'}
      </button>

      <div style={{ padding: '10px', background: '#f0f9ff', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #bae6fd' }}>
        <strong>Instrument Info:</strong><br/>
        Least Count: {toolInfo.leastCount}<br/>
        Use for: {selectedTool === 'micrometer' ? 'Very thin objects' : selectedTool === 'vernier' ? 'Internal/External diameter' : 'General length'}
      </div>
    </div>
  );

  const reading = showReading ? adjustment.toFixed(selectedTool === 'micrometer' ? 3 : 2) + " cm" : "?.?? cm";

  const theory = {
    formula: "Precision = Least Count of Scale",
    values: [
      { label: "Instrument", value: toolInfo.name },
      { label: "Least Count", value: toolInfo.leastCount },
      { label: "Measured Value", value: reading }
    ]
  };

  return (
    <ExperimentShell title="Measurement of Length" controls={controls} theory={theory}>
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} castShadow />
        
        <Center top position={[0, -1, 0]}>
          {/* Object being measured */}
          <group position={[-2 + (adjustment / 2), 0, 0]}>
            {selectedObject === 'block' && (
               <Box args={[objectInfo.trueSize, 1, 1]}>
                 <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
               </Box>
            )}
            {selectedObject === 'marble' && (
               <Sphere args={[objectInfo.trueSize / 2, 32, 32]}>
                 <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
               </Sphere>
            )}
            {selectedObject === 'wire' && (
               <Cylinder args={[objectInfo.trueSize / 2, objectInfo.trueSize / 2, 4, 16]} rotation={[0, 0, Math.PI / 2]}>
                 <meshStandardMaterial color="#94a3b8" />
               </Cylinder>
            )}
          </group>

          {/* Measuring Tool Visualization */}
          {selectedTool === 'ruler' && (
            <group position={[0, 0.8, 0.6]}>
              <Box args={[10.2, 0.6, 0.1]}>
                <meshStandardMaterial color="#fef08a" />
              </Box>
              <RulerScale length={10} />
            </group>
          )}

          {selectedTool === 'vernier' && (
            <VernierTool jawPosition={adjustment} />
          )}

          {selectedTool === 'micrometer' && (
            <group position={[0, 0, 1]}>
               {/* Frame */}
               <Cylinder args={[1.5, 1.5, 0.2, 32, 1, true, 0, Math.PI]} rotation={[0, 0, -Math.PI/2]} position={[-1, 0, 0]}>
                 <meshStandardMaterial color="#475569" />
               </Cylinder>
               {/* Nut */}
               <Cylinder args={[0.3, 0.3, 3, 16]} rotation={[0, 0, Math.PI/2]} position={[0.5, 0, 0]}>
                 <meshStandardMaterial color="#94a3b8" />
               </Cylinder>
               {/* Thimble (the part that turns) */}
               <group position={[1.5 + adjustment, 0, 0]}>
                 <Cylinder args={[0.4, 0.4, 2, 32]} rotation={[0, 0, Math.PI/2]}>
                   <meshStandardMaterial color="#cbd5e1" />
                 </Cylinder>
                 {/* Thimble marks */}
                 {[...Array(50)].map((_, i) => (
                    <Box key={i} args={[0.01, 0.1, 0.01]} rotation={[i * (Math.PI * 2 / 50), 0, 0]} position={[0, 0.4, 0]}>
                      <meshStandardMaterial color="black" />
                    </Box>
                 ))}
               </group>
            </group>
          )}
        </Center>

        <OrbitControls enablePan={true} />
      </Canvas>
    </ExperimentShell>
  );
}
