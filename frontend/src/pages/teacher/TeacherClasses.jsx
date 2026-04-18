import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, ChevronRight, Search } from 'lucide-react';
import axios from 'axios';

export default function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/classes')
      .then(response => {
        if (response.data.success) {
          setClasses(response.data.classes);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching classes:', error);
        setLoading(false);
      });
  }, []);

  const filteredClasses = classes.filter(c => 
    `${c.grade_or_form} ${c.class}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-500 mt-1">Manage and track performance across your student groups.</p>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search classes..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-vibrant"></div>
        </div>
      ) : filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classData, idx) => (
            <div 
              key={idx}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-vibrant/10 text-primary-vibrant rounded-lg group-hover:bg-primary-vibrant group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                  {classData.student_count} Students
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {classData.grade_or_form} - {classData.class}
              </h3>
              <p className="text-sm text-gray-500 mb-6">Science & Technology Group</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <span>View reports</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-vibrant transition-colors" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No classes found</h3>
          <p className="text-gray-500">Try adjusting your search or contact the admin to link classes.</p>
        </div>
      )}
    </div>
  );
}
