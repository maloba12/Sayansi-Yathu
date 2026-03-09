import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExperimentShell({ title, controls, theory, children }) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)' }}>
      {/* 3D Canvas Area */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {children}
      </div>

      {/* Left Panel Toggle Button */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        style={{
          position: 'absolute',
          left: isPanelOpen ? 320 : 20,
          top: 20,
          zIndex: 10,
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #ddd',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {isPanelOpen ? '◀' : '▶'}
      </button>

      {/* Left Physics Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'absolute',
              left: 20,
              top: 20,
              bottom: 20,
              width: '300px',
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}
          >
            <h3 style={{ margin: '0 0 20px 0', color: '#333', paddingRight: '30px' }}>
              🧪 {title} Controls
            </h3>

            {/* Controls Slot */}
            <div style={{ flex: '1 0 auto', marginBottom: '20px' }}>
              {controls}
            </div>

            {/* Theory Panel Slot */}
            {theory && (
              <div style={{
                background: 'rgba(240, 248, 255, 0.8)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #B0D4E3',
                marginTop: 'auto'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2C5282' }}>📐 Physics Theory</h4>
                {theory.formula && (
                  <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold' }}>
                    {theory.formula}
                  </p>
                )}
                {theory.values && theory.values.map((item, idx) => (
                  <p key={idx} style={{ margin: '5px 0', fontSize: '14px' }}>
                    <strong>{item.label}:</strong> {item.value}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Hints Overlay */}
      <div style={{
        position: 'absolute',
        right: 20,
        top: 20,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '15px',
        borderRadius: '8px',
        maxWidth: '250px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>🎮 Controls</h4>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          🖱️ <strong>Mouse:</strong> Rotate view
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          🔄 <strong>Scroll:</strong> Zoom in/out
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          ✋ <strong>Drag:</strong> Pan camera
        </p>
      </div>
    </div>
  );
}
