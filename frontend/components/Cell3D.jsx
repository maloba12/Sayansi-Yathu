import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Float, Torus } from '@react-three/drei';
import * as THREE from 'three';

const ORGANELLES = {
  nucleus: { name: 'Nucleus', function: 'Controls cell activities and contains DNA.' },
  vacuole: { name: 'Vacuole', function: 'Stores water, nutrients, and waste. Large in plant cells.' },
  mitochondria: { name: 'Mitochondria', function: 'The powerhouse of the cell; where respiration occurs.' },
  cell_wall: { name: 'Cell Wall', function: 'Provides structure and protection. Only in plant cells.' },
  cytoplasm: { name: 'Cytoplasm', function: 'Jelly-like substance where chemical reactions happen.' },
  cell_membrane: { name: 'Cell Membrane', function: 'Controls what enters and leaves the cell.' },
  chloroplast: { name: 'Chloroplast', function: 'Site of photosynthesis. Contains chlorophyll. Only in plants.' },
};

function Organelle({ position, type, color, args = [0.2, 16, 16], shape = 'sphere', rotation = [0,0,0], onClick }) {
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onClick(type); }}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {shape === 'sphere' && (
          <Sphere args={args}>
            <meshStandardMaterial color={color} />
          </Sphere>
        )}
        {shape === 'box' && (
          <Box args={args}>
            <meshStandardMaterial color={color} />
          </Box>
        )}
        {shape === 'cylinder' && (
          <Cylinder args={args}>
            <meshStandardMaterial color={color} />
          </Cylinder>
        )}
        {shape === 'torus' && (
          <Torus args={args}>
            <meshStandardMaterial color={color} />
          </Torus>
        )}
      </Float>
    </group>
  );
}

function PlantCell({ onSelect }) {
  return (
    <group>
      {/* Cell Wall (Stiff Boundary) */}
      <Box args={[3.2, 3.2, 1.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#22543d" transparent opacity={0.2} side={THREE.DoubleSide} />
      </Box>
      <Box args={[3.1, 3.1, 1.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#38a169" transparent opacity={0.3} />
      </Box>
      
      {/* Nucleus */}
      <Organelle position={[-0.8, 0.8, 0]} type="nucleus" color="#9b2c2c" args={[0.3, 32, 32]} onClick={onSelect} />
      
      {/* Large Vacuole */}
      <Organelle position={[0.4, 0, 0]} type="vacuole" color="#ebf8ff" args={[1, 0.8, 0.6]} shape="box" onClick={onSelect} />
      
      {/* Chloroplasts */}
      {[ [1,1,0.2], [1,-1,0.2], [-1,-0.8,0.2], [-1.2, 0, 0.2] ].map((pos, i) => (
        <Organelle key={i} position={pos} type="chloroplast" color="#48bb78" args={[0.15, 0.05, 32]} shape="cylinder" rotation={[Math.PI/2, 0, 0]} onClick={onSelect} />
      ))}
      
      {/* Mitochondria */}
      <Organelle position={[-0.5, -0.5, 0.2]} type="mitochondria" color="#ed8936" args={[0.1, 0.2, 16]} shape="cylinder" onClick={onSelect} />
    </group>
  );
}

function AnimalCell({ onSelect }) {
  return (
    <group>
      {/* Cell Membrane (Rounded Boundary) */}
      <Sphere args={[1.6, 32, 32]}>
        <meshStandardMaterial color="#ecc94b" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Sphere>
      <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial color="#f6e05e" transparent opacity={0.2} />
      </Sphere>
      
      {/* Nucleus (Central) */}
      <Organelle position={[0, 0, 0]} type="nucleus" color="#9b2c2c" args={[0.4, 32, 32]} onClick={onSelect} />
      
      {/* Small Vacuoles */}
      <Organelle position={[0.8, 0.8, 0.2]} type="vacuole" color="#ebf8ff" args={[0.1, 16, 16]} onClick={onSelect} />
      <Organelle position={[-0.8, -0.8, -0.2]} type="vacuole" color="#ebf8ff" args={[0.1, 16, 16]} onClick={onSelect} />
      
      {/* Mitochondria */}
      {[ [0.8,-0.5,0.3], [-0.7,0.6,-0.3] ].map((pos, i) => (
        <Organelle key={i} position={pos} type="mitochondria" color="#ed8936" args={[0.1, 0.2, 16]} shape="cylinder" onClick={onSelect} />
      ))}
    </group>
  );
}

export default function Cell3D() {
  const [cellType, setCellType] = useState('plant');
  const [selectedOrganelle, setSelectedOrganelle] = useState(null);

  const info = ORGANELLES[selectedOrganelle];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#1a202c' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls enablePan={true} />

        {cellType === 'plant' ? (
          <PlantCell onSelect={setSelectedOrganelle} />
        ) : (
          <AnimalCell onSelect={setSelectedOrganelle} />
        )}
      </Canvas>

      <div style={{ position: 'absolute', left: 20, top: 20, width: 340, background: 'rgba(45, 55, 72, 0.9)', color: '#fff', padding: 25, borderRadius: 15, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ margin: '0 0 10px', color: '#63b3ed' }}>Biological Cells</h2>
        <p style={{ fontSize: '0.9rem', color: '#a0aec0', marginBottom: 20 }}>Compare the structure of Plant and Animal cells.</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button onClick={() => {setCellType('plant'); setSelectedOrganelle(null);}} 
            style={{ flex: 1, padding: '12px', background: cellType === 'plant' ? '#38a169' : '#2d3748', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            PLANT CELL
          </button>
          <button onClick={() => {setCellType('animal'); setSelectedOrganelle(null);}} 
            style={{ flex: 1, padding: '12px', background: cellType === 'animal' ? '#d69e2e' : '#2d3748', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            ANIMAL CELL
          </button>
        </div>

        {selectedOrganelle ? (
          <div style={{ padding: 15, background: 'rgba(255,255,255,0.05)', borderRadius: 10, borderLeft: '4px solid #63b3ed' }}>
            <h4 style={{ margin: '0 0 5px', color: '#63b3ed' }}>{info.name}</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.4 }}>{info.function}</p>
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#718096', textAlign: 'center' }}>Click an organelle to learn about its function.</p>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: 20, color: '#a0aec0', fontSize: '0.8rem' }}>
        Rotate: Drag • Zoom: Scroll • Pan: Right Click
      </div>
    </div>
  );
}
