import React from 'react';
import { 
  Play, 
  Info, 
  Clock, 
  BarChart, 
  Bookmark, 
  MoreHorizontal,
  ChevronRight,
  FlaskConical,
  Trophy
} from 'lucide-react';
import { getExperimentImage, SUBJECT_COLORS } from '../../utils/experimentAssets';

export default function ExperimentCard({ experiment, onStart, onPreview }) {
  const subjectStyles = SUBJECT_COLORS[experiment.subject?.toLowerCase()] || SUBJECT_COLORS.default;
  const imageUrl = getExperimentImage(experiment);

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-500 overflow-hidden flex flex-col h-full animate-in fade-in zoom-in-95">
      {/* Visual Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={experiment.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4">
          <div className="flex justify-between items-start">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md bg-white/20 text-white border border-white/20`}>
              {experiment.grade || experiment.level}
            </span>
            <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-gray-400 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?u=${experiment.id}${i}`} alt="user" />
                  </div>
                ))}
             </div>
             <p className="text-[10px] text-white/80 font-bold">12+ students active</p>
          </div>
        </div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-primary-dark/40 backdrop-blur-[2px]">
           <button 
             onClick={onStart}
             className="w-16 h-16 bg-primary-vibrant text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary-vibrant/40 hover:scale-110 transition-transform active:scale-95"
           >
              <Play className="w-8 h-8 fill-current ml-1" />
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className={`px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider border ${subjectStyles.bg} ${subjectStyles.text} ${subjectStyles.border}`}>
            {experiment.subject}
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase">{experiment.duration || '15 min'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase">{experiment.difficulty}</span>
            </div>
          </div>
        </div>

        <h3 className="font-black text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary-vibrant transition-colors">
          {experiment.title}
        </h3>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-6 leading-relaxed">
          {experiment.description || experiment.objective}
        </p>

        {/* Progress Bar (if in progress) */}
        <div className="mt-auto mb-6">
           <div className="flex justify-between items-center mb-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>Mastery</span>
              <span className="text-primary-vibrant">65%</span>
           </div>
           <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${subjectStyles.accent} rounded-full`} style={{ width: '65%' }}></div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onStart}
            className="flex items-center justify-center space-x-2 py-3 bg-primary-vibrant text-white rounded-2xl text-xs font-black hover:bg-primary-dark transition-all shadow-lg shadow-primary-vibrant/20 group/btn"
          >
            <span>Start Laboratory</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={onPreview}
            className="flex items-center justify-center space-x-2 py-3 bg-gray-50 text-gray-600 rounded-2xl text-xs font-black hover:bg-gray-100 transition-all"
          >
            <Info className="w-4 h-4" />
            <span>Theory Overview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
