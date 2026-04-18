import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Info, AlertCircle, Download } from 'lucide-react';

const mockLogs = [
  { id: 1, timestamp: '2026-03-19 14:22:01', user: 'Admin User', action: 'Login Success', ip: '192.168.1.45', severity: 'INFO' },
  { id: 2, timestamp: '2026-03-19 14:15:30', user: 'System', action: 'Database Backup Completed', ip: 'localhost', severity: 'INFO' },
  { id: 3, timestamp: '2026-03-19 13:45:11', user: 'Unknown', action: 'Failed Login Attempt (3x)', ip: '41.222.18.99', severity: 'WARNING' },
  { id: 4, timestamp: '2026-03-19 11:30:00', user: 'System', action: 'High Memory Usage (92%)', ip: 'server-01', severity: 'CRITICAL' },
  { id: 5, timestamp: '2026-03-19 10:12:45', user: 'Mrs. Banda', action: 'Password Reset Requested', ip: '10.0.0.12', severity: 'INFO' },
];

export default function SecurityLogs() {
  const [filter, setFilter] = useState('ALL');

  const filteredLogs = filter === 'ALL' ? mockLogs : mockLogs.filter(log => log.severity === filter);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security & Activity Logs</h1>
          <p className="text-gray-500 mt-1">Monitor system events, user activity, and security alerts.</p>
        </div>
        <button className="flex items-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
        <div className="flex space-x-2 w-full md:w-auto">
          {['ALL', 'INFO', 'WARNING', 'CRITICAL'].map(level => (
            <button 
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === level
                  ? 'bg-primary-dark text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input 
            type="text" 
            placeholder="Search logs by user, IP, or action..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-light transition-all"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">User / Source</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Action / Event</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.severity === 'INFO' && <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md max-w-min border border-blue-100"><Info className="w-4 h-4 mr-1" /> INFO</span>}
                    {log.severity === 'WARNING' && <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded-md max-w-min border border-amber-100"><AlertTriangle className="w-4 h-4 mr-1" /> WARN</span>}
                    {log.severity === 'CRITICAL' && <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-md max-w-min border border-red-100"><AlertCircle className="w-4 h-4 mr-1" /> CRIT</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-sans font-medium text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 font-sans text-gray-700">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No logs found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
