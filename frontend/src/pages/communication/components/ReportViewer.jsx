import React from 'react';
import { Sparkles, FileBox, Archive, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';

export default function ReportViewer({ activeItem, onArchive }) {
  if (!activeItem) return null;

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
        <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          {activeItem.class} • {activeItem.subject}
        </span>
        <button onClick={onArchive} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100">
          <Archive className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* AI Insight Bar */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100 shadow-sm flex items-start space-x-3">
          <div className="p-1.5 bg-emerald-100 rounded-lg shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 mb-1">AI Performance Summary</h5>
            <p className="text-sm text-emerald-900 leading-relaxed font-medium">
              Based on the submitted data, this class is performing well in practical scientific inquiry. However, they are missing the target of 12 experiments per term.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Monthly SBA Report - {activeItem.date}</h2>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
           <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
             <FileBox className="w-6 h-6 text-emerald-500 mb-2" />
             <p className="text-2xl font-bold text-gray-900">{activeItem.experiments}</p>
             <p className="text-[10px] uppercase font-bold text-gray-400">Labs Logged</p>
           </div>
           <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
             <TrendingUp className="w-6 h-6 text-blue-500 mb-2" />
             <p className="text-2xl font-bold text-gray-900">76%</p>
             <p className="text-[10px] uppercase font-bold text-gray-400">Avg Class Score</p>
           </div>
           <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
             <BookOpen className="w-6 h-6 text-purple-500 mb-2" />
             <p className="text-2xl font-bold text-gray-900">Chemistry</p>
             <p className="text-[10px] uppercase font-bold text-gray-400">Subject Taught</p>
           </div>
        </div>

        <div className="mt-8">
           <h3 className="font-bold text-lg text-gray-800 mb-4">Teacher's Note</h3>
           <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-sm text-amber-900 leading-relaxed">
              <AlertCircle className="w-5 h-5 text-amber-500 mb-2" />
              "Students are struggling significantly with the Titration module due to mathematical calculations regarding Moles. Will require extra review next week."
           </div>
        </div>
      </div>
    </div>
  );
}
