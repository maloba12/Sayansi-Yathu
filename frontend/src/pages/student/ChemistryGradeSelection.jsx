import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, GraduationCap, ArrowLeft } from 'lucide-react';
import { GRADES } from '../../data/chemistryExperiments';

export default function ChemistryGradeSelection() {
  const navigate = useNavigate();

  // Load student data for access control
  const studentData = localStorage.getItem('user_data') 
    ? JSON.parse(localStorage.getItem('user_data')) 
    : { grade: 'Grade 11' };
  
  const studentGrade = studentData.grade || studentData.level || 'Grade 11';

  // Strict Restriction: Only allow students to see their own grade
  const availableGrades = GRADES.filter(grade => 
    grade.toLowerCase() === studentGrade.toLowerCase()
  );

  const gradeDetails = {
    'Grade 10': {
      topics: 'Matter, Acids and Bases, Atomic Structure, Solutions',
      image: '/assets/experiment_placeholder.jpg',
      color: 'from-orange-500 to-amber-600',
      description: 'Foundational chemistry principles and laboratory techniques.'
    },
    'Grade 11': {
      topics: 'Volumetric Analysis, Reaction Kinetics, Electrochemistry, Qualitative Analysis',
      image: '/assets/experiment_placeholder.jpg',
      color: 'from-emerald-500 to-teal-600',
      description: 'Exploring reactions, titrations and electrochemical cells.'
    },
    'Grade 12': {
      topics: 'Qualitative Analysis, Thermodynamics, Organic Chemistry, Equilibrium',
      image: '/assets/experiment_placeholder.jpg',
      color: 'from-blue-500 to-indigo-600',
      description: 'Advanced analysis, enthalpy, and chemical equilibrium.'
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/student/lab')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 italic tracking-tight underline decoration-primary-vibrant/20 underline-offset-8">Chemistry Virtual Lab</h1>
            <p className="text-gray-500 mt-2 font-medium">Explore the experiment library for <span className="text-primary-vibrant font-black">{studentGrade}</span>.</p>
          </div>
        </div>
        
        <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl flex items-center space-x-2">
           <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
           <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Access: Restricted to {studentGrade}</span>
        </div>
      </div>

      {availableGrades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {availableGrades.map((grade) => (
            <div 
              key={grade}
              onClick={() => navigate(`/student/lab/chemistry/${grade.replace(' ', '')}`)}
              className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-premium transition-all duration-500 cursor-pointer"
            >
              {/* Visual Header */}
              <div className={`h-40 bg-gradient-to-br ${gradeDetails[grade] ? gradeDetails[grade].color : 'from-gray-500 to-gray-600'} p-8 flex flex-col justify-end text-white relative overflow-hidden`}>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                 <GraduationCap className="absolute top-6 right-6 w-16 h-16 opacity-20 group-hover:scale-125 transition-transform duration-700" />
                 <h2 className="text-3xl font-black italic tracking-tight">{grade}</h2>
              </div>

              <div className="p-8 space-y-6">
                <p className="text-gray-500 font-medium leading-relaxed">
                  {gradeDetails[grade] ? gradeDetails[grade].description : 'Explore curriculum experiments.'}
                </p>
                
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Core Learning Modules</p>
                  <div className="flex flex-wrap gap-2">
                    {gradeDetails[grade] && gradeDetails[grade].topics.split(', ').map(topic => (
                      <span key={topic} className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded-lg uppercase tracking-wider group-hover:bg-primary-vibrant/5 group-hover:text-primary-vibrant transition-colors">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full flex items-center justify-center space-x-3 py-4 bg-gray-50 text-primary-vibrant font-black uppercase tracking-widest text-[10px] rounded-2xl group-hover:bg-primary-vibrant group-hover:text-white transition-all shadow-sm active:scale-95 shadow-primary-vibrant/5 hover:shadow-primary-vibrant/20">
                  <span>Enter {grade} Library</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 bg-white rounded-[2rem] border border-gray-100 border-dashed flex flex-col items-center justify-center text-center p-10 max-w-2xl mx-auto shadow-sm">
           <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
              <GraduationCap className="w-10 h-10 text-amber-500" />
           </div>
           <h3 className="text-2xl font-black italic text-gray-900 tracking-tight">Curriculum Not Matching</h3>
           <p className="text-gray-500 mt-4 leading-relaxed font-medium">
             You are currently registered in <span className="font-black text-slate-900">{studentGrade}</span>. The Chemistry curriculum module you've accessed is exclusively for Secondary School Grades 10, 11, and 12.
           </p>
           <button 
             onClick={() => navigate('/student/lab')}
             className="mt-8 px-8 py-4 bg-primary-vibrant text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary-vibrant/20 hover:-translate-y-1 transition-all"
           >
             Return to My Lab Library
           </button>
        </div>
      )}
    </div>
  );
}
