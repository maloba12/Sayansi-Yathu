import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Calendar, BookOpen, Clock, Search, X } from 'lucide-react';
import axios from 'axios';

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    experiment_id: '',
    grade_or_form: '',
    class: '',
    due_date: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignRes, expRes, classRes] = await Promise.all([
        axios.get('http://localhost:5000/api/assignments?teacher_id=2'), // Hardcoded teacher_id for demo
        axios.get('http://localhost:5000/api/experiments'),
        axios.get('http://localhost:5000/api/classes')
      ]);

      if (assignRes.data.success) setAssignments(assignRes.data.assignments);
      if (expRes.data.success) setExperiments(assignRes.data.experiments || []); // Fallback if data structure slightly different
      
      // Handle experiment data structure correctly
      if (expRes.data.experiments) setExperiments(expRes.data.experiments);
      
      if (classRes.data.success) setClasses(classRes.data.classes);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/assignments', {
        ...formData,
        teacher_id: 2 // Hardcoded for demo matching seed
      });
      if (response.data.success) {
        setShowModal(false);
        setFormData({ title: '', description: '', experiment_id: '', grade_or_form: '', class: '', due_date: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleClassChange = (e) => {
    const [grade, cls] = e.target.value.split('|');
    setFormData({ ...formData, grade_or_form: grade, class: cls });
  };

  const filteredAssignments = assignments.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.experiment_title && a.experiment_title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-500 mt-1">Create and manage tasks for your students.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search assignments..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-vibrant text-white rounded-lg hover:bg-primary-vibrant/90 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-vibrant"></div>
        </div>
      ) : filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <div 
              key={assignment.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  new Date(assignment.due_date) < new Date() ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {assignment.grade_or_form} - {assignment.class}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">{assignment.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{assignment.description}</p>
              
              <div className="space-y-3 pt-4 border-t border-gray-50">
                {assignment.experiment_title && (
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2 text-primary-vibrant" />
                    <span className="font-medium">{assignment.experiment_title}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No assignments found</h3>
          <p className="text-gray-500">Click "New Assignment" to get started.</p>
        </div>
      )}

      {/* Modal - Basic Implementation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Create New Assignment</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Simple Pendulum Lab Report"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Class</label>
                  <select 
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant outline-none"
                    onChange={handleClassChange}
                  >
                    <option value="">Select Class</option>
                    {classes.map((c, i) => (
                      <option key={i} value={`${c.grade_or_form}|${c.class}`}>{c.grade_or_form} - {c.class}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant outline-none"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Linked Experiment</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant outline-none"
                  value={formData.experiment_id}
                  onChange={(e) => setFormData({...formData, experiment_id: e.target.value})}
                >
                  <option value="">None / General Task</option>
                  {experiments.map(exp => (
                    <option key={exp.id} value={exp.id}>{exp.title} ({exp.subject})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide instructions to your students..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-primary-vibrant text-white rounded-lg hover:bg-primary-vibrant/90 transition-colors shadow-sm font-medium"
                >
                  Post Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
