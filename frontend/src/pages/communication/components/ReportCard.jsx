import React from 'react';
import { FileBox, TrendingUp } from 'lucide-react';

export default function ReportCard({ report, isSelected, onClick }) {
  // E.g. progress calculation based on experiments
  const progress = Math.min(100, Math.max(0, (report.experiments / 12) * 100)); // assumes 12 is target

  return (
    <div 
      onClick={onClick}
      className={`relative p-4 rounded-2xl cursor-pointer border transition-all duration-200 mb-3
        ${isSelected ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
            <FileBox className="w-4 h-4" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Monthly SBA</span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">{report.date}</span>
      </div>

      <div className="mb-2">
        <h4 className="text-sm font-bold text-gray-800">{report.teacherName}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{report.class} • {report.subject}</p>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-600">{report.experiments} Labs Logged</span>
        </div>
        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
