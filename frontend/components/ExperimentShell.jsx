import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AITutorPanel from '../src/components/common/AITutorPanel';

export default function ExperimentShell({ 
  title, 
  subject = "general",
  controls, 
  theory, 
  children,
  theoryLabel = "Experiment Theory" 
}) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [showControlsHint, setShowControlsHint] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use state to handle initial desktop view correctly
  useEffect(() => {
     if (isMobile) setIsPanelOpen(false);
     else setIsPanelOpen(true);
  }, [isMobile]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative', 
      overflow: 'hidden', 
      background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      {/* 3D Canvas Area */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {children}
      </div>

      {/* Control Navigation - Desktop (Left) / Mobile (Bottom Bar) */}
      <div style={{
          position: 'absolute',
          zIndex: 20,
          left: isMobile ? 0 : 20,
          top: isMobile ? 'auto' : 20,
          bottom: isMobile ? 0 : 'auto',
          width: isMobile ? '100%' : 'auto',
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: '10px',
          padding: isMobile ? '10px' : '0'
      }}>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            style={{
              width: isMobile ? 'calc(100% - 120px)' : '48px',
              height: '48px',
              borderRadius: isMobile ? '12px' : '24px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ddd',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#1e293b'
            }}
          >
            {isPanelOpen ? (isMobile ? '🔽 Hide Panels' : '◀') : (isMobile ? '🔼 Show Controls' : '▶')}
          </button>

          <button
            onClick={() => setIsAITutorOpen(!isAITutorOpen)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '24px',
              background: isAITutorOpen ? '#3b82f6' : 'rgba(255, 255, 255, 0.95)',
              color: isAITutorOpen ? 'white' : '#1e293b',
              border: '1px solid #ddd',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}
            title="Ask AI Tutor"
          >
            🤖
          </button>

          <button
            onClick={() => setShowControlsHint(!showControlsHint)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '24px',
              background: showControlsHint ? '#3b82f6' : 'rgba(255, 255, 255, 0.95)',
              color: showControlsHint ? 'white' : '#1e293b',
              border: '1px solid #ddd',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}
          >
            {showControlsHint ? '✖' : '🎮'}
          </button>
      </div>

      <AITutorPanel 
        isOpen={isAITutorOpen} 
        onClose={() => setIsAITutorOpen(false)} 
        context={{ experiment: title, subject: subject }}
      />

      {/* Main Side Panel / Bottom Sheet */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={isMobile ? { y: 400 } : { x: -350 }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: 400 } : { x: -350 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'absolute',
              left: isMobile ? 0 : 20,
              right: isMobile ? 0 : 'auto',
              top: isMobile ? 'auto' : 80,
              bottom: isMobile ? 0 : 20,
              width: isMobile ? '100%' : '320px',
              maxHeight: isMobile ? '60vh' : 'calc(100% - 100px)',
              background: 'rgba(255, 255, 255, 0.98)',
              padding: '24px',
              borderTopLeftRadius: isMobile ? '20px' : '16px',
              borderTopRightRadius: isMobile ? '20px' : '16px',
              borderBottomLeftRadius: isMobile ? 0 : '16px',
              borderBottomRightRadius: isMobile ? 0 : '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              zIndex: 15
            }}
          >
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#0f172a', 
              fontSize: '1.1rem',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '12px'
            }}>
              🧪 {title}
            </h3>

            <div style={{ flex: '1 0 auto', marginBottom: '24px' }}>
              {controls}
            </div>

            {theory && (
              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginTop: 'auto'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1e40af', fontSize: '0.9rem' }}>📖 {theoryLabel}</h4>
                {theory.formula && (
                  <p style={{ margin: '8px 0', fontSize: '14px', color: '#334155', fontWeight: '600' }}>
                    {theory.formula}
                  </p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {theory.values && theory.values.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#64748b' }}>{item.label}:</span>
                      <span style={{ color: '#0f172a', fontWeight: '500' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isMobile && <div style={{ height: '70px' }} />} {/* Space for bar */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggleable Controls Hint */}
      <AnimatePresence>
        {showControlsHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{
              position: 'absolute',
              right: 20,
              top: isMobile ? 'auto' : 20,
              bottom: isMobile ? 80 : 'auto',
              background: 'rgba(15, 23, 42, 0.9)',
              color: 'white',
              padding: '20px',
              borderRadius: '16px',
              width: '240px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(8px)',
              zIndex: 30
            }}
          >
            <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>🎮 Simulation Help</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                <span style={{ fontSize: '1.2rem' }}>🖱️</span>
                <span><strong>Rotate:</strong> Left Click + Drag</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                <span style={{ fontSize: '1.2rem' }}>🔄</span>
                <span><strong>Zoom:</strong> Scroll Wheel</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                <span style={{ fontSize: '1.2rem' }}>✋</span>
                <span><strong>Pan:</strong> Right Click + Drag</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
