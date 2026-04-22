import React, { useState, useEffect } from 'react';
import { ScanFace, Smartphone, AlertTriangle } from 'lucide-react';

export default function ARAssistant() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const checkWebXR = async () => {
      if ('xr' in navigator) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setStatus(supported ? 'ready' : 'unsupported');
        } catch (e) {
          setStatus('unsupported');
        }
      } else {
        setStatus('unsupported');
      }
    };
    checkWebXR();
  }, []);

  return (
    <div className="flex flex-col h-[500px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-xl relative">
      <div className="absolute top-0 w-full p-4 z-10 bg-black/40 flex justify-between items-center text-white">
        <div className="flex items-center space-x-2">
          <ScanFace className="w-5 h-5 text-fuchsia-400" />
          <h3 className="font-bold text-sm">AR Lab Assistant (Demo)</h3>
        </div>
        <span className="bg-fuchsia-600/20 text-fuchsia-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider backdrop-blur-md">
          WebXR Build
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-900 to-black">
        {status === 'checking' && (
          <div className="animate-pulse">
            <ScanFace className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium tracking-wide">Checking AR compatibility...</p>
          </div>
        )}
        
        {status === 'ready' && (
           <div className="animate-fade-in-up">
             <Smartphone className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
             <h4 className="text-2xl font-bold text-white mb-2">AR Ready</h4>
             <p className="text-slate-400 mb-8 max-w-sm mx-auto">
               Your device supports immersive AR. Point your camera at a printed Sayansi Yathu marker to securely overlay the experiment instructions.
             </p>
             <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-900/50 transition-all">
               Launch AR Session
             </button>
           </div>
        )}

        {status === 'unsupported' && (
           <div>
             <AlertTriangle className="w-20 h-20 text-amber-500 mx-auto mb-6" />
             <h4 className="text-xl font-bold text-white mb-2">WebXR Not Supported</h4>
             <p className="text-slate-400 mb-6 max-w-sm mx-auto text-sm">
               Your current browser or device does not support native WebXR. The AR overlay module requires a compatible mobile browser.
             </p>
             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 max-w-xs mx-auto text-left">
                <p className="text-xs text-slate-300 font-semibold mb-2 uppercase tracking-wide">Offline Safe Mode:</p>
                <p className="text-xs text-slate-400">
                  Heavy AR models (AR.js) are intentionally disabled to keep the bundle size &lt;5MB for Zambian remote deployments.
                </p>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
