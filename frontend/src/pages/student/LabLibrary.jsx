import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, Loader2, TestTube2 } from 'lucide-react';
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
          const formattedLabs = response.data.simulations.map(dbLab => ({
            id: dbLab.id,
            simType: dbLab.simulation_type,
            title: dbLab.title,
            subject: dbLab.subject ? dbLab.subject.charAt(0).toUpperCase() + dbLab.subject.slice(1) : '',
            level: dbLab.grade_or_form
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
    // Navigate to the simulation viewer
    window.location.href = `/index_3d.html?type=${simId}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Virtual Lab Library</h1>
        <p className="text-gray-500 mt-1">Browse and launch interactive 3D experiments.</p>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['All', 'Physics', 'Chemistry', 'Biology'].map(subject => (
          <button 
            key={subject}
            onClick={() => setFilter(subject)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === subject 
                ? 'bg-primary-vibrant text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredLabs.map(lab => (
          <div key={lab.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-premium transition-all">
            <div className="h-40 bg-gray-100 relative">
              {/* Thumbnail Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 bg-primary-dark">
                <Play className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => startSimulation(lab.simType)}
                  className="bg-primary-vibrant text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
                >
                  <Play className="w-6 h-6 ml-1" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-primary-vibrant">{lab.subject}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{lab.level}</span>
              </div>
              <h3 className="font-bold text-gray-900">{lab.title}</h3>
            </div>
          </div>
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
