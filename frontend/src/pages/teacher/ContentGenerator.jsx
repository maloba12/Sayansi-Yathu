import React, { useState } from 'react';
import { BrainCircuit, Loader2, Sparkles, Send, Copy, Check } from 'lucide-react';
import axios from 'axios';

export default function ContentGenerator() {
  const [topic, setTopic] = useState('Physics');
  const [contentType, setContentType] = useState('exam_questions');
  const [grade, setGrade] = useState('Grade 10');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!description) return;
    setIsGenerating(true);
    setResult(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/ai/generate-content', {
        type: contentType,
        topic: `${topic}: ${description}`,
        grade: grade
      });
      
      if (response.data.success) {
        setResult(response.data.content);
      } else {
        setResult("Failed to generate content. Please try again.");
      }
    } catch (error) {
      console.error('Generation Error:', error);
      setResult("Error: Could not connect to the AI backend. Please ensure the server is running on port 5000.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BrainCircuit className="w-8 h-8 mr-3 text-primary-vibrant" />
          AI Content Generator
        </h1>
        <p className="text-gray-500 mt-1">Generate ECZ-aligned assignments, exam questions, and lab reports instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel: Generation Controls */}
        <div className="md:col-span-1 border border-gray-200 bg-white rounded-xl shadow-sm p-6 space-y-6 flex flex-col">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Area</label>
            <select 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            >
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Integrated Science">Integrated Science</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <select 
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            >
              <option value="exam_questions">Exam Questions (ECZ Style)</option>
              <option value="worksheet">Laboratory Worksheet</option>
              <option value="lab_report">Lab Report Template</option>
              <option value="explanation">Concept Explanation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
            <select 
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            >
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specific Topic / Description</label>
            <textarea 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Measuring volume using a measuring cylinder."
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light resize-none"
            ></textarea>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !description}
            className="w-full flex justify-center items-center py-3 bg-primary-vibrant text-white rounded-lg font-medium hover:bg-primary-blue transition-colors disabled:opacity-70"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </button>
        </div>

        {/* Right Panel: Output */}
        <div className="md:col-span-2 border border-gray-200 bg-gray-50 rounded-xl shadow-sm p-6 overflow-y-auto" style={{ minHeight: '500px' }}>
          {result ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm min-h-full whitespace-pre-wrap font-mono text-sm">
              {result}
              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <button className="px-4 py-2 bg-primary-vibrant text-white rounded-lg text-sm hover:bg-primary-blue transition-colors shadow-sm">Assign to Class</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <BrainCircuit className="w-16 h-16 mb-4 opacity-50 text-gray-300" />
              <p>Your generated content will appear here.</p>
              {isGenerating && <p className="mt-2 text-primary-vibrant animate-pulse">Consulting the AI Science Expert...</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
