import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Points, PointMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';
import ExperimentShell from './ExperimentShell';

const STATES = {
  solid: { label: 'Ice (Solid)', temp: -15, speed: 0.05, spread: 2.0, color: '#f7fafc' },
  liquid: { label: 'Water (Liquid)', temp: 25, speed: 0.2, spread: 2.0, color: '#4299e1' },
  gas: { label: 'Steam (Gas)', temp: 110, speed: 0.8, spread: 3.5, color: '#cbd5e0' },
};

function MatterParticles({ stateKey, temperature }) {
  const count = 600;
  const meshRef = useRef();
  const config = STATES[stateKey];
  
  // Normalized speed based on temperature
  const tempFactor = (temperature + 50) / 250; 
  const currentSpeed = config.speed * (0.5 + tempFactor);

  // Initialize ordered positions for solid, random for others
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const side = Math.ceil(Math.pow(count, 1/3));
    const spacing = 0.25;

    for (let i = 0; i < count; i++) {
        // Grid pattern for solid
        const x = (i % side) * spacing - (side * spacing) / 2;
        const y = Math.floor((i / side) % side) * spacing - (side * spacing) / 2;
        const z = Math.floor(i / (side * side)) * spacing - (side * spacing) / 2;
        
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
    }
    return pos;
  }, []); // Only once

  // State transitions and movement
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const posArr = meshRef.current.geometry.attributes.position.array;
    const spacing = 0.25;
    const side = Math.ceil(Math.pow(count, 1/3));

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      
      if (stateKey === 'solid') {
        // Target positions (grid)
        const tx = (i % side) * spacing - (side * spacing) / 2;
        const ty = Math.floor((i / side) % side) * spacing - (side * spacing) / 2;
        const tz = Math.floor(i / (side * side)) * spacing - (side * spacing) / 2;

        // Vibrate around target
        posArr[idx] += (tx - posArr[idx]) * 0.1 + Math.sin(time * 30 + i) * 0.002 * tempFactor;
        posArr[idx + 1] += (ty - posArr[idx + 1]) * 0.1 + Math.cos(time * 30 + i) * 0.002 * tempFactor;
        posArr[idx + 2] += (tz - posArr[idx + 2]) * 0.1 + Math.sin(time * 30 + i) * 0.002 * tempFactor;
      } 
      else if (stateKey === 'liquid') {
        // Brownian motion + gravity feel
        posArr[idx] += (Math.random() - 0.5) * currentSpeed * 0.1;
        posArr[idx + 1] += (Math.random() - 0.5) * currentSpeed * 0.1 - 0.005; // Sink slightly
        posArr[idx + 2] += (Math.random() - 0.5) * currentSpeed * 0.1;

        // Boundary checks (simulating a bowl/container)
        if (Math.abs(posArr[idx]) > 1.2) posArr[idx] *= 0.95;
        if (posArr[idx + 1] < -1.0) posArr[idx + 1] = -1.0;
        if (posArr[idx + 1] > 0.0) posArr[idx + 1] *= 0.95;
        if (Math.abs(posArr[idx + 2]) > 1.2) posArr[idx + 2] *= 0.95;
      }
      else {
        // Gas: Fast random motion in all directions
        posArr[idx] += (Math.random() - 0.5) * currentSpeed * 0.2;
        posArr[idx + 1] += (Math.random() - 0.5) * currentSpeed * 0.2;
        posArr[idx + 2] += (Math.random() - 0.5) * currentSpeed * 0.2;

        // Bounce back from boundaries
        if (Math.abs(posArr[idx]) > 2.0) posArr[idx] *= -0.99;
        if (Math.abs(posArr[idx + 1]) > 2.0) posArr[idx + 1] *= -0.99;
        if (Math.abs(posArr[idx + 2]) > 2.0) posArr[idx + 2] *= -0.99;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={meshRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors={false}
        color={config.color}
        size={stateKey === 'solid' ? 0.08 : 0.06}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function StatesOfMatter3D() {
  const [temperature, setTemperature] = useState(20);
  const [stateKey, setStateKey] = useState('liquid');

  useEffect(() => {
    if (temperature <= 0) setStateKey('solid');
    else if (temperature >= 100) setStateKey('gas');
    else setStateKey('liquid');
  }, [temperature]);

  const controls = (
    <div className="space-y-6">
      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <label className="text-sm font-medium mb-3 flex justify-between">
          <span>Temperature</span>
          <span className="text-primary-light font-mono">{temperature}°C</span>
        </label>
        <input 
          type="range" min="-50" max="150" value={temperature} 
          onChange={(e) => setTemperature(parseInt(e.target.value))}
          className="w-full accent-primary-vibrant"
        />
        <div className="flex justify-between text-[10px] text-gray-500 mt-2">
            <span>Freezing (-50°)</span>
            <span>Boiling (150°)</span>
        </div>
      </div>

      <div className="bg-primary-vibrant/10 p-4 rounded-xl border border-primary-vibrant/20">
        <h4 className="text-sm font-bold text-primary-light mb-1">{STATES[stateKey].label}</h4>
        <p className="text-xs text-gray-400 leading-relaxed">
            {stateKey === 'solid' && "Particles are arranged in a regular, fixed pattern. They vibrate but do not move from place to place."}
            {stateKey === 'liquid' && "Particles are close together but in an irregular arrangement. They can flow and take the shape of a container."}
            {stateKey === 'gas' && "Particles are far apart and move rapidly in all directions. They have high kinetic energy."}
        </p>
      </div>
    </div>
  );

  const theory = (
    <div className="space-y-4">
      <section>
        <h4 className="text-primary-light font-bold mb-1">The Kinetic Theory</h4>
        <p className="text-sm text-gray-300">Matter is made up of tiny particles that are constantly moving. The amount of movement depends on the kinetic energy (temperature) of the particles.</p>
      </section>
      <section>
        <h4 className="text-primary-light font-bold mb-1">Key Processes</h4>
        <ul className="text-sm text-gray-300 space-y-1 list-disc pl-4">
          <li><strong>Melting:</strong> Solid to Liquid (Heat added)</li>
          <li><strong>Boiling:</strong> Liquid to Gas (Heat added)</li>
          <li><strong>Freezing:</strong> Liquid to Solid (Heat removed)</li>
          <li><strong>Condensation:</strong> Gas to Liquid (Heat removed)</li>
        </ul>
      </section>
    </div>
  );

  return (
    <ExperimentShell 
      title="States of Matter" 
      subject="chemistry"
      controls={controls} 
      theory={theory}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 5, 15]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <MatterParticles stateKey={stateKey} temperature={temperature} />
        
        {/* Container visualized for liquid/solid */}
        <Box args={[3, 3, 3]}>
          <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.1} />
        </Box>

        <OrbitControls enablePan={false} maxDistance={10} minDistance={3} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </ExperimentShell>
  );
}
