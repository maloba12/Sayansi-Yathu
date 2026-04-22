import React, { useRef, useEffect, useState } from 'react';
import { Camera, AlertCircle, Maximize, X } from 'lucide-react';

export default function ComputerVisionDemo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API not supported in this browser.");
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsDetecting(true);
      } catch (err) {
        setError(err.message || "Failed to access camera.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isDetecting) return;
    
    // Simulate lightweight CV detection (e.g., MediaPipe)
    // using native requestAnimationFrame to draw fake bounding boxes
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let t = 0;

    const drawDetection = () => {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       
       // Calculate an undulating box in the center representing object tracking
       const cx = canvas.width / 2;
       const cy = canvas.height / 2;
       const size = 150 + Math.sin(t * 0.05) * 10;
       
       ctx.strokeStyle = '#3b82f6';
       ctx.lineWidth = 3;
       ctx.strokeRect(cx - size/2, cy - size/2, size, size);
       
       // Draw corners
       const offset = 15;
       ctx.beginPath();
       ctx.moveTo(cx - size/2, cy - size/2 + offset);
       ctx.lineTo(cx - size/2, cy - size/2);
       ctx.lineTo(cx - size/2 + offset, cy - size/2);
       ctx.stroke();

       // Status text
       ctx.fillStyle = '#3b82f6';
       ctx.font = '14px Arial';
       ctx.fillText("Equipment Aligned: 82%", cx - size/2, cy - size/2 - 10);
       
       t++;
       animationId = requestAnimationFrame(drawDetection);
    };
    
    drawDetection();

    return () => cancelAnimationFrame(animationId);
  }, [isDetecting]);

  return (
    <div className="flex flex-col h-[500px] bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-700 shadow-xl">
      {/* Header */}
      <div className="absolute top-0 w-full p-4 z-10 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center text-white">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-sm">Computer Vision Tool (Demo)</h3>
        </div>
        <span className="bg-blue-600/20 text-blue-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider backdrop-blur-md">
          Experimental
        </span>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {error ? (
           <div className="text-center p-6 text-slate-400">
             <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-600" />
             <p className="font-semibold text-slate-300">Camera Unavailable</p>
             <p className="text-sm mt-2">{error}</p>
             <p className="text-xs bg-slate-800 p-3 rounded-lg mt-4 inline-block tracking-wider">
               Offline CV Module is running in degraded mode.
             </p>
           </div>
        ) : (
           <>
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               muted 
               className="w-full h-full object-cover"
               onLoadedMetadata={() => {
                 canvasRef.current.width = videoRef.current.clientWidth;
                 canvasRef.current.height = videoRef.current.clientHeight;
               }}
             />
             <canvas 
               ref={canvasRef} 
               className="absolute top-0 left-0 w-full h-full pointer-events-none" 
             />
           </>
        )}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 w-full p-4 z-10 bg-gradient-to-t from-black/80 to-transparent text-center">
        <p className="text-sm font-medium text-slate-300 flex items-center justify-center">
          <Maximize className="w-4 h-4 mr-2 text-slate-400" />
          Point your camera at the physical lab apparatus
        </p>
      </div>
    </div>
  );
}
