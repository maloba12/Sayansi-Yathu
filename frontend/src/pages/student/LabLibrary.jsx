import React, { useState, useEffect } from 'react';
import { TestTube2 } from 'lucide-react';
import ExperimentCard from '../../components/common/ExperimentCard';
import axios from 'axios';
import ComputerVisionDemo from '../../components/experimental/ComputerVisionDemo';
import ARAssistant from '../../components/experimental/ARAssistant';

export default function LabLibrary() {
  const [filter, setFilter] = useState('All');
  const [allLabs, setAllLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/simulations/list.php');
        if (response.data && response.data.success) {
          const studentGrade = localStorage.getItem('user_data') 
            ? JSON.parse(localStorage.getItem('user_data')).grade || JSON.parse(localStorage.getItem('user_data')).level || 'Grade 11'
            : 'Grade 11';

          const formattedLabs = response.data.simulations
            .filter(dbLab => {
              const labLevel = dbLab.grade_or_form || '';
              return labLevel.toLowerCase().includes(studentGrade.toLowerCase()) || 
                     studentGrade.toLowerCase().includes(labLevel.toLowerCase());
            })
            .map(dbLab => ({
              id: dbLab.id,
              simType: dbLab.simulation_type,
              title: dbLab.title,
              subject: dbLab.subject ? dbLab.subject.charAt(0).toUpperCase() + dbLab.subject.slice(1) : '',
              level: dbLab.grade_or_form,
              difficulty: dbLab.difficulty_level || 'Beginner',
              description: dbLab.description
            }));
          setAllLabs(formattedLabs);
        }
      } catch (error) {
        console.error('Failed to fetch simulations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const filteredLabs = filter === 'All' ? allLabs : allLabs.filter(lab => lab.subject === filter);

  const startSimulation = (simId) => {
    window.location.href = `/index_3d.html?type=${simId}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Virtual Lab Library</h1>
        <p className="text-gray-500 mt-1">Browse and launch interactive 3D experiments.</p>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['All', 'Physics', 'Chemistry', 'Biology'].map(subject => (
          <button 
            key={subject}
            onClick={() => setFilter(subject)}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              filter === subject 
                ? 'bg-primary-vibrant text-white shadow-xl shadow-primary-vibrant/20' 
                : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Physics Module Invitation (Special Case) */}
      {(filter === 'All' || filter === 'Physics') && (
        <div className="bg-gradient-to-r from-primary-dark to-slate-900 rounded-3xl p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl border border-white/5 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-vibrant/20 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 flex items-center space-x-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
               <TestTube2 className="w-10 h-10 text-white" />
            </div>
            <div>
               <h2 className="text-3xl font-black italic tracking-tight">Physics Virtual Lab</h2>
               <p className="text-slate-300 mt-2 max-w-lg leading-relaxed text-sm">Explore the full curriculum library with 23+ experiments, detailed theory, and interactive assessments.</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.hash = '#/student/lab/physics'}
            className="relative z-10 px-10 py-4 bg-primary-vibrant text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:shadow-primary-vibrant/40 hover:-translate-y-1 transition-all whitespace-nowrap"
          >
            Browse Curriculum →
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredLabs.map(lab => (
          <ExperimentCard 
            key={lab.id} 
            experiment={lab} 
            onStart={() => startSimulation(lab.simType)}
            onPreview={() => startSimulation(lab.simType)}
          />
        ))}
      </div>

      {/* Experimental Section */}
      <div className="pt-12 mt-12 border-t border-gray-200">
        <div className="mb-6 flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <TestTube2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Experimental Advanced Modules</h2>
            <p className="text-gray-500 mt-1">Browser-optimized WebXR and algorithmic CV positioning (Offline safe).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <ComputerVisionDemo />
           <ARAssistant />
        </div>
      </div>
    </div>
  );
}
